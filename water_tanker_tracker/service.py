"""Whitelisted API for the Water Tanker Tracker page (the page calls water_tanker_tracker.service.*).

Every call runs as the logged-in user, so Role Permission Manager and User Permissions decide what
they can read and change: nothing here uses ignore_permissions.
"""

import base64
import io
import json
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import frappe
from frappe import _
from frappe.utils import cint, flt, get_system_timezone, now_datetime, nowdate

from water_tanker_tracker.water_tanker_tracker.doctype.water_tanker_vehicle.water_tanker_vehicle import (
	normalise_vehicle_number,
)

ENTRY = "Water Tanker Entry"
SUPPLIER = "Water Supplier"
VEHICLE = "Water Tanker Vehicle"
LEVELS = ("Full", "Partial", "Low", "Not Checked")
TANKERS = ("RGI Group", "Rented")
STATUSES = ("Draft", "Inspected", "Closed")
PAGE_LENGTH = 30
MAX_ARRIVAL_BACKDATE_DAYS = 7

LIST_FIELDS = [
	"name",
	"arrival_datetime",
	"vehicle_number",
	"water_supplier",
	"driver_name",
	"tank_level_check",
	"status",
	"tanker_photo",
	"tanker_photo_stamped",
	"photo_capture_datetime",
	"latitude",
	"longitude",
	"location_address",
	"inspection_remarks",
]
DETAIL_FIELDS = LIST_FIELDS + [
	"tanker",
	"tanker_type",
	"expected_quantity",
	"checked_by",
	"observed_quantity",
	"tank_level_photo",
	"tank_level_photo_stamped",
	"tank_level_photo_datetime",
	"gps_accuracy",
	"created_by",
	"creation",
]
# what update_entry may change as plain values; photos are replaced only by a new capture (_replace_photos)
EDITABLE = (
	"tanker",
	"driver_name",
	"tanker_type",
	"expected_quantity",
	"tank_level_check",
	"checked_by",
	"observed_quantity",
	"inspection_remarks",
	"location_address",
	"status",
)


def _loads(value):
	if isinstance(value, str):
		value = json.loads(value or "{}")
	return value or {}


def _clean(value):
	return " ".join(str(value or "").split())


def _text(value):
	return str(value or "").strip()


def _number(value, label):
	if value in (None, ""):
		return None
	try:
		number = flt(value)
	except Exception:
		frappe.throw(_("{0} must be a number").format(label))
	if number < 0:
		frappe.throw(_("{0} cannot be negative").format(label))
	return number


def _row(doc):
	"""A document or row as plain values the page can show."""
	out = {}
	for key in DETAIL_FIELDS:
		value = doc.get(key)
		out[key] = str(value) if hasattr(value, "isoformat") else value
	return out


# ---- reference data ---------------------------------------------------------------------------------------


@frappe.whitelist()
def bootstrap():
	"""What the entry form needs to suggest: suppliers, known tankers, and who is logged in."""
	frappe.has_permission(ENTRY, "read", throw=True)
	suppliers = frappe.get_list(
		SUPPLIER, filters={"disabled": 0}, fields=["name", "contact_number"], order_by="name asc", limit_page_length=0
	)
	vehicles = frappe.get_list(
		VEHICLE,
		fields=["name", "water_supplier", "tanker_capacity", "capacity_uom"],
		order_by="name asc",
		limit_page_length=0,
	)
	return {
		"suppliers": suppliers,
		"vehicles": vehicles,
		"user": frappe.utils.get_fullname(frappe.session.user),
		"can_create": bool(frappe.has_permission(ENTRY, "create")),
		"can_write": bool(frappe.has_permission(ENTRY, "write")),
	}


# ---- dashboard and register ----------------------------------------------------------------------------


def _count(filters, or_filters=None):
	"""How many entries this user may see.

	Frappe 15 takes "count(name) as n" written as a string in `fields`. Frappe 16 refuses SQL functions written as
	strings ("SQL functions are not allowed as strings in SELECT") and wants {"COUNT": "name", "as": "n"}. The form
	is chosen from the running version; counting the names themselves is the fallback that works anywhere.
	"""
	major = cint(str(frappe.__version__).split(".")[0])
	fields = [{"COUNT": "name", "as": "n"}] if major >= 16 else ["count(name) as n"]
	queued = len(frappe.local.message_log)
	try:
		rows = frappe.get_list(ENTRY, filters=filters, or_filters=or_filters, fields=fields)
		return cint(rows[0].n) if rows else 0
	except frappe.PermissionError:
		raise
	except Exception:
		del frappe.local.message_log[queued:]  # the refused form leaves its message queued; do not show it
		return len(frappe.get_list(ENTRY, filters=filters, or_filters=or_filters, pluck="name", limit_page_length=0))


def _day(value, label):
	"""A date the page sent, checked; empty means no limit."""
	value = _text(value)
	if not value:
		return None
	try:
		return str(frappe.utils.getdate(value))
	except Exception:
		frappe.throw(_("{0} is not a valid date").format(label))


def _range_filters(from_date, to_date):
	"""Arrivals from the start of one day to the end of another, both included."""
	from_date, to_date = _day(from_date, _("From date")), _day(to_date, _("To date"))
	if from_date and to_date and from_date > to_date:
		frappe.throw(_("From date cannot be after To date"))
	filters = []
	if from_date:
		filters.append([ENTRY, "arrival_datetime", ">=", f"{from_date} 00:00:00"])
	if to_date:
		filters.append([ENTRY, "arrival_datetime", "<=", f"{to_date} 23:59:59"])
	return filters


@frappe.whitelist()
def dashboard(recent=8, from_date=None, to_date=None):
	"""Counts and the latest entries, for the dates asked (all dates when none); Today's Arrivals is always today."""
	frappe.has_permission(ENTRY, "read", throw=True)
	today = nowdate()
	window = _range_filters(from_date, to_date)
	return {
		"total": _count(window),
		"full": _count(window + [[ENTRY, "tank_level_check", "=", "Full"]]),
		"partial_low": _count(window + [[ENTRY, "tank_level_check", "in", ["Partial", "Low"]]]),
		"today": _count([[ENTRY, "arrival_datetime", "between", [f"{today} 00:00:00", f"{today} 23:59:59"]]]),
		"recent": [
			_row(r)
			for r in frappe.get_list(
				ENTRY,
				filters=window,
				fields=LIST_FIELDS,
				order_by="arrival_datetime desc, creation desc",
				limit_page_length=min(cint(recent) or 8, 20),
			)
		],
	}


def _entry_query(search=None, level=None, supplier=None, from_date=None, to_date=None):
	"""The filters the register and the report share: dates, supplier, tank level and a text search."""
	filters = _range_filters(from_date, to_date)
	supplier = _clean(supplier)
	if supplier:
		filters.append([ENTRY, "water_supplier", "=", supplier])
	level = _text(level)
	if level in LEVELS:
		filters.append([ENTRY, "tank_level_check", "=", level])
	elif level == "Partial / Low":
		filters.append([ENTRY, "tank_level_check", "in", ["Partial", "Low"]])

	or_filters = None
	term = _clean(search)
	if term:
		like = f"%{term}%"
		or_filters = [
			[ENTRY, field, "like", like]
			for field in ("name", "vehicle_number", "water_supplier", "driver_name", "inspection_remarks", "location_address")
		]
	return filters, or_filters


@frappe.whitelist()
def list_entries(search=None, level=None, supplier=None, from_date=None, to_date=None, start=0, page_length=PAGE_LENGTH):
	frappe.has_permission(ENTRY, "read", throw=True)
	filters, or_filters = _entry_query(search, level, supplier, from_date, to_date)
	total = _count(filters, or_filters)
	rows = frappe.get_list(
		ENTRY,
		filters=filters,
		or_filters=or_filters,
		fields=LIST_FIELDS,
		order_by="arrival_datetime desc, creation desc",
		start=cint(start),
		page_length=min(cint(page_length) or PAGE_LENGTH, 100),
	)
	return {"total": total, "rows": [_row(r) for r in rows]}


@frappe.whitelist()
def get_entry(name):
	doc = frappe.get_doc(ENTRY, name)
	doc.check_permission("read")
	out = _row(doc)
	# editing is whatever Role Permission Manager gives the user
	out["can_write"] = bool(doc.has_permission("write"))
	return out


# ---- writing ----------------------------------------------------------------------------------------------


def _supplier(name):
	"""The supplier typed on the form: an existing one, or a new master when this user may create one."""
	name = _clean(name)
	if not name:
		frappe.throw(_("Water Supplier Name is required"))
	found = frappe.db.sql(
		"select name, disabled from `tabWater Supplier` where lower(supplier_name) = lower(%s) limit 1", name, as_dict=True
	)
	if found:
		if cint(found[0].disabled):
			frappe.throw(_("Water Supplier {0} is disabled").format(found[0].name))
		return found[0].name
	if not frappe.has_permission(SUPPLIER, "create"):
		frappe.throw(_("{0} is not in the supplier list and you cannot add suppliers. Pick one from the list.").format(name))
	doc = frappe.get_doc({"doctype": SUPPLIER, "supplier_name": name})
	doc.insert()
	return doc.name


def _vehicle(number, supplier):
	number = normalise_vehicle_number(number)
	if not number:
		frappe.throw(_("Vehicle / Water Tanker Number is required"))
	if frappe.db.exists(VEHICLE, number):
		return number
	if not frappe.has_permission(VEHICLE, "create"):
		frappe.throw(_("{0} is not a known water tanker and you cannot add water tankers. Pick one from the list.").format(number))
	doc = frappe.get_doc({"doctype": VEHICLE, "vehicle_number": number, "water_supplier": supplier})
	doc.insert()
	return doc.name


def _photo(file_url, label, required=False):
	"""A photo the page has just uploaded by this user and nobody has attached yet."""
	file_url = _text(file_url)
	if not file_url:
		if required:
			frappe.throw(_("{0} is required").format(label))
		return None
	row = frappe.db.get_value(
		"File",
		{"file_url": file_url},
		["name", "owner", "attached_to_doctype", "attached_to_name", "is_folder"],
		as_dict=True,
	)
	if not row or row.is_folder or (row.owner != frappe.session.user and "System Manager" not in frappe.get_roles()):
		frappe.throw(_("{0} was not uploaded properly. Capture it again.").format(label))
	if row.attached_to_name:
		frappe.throw(_("{0} was already used by another entry. Capture it again.").format(label))
	return row.name


def _moment(value):
	"""An ISO time sent by the device, as a time in the site time zone; None if it cannot be read."""
	try:
		moment = datetime.fromisoformat(_text(value).replace("Z", "+00:00"))
	except ValueError:
		return None
	if moment.tzinfo:
		moment = moment.astimezone(ZoneInfo(get_system_timezone())).replace(tzinfo=None)
	return moment


def _capture_time(value, label):
	"""The moment the shutter was pressed, sent by the device as an ISO time; stored in the site time zone."""
	if not _text(value):
		frappe.throw(_("{0}: the time the photo was taken is missing. Retake the photo.").format(label))
	taken = _moment(value)
	if not taken:
		frappe.throw(_("{0}: the time the photo was taken is not valid. Retake the photo.").format(label))
	return taken


def _arrival_time(value):
	"""When the tanker arrived. The form fills in the current time and lets the user correct it; left
	empty it becomes the time of saving. It cannot be in the future or more than a week back."""
	if not _text(value):
		return None
	arrived = _moment(value)
	if not arrived:
		frappe.throw(_("Arrival Date & Time is not valid"))
	now = now_datetime()
	if arrived > now + timedelta(minutes=5):
		frappe.throw(_("Arrival Date & Time cannot be in the future"))
	if arrived < now - timedelta(days=MAX_ARRIVAL_BACKDATE_DAYS):
		frappe.throw(_("Arrival Date & Time is more than {0} days ago").format(MAX_ARRIVAL_BACKDATE_DAYS))
	return arrived


def _coordinates(data):
	try:
		lat, lng = float(data.get("latitude")), float(data.get("longitude"))
	except (TypeError, ValueError):
		frappe.throw(_("The GPS location of the water tanker photo is required. Allow location access and retake the photo."))
	if not (-90 <= lat <= 90 and -180 <= lng <= 180) or (lat == 0 and lng == 0):
		frappe.throw(_("The GPS location is not valid. Retake the photo with location switched on."))
	accuracy = data.get("gps_accuracy")
	return lat, lng, (flt(accuracy) if accuracy not in (None, "") else None)


def _attach(doc, files):
	"""Tie the uploaded files to the entry so they follow its permissions and show under Attachments."""
	for fieldname, file_name in files.items():
		if file_name:
			frappe.db.set_value(
				"File",
				file_name,
				{"attached_to_doctype": ENTRY, "attached_to_name": doc.name, "attached_to_field": fieldname},
				update_modified=False,
			)


@frappe.whitelist()
def save_entry(data):
	"""Create a tanker entry. client_ref is made once per form, so a double tap or a retry after a
	dropped connection returns the entry that already exists instead of making a second one."""
	data = _loads(data)
	frappe.has_permission(ENTRY, "create", throw=True)

	ref = _text(data.get("client_ref"))[:140]
	if ref:
		existing = frappe.db.get_value(ENTRY, {"client_ref": ref}, "name")
		if existing:
			return {**get_entry(existing), "duplicate": True}

	vehicle_number = normalise_vehicle_number(data.get("vehicle_number"))
	if not vehicle_number:
		frappe.throw(_("Vehicle / Water Tanker Number is required"))
	supplier = _supplier(data.get("water_supplier"))

	level = _text(data.get("tank_level_check")) or "Not Checked"
	if level not in LEVELS:
		frappe.throw(_("Tank Level Check must be one of: {0}").format(", ".join(LEVELS)))

	tanker_photo = _photo(data.get("tanker_photo"), _("The tanker photo"), required=True)
	tanker_stamped = _photo(data.get("tanker_photo_stamped"), _("The tanker photo with stamp"))
	level_photo = _photo(data.get("tank_level_photo"), _("The tank level photo"))
	level_stamped = _photo(data.get("tank_level_photo_stamped"), _("The tank level photo with stamp"))
	lat, lng, accuracy = _coordinates(data)

	tanker = _clean(data.get("tanker")) or None
	if tanker and tanker not in TANKERS:
		frappe.throw(_("Tanker must be one of: {0}").format(", ".join(TANKERS)))

	vehicle = _vehicle(vehicle_number, supplier)
	arrived = _arrival_time(data.get("arrival_datetime"))
	doc = frappe.get_doc(
		{
			"doctype": ENTRY,
			"vehicle_number": vehicle,
			"water_supplier": supplier,
			"arrival_datetime": arrived,
			"tanker": tanker,
			"driver_name": _clean(data.get("driver_name")) or None,
			"tanker_type": _clean(data.get("tanker_type")) or "Water Tanker",
			"expected_quantity": _number(data.get("expected_quantity"), _("Expected Quantity")),
			"tank_level_check": level,
			"checked_by": _clean(data.get("checked_by")) or None,
			"observed_quantity": _number(data.get("observed_quantity"), _("Observed Quantity")),
			"inspection_remarks": _text(data.get("inspection_remarks")) or None,
			"tanker_photo": _text(data.get("tanker_photo")),
			"tanker_photo_stamped": _text(data.get("tanker_photo_stamped")) or None,
			"photo_capture_datetime": _capture_time(data.get("photo_capture_datetime"), _("Water Tanker photo")),
			"tank_level_photo": _text(data.get("tank_level_photo")) or None,
			"tank_level_photo_stamped": _text(data.get("tank_level_photo_stamped")) or None,
			"tank_level_photo_datetime": (
				_capture_time(data.get("tank_level_photo_datetime"), _("Tank level photo")) if level_photo else None
			),
			"latitude": lat,
			"longitude": lng,
			"gps_accuracy": accuracy,
			"location_address": _text(data.get("location_address")) or None,
			"client_ref": ref or None,
		}
	)
	try:
		doc.insert()
	except frappe.UniqueValidationError:
		# the same form was submitted twice at once; the other request won
		frappe.db.rollback()
		existing = frappe.db.get_value(ENTRY, {"client_ref": ref}, "name") if ref else None
		if existing:
			return {**get_entry(existing), "duplicate": True}
		raise
	if arrived and doc.arrival_datetime != arrived:
		# the time the user entered, not the time of saving
		frappe.db.set_value(ENTRY, doc.name, "arrival_datetime", arrived, update_modified=False)
		doc.arrival_datetime = arrived
	_attach(
		doc,
		{
			"tanker_photo": tanker_photo,
			"tanker_photo_stamped": tanker_stamped,
			"tank_level_photo": level_photo,
			"tank_level_photo_stamped": level_stamped,
		},
	)
	return {**get_entry(doc.name), "duplicate": False}


def _replace_photos(doc, data):
	"""A photo taken again while editing replaces the old one, together with its capture time and, for the
	tanker photo, its GPS location. Returns the new files to attach and the urls of the old ones."""
	attach, old = {}, []
	if _text(data.get("tanker_photo")):
		photo = _photo(data.get("tanker_photo"), _("The tanker photo"), required=True)
		stamped = _photo(data.get("tanker_photo_stamped"), _("The tanker photo with stamp"))
		lat, lng, accuracy = _coordinates(data)
		taken = _capture_time(data.get("photo_capture_datetime"), _("Water Tanker photo"))
		old += [doc.tanker_photo, doc.tanker_photo_stamped]
		doc.update(
			{
				"tanker_photo": _text(data.get("tanker_photo")),
				"tanker_photo_stamped": _text(data.get("tanker_photo_stamped")) or None,
				"photo_capture_datetime": taken,
				"latitude": lat,
				"longitude": lng,
				"gps_accuracy": accuracy,
			}
		)
		attach.update({"tanker_photo": photo, "tanker_photo_stamped": stamped})
	if _text(data.get("tank_level_photo")):
		photo = _photo(data.get("tank_level_photo"), _("The tank level photo"), required=True)
		stamped = _photo(data.get("tank_level_photo_stamped"), _("The tank level photo with stamp"))
		taken = _capture_time(data.get("tank_level_photo_datetime"), _("Tank level photo"))
		old += [doc.tank_level_photo, doc.tank_level_photo_stamped]
		doc.update(
			{
				"tank_level_photo": _text(data.get("tank_level_photo")),
				"tank_level_photo_stamped": _text(data.get("tank_level_photo_stamped")) or None,
				"tank_level_photo_datetime": taken,
			}
		)
		attach.update({"tank_level_photo": photo, "tank_level_photo_stamped": stamped})
	return attach, [url for url in old if url]


def _drop_files(doc, urls):
	"""Remove the files of photos that were replaced, so only the current ones stay with the entry."""
	for url in urls:
		for name in frappe.get_all("File", filters={"file_url": url, "attached_to_doctype": ENTRY, "attached_to_name": doc.name}, pluck="name"):
			frappe.delete_doc("File", name, ignore_permissions=True)


@frappe.whitelist()
def update_entry(name, data):
	"""Change the details of an entry; a photo taken again replaces the old one with its new time and place."""
	data = _loads(data)
	doc = frappe.get_doc(ENTRY, name)
	doc.check_permission("write")
	attach, replaced = _replace_photos(doc, data)

	for key in EDITABLE:
		if key not in data:
			continue
		value = data[key]
		if key in ("expected_quantity", "observed_quantity"):
			value = _number(value, doc.meta.get_label(key))
		elif key == "tank_level_check":
			value = _text(value) or "Not Checked"
			if value not in LEVELS:
				frappe.throw(_("Tank Level Check must be one of: {0}").format(", ".join(LEVELS)))
		elif key == "status":
			value = _text(value)
			if value not in STATUSES:
				frappe.throw(_("Status must be one of: {0}").format(", ".join(STATUSES)))
		elif key in ("inspection_remarks", "location_address"):
			value = _text(value) or None
		else:
			value = _clean(value) or None
		doc.set(key, value)

	# checking the tank moves a Draft on to Inspected, unless the user chose a status themselves
	if "status" not in data and doc.status == "Draft" and doc.tank_level_check != "Not Checked":
		doc.status = "Inspected"
	doc.save()
	_attach(doc, attach)
	_drop_files(doc, replaced)
	return get_entry(doc.name)


# ---- report: on screen, Excel, PDF and print ---------------------------------------------------------------

REPORT_LIMIT = 5000
REPORT_FIELDS = [
	"name",
	"arrival_datetime",
	"vehicle_number",
	"water_supplier",
	"driver_name",
	"tanker",
	"tanker_type",
	"tank_level_check",
	"expected_quantity",
	"observed_quantity",
	"checked_by",
	"inspection_remarks",
	"status",
	"photo_capture_datetime",
	"latitude",
	"longitude",
	"location_address",
	"tanker_photo",
	"tanker_photo_stamped",
	"tank_level_photo",
	"tank_level_photo_stamped",
]
# photos are embedded (as small copies) for this many report rows at most, so a long print or PDF stays light
PHOTO_ROWS_MAX = 200


def _report_rows(search, level, supplier, from_date, to_date):
	"""Entries for the report, oldest first, limited by the same permissions as the register."""
	frappe.has_permission(ENTRY, "read", throw=True)
	filters, or_filters = _entry_query(search, level, supplier, from_date, to_date)
	return frappe.get_list(
		ENTRY,
		filters=filters,
		or_filters=or_filters,
		fields=REPORT_FIELDS,
		order_by="arrival_datetime asc, creation asc",
		limit_page_length=REPORT_LIMIT,
	)


def _summary(rows):
	levels = {level: 0 for level in LEVELS}
	for r in rows:
		levels[r.tank_level_check if r.tank_level_check in levels else "Not Checked"] += 1
	return {
		"total": len(rows),
		"levels": levels,
		"expected": sum(flt(r.expected_quantity) for r in rows),
		"observed": sum(flt(r.observed_quantity) for r in rows),
	}


def _when(value, seconds=False):
	"""09/10/2026 10:45 AM, the way the page shows it."""
	if not value:
		return ""
	return frappe.utils.get_datetime(value).strftime("%d/%m/%Y %I:%M:%S %p" if seconds else "%d/%m/%Y %I:%M %p")


def _day_text(value):
	return frappe.utils.getdate(value).strftime("%d/%m/%Y") if value else ""


def _qty(value):
	return "" if value is None else (int(value) if float(value).is_integer() else round(float(value), 2))


def _map_link(r):
	if r.latitude is None or r.longitude is None or (not flt(r.latitude) and not flt(r.longitude)):
		return ""
	return f"https://www.google.com/maps?q={flt(r.latitude):.6f},{flt(r.longitude):.6f}"


@frappe.whitelist()
def report(search=None, level=None, supplier=None, from_date=None, to_date=None):
	rows = _report_rows(search, level, supplier, from_date, to_date)
	return {
		"rows": [{k: (str(v) if hasattr(v, "isoformat") else v) for k, v in r.items()} for r in rows],
		"summary": _summary(rows),
		"truncated": len(rows) >= REPORT_LIMIT,
	}


def _filter_text(search, level, supplier, from_date, to_date):
	parts = []
	if _text(from_date) or _text(to_date):
		parts.append(
			_("Dates: {0} to {1}").format(_day_text(from_date) or "…", _day_text(to_date) or "…")
		)
	if _clean(supplier):
		parts.append(_("Water Supplier: {0}").format(_clean(supplier)))
	if _text(level):
		parts.append(_("Tank Level: {0}").format(_text(level)))
	if _clean(search):
		parts.append(_("Search: {0}").format(_clean(search)))
	return " · ".join(parts) or _("All entries")


def _report_html(rows, summary, filter_text):
	"""The report as one printable page (A4 landscape); used for Print and for the PDF."""
	e = frappe.utils.escape_html
	head = [
		_("Date & Time"), _("Vehicle"), _("Water Supplier"), _("Driver"), _("Tank Level"),
		_("Expected"), _("Observed"), _("Checked By"), _("Remarks"), _("GPS Location"), _("Photos"),
	]
	body = []
	for n, r in enumerate(rows):
		where = f"{flt(r.latitude):.5f}, {flt(r.longitude):.5f}" if _map_link(r) else ""
		body.append(
			"<tr>"
			f"<td>{e(_when(r.arrival_datetime))}</td><td><b>{e(r.vehicle_number)}</b></td><td>{e(r.water_supplier)}</td>"
			f"<td>{e(r.driver_name or '')}</td><td>{e(r.tank_level_check or '')}</td>"
			f"<td class='n'>{e(_qty(r.expected_quantity))}</td><td class='n'>{e(_qty(r.observed_quantity))}</td>"
			f"<td>{e(r.checked_by or '')}</td><td>{e((r.inspection_remarks or '').replace(chr(10), ' '))}</td><td>{e(where)}</td>"
			f"<td class='ph'>{_photo_cell(r) if n < PHOTO_ROWS_MAX else ''}</td>"
			"</tr>"
		)
	if not body:
		body.append(f"<tr><td colspan='{len(head)}' class='c'>{e(_('No water tanker entries in this selection'))}</td></tr>")
	levels = summary["levels"]
	# Partial Level covers Partial and Low
	counts = " · ".join(
		[
			f"{e(_('Full'))}: {levels['Full']}",
			f"{e(_('Partial'))}: {levels['Partial'] + levels['Low']}",
			f"{e(_('Not Checked'))}: {levels['Not Checked']}",
		]
	)
	by = frappe.utils.get_fullname(frappe.session.user)
	return f"""<!doctype html><html><head><meta charset="utf-8"><title>{e(_("Water Tanker Report"))}</title>
<style>
@page {{ size: A4 landscape; margin: 10mm; }}
body {{ font-family: Arial, Helvetica, sans-serif; color: #202638; font-size: 10px; margin: 0; }}
h1 {{ font-size: 18px; margin: 0 0 3px; color: #5b45e8; }}
.sub {{ color: #5d667b; margin: 0 0 3px; font-size: 11px; }}
.meta {{ color: #7d879c; margin: 0 0 10px; font-size: 9px; }}
table {{ width: 100%; border-collapse: collapse; }}
th {{ background: #eeebff; color: #3b2fb0; text-align: left; font-size: 9px; text-transform: uppercase; padding: 5px 6px; border: 1px solid #d7d2f5; }}
td {{ padding: 4px 6px; border: 1px solid #dfe3eb; vertical-align: top; }}
tr {{ page-break-inside: avoid; }}
tfoot td {{ background: #f3f4f7; font-weight: bold; }}
.n {{ text-align: right; white-space: nowrap; }}
.c {{ text-align: center; color: #7d879c; padding: 14px; }}
.ph {{ white-space: nowrap; }}
img.p {{ height: 46px; width: auto; border: 1px solid #dfe3eb; border-radius: 3px; margin-right: 4px; vertical-align: middle; }}
</style></head><body>
<h1>{e(_("Water Tanker Report"))}</h1>
<p class="sub">{e(filter_text)}</p>
<p class="meta">{e(_("Generated by {0} on {1}").format(by, _when(now_datetime())))}{e(" · " + _("Photos are shown for the first {0} entries.").format(PHOTO_ROWS_MAX) if len(rows) > PHOTO_ROWS_MAX else "")}</p>
<table><thead><tr>{"".join(f"<th>{e(h)}</th>" for h in head)}</tr></thead>
<tbody>{"".join(body)}</tbody>
<tfoot><tr><td colspan="5">{e(_("Total entries"))}: {summary["total"]} &nbsp;({counts})</td>
<td class="n">{e(_qty(summary["expected"]))}</td><td class="n">{e(_qty(summary["observed"]))}</td><td colspan="4"></td></tr></tfoot>
</table></body></html>"""


@frappe.whitelist()
def print_report(search=None, level=None, supplier=None, from_date=None, to_date=None):
	"""The printable page; the browser's own print dialog turns it into paper or a PDF."""
	rows = _report_rows(search, level, supplier, from_date, to_date)
	return {"html": _report_html(rows, _summary(rows), _filter_text(search, level, supplier, from_date, to_date))}


def _thumb(file_url):
	"""A small copy of a photo as a data URI, so a printed report or a PDF needs no login and no links."""
	if not file_url:
		return ""
	try:
		from PIL import Image

		name = frappe.db.get_value("File", {"file_url": file_url}, "name")
		path = frappe.get_doc("File", name).get_full_path()
		with Image.open(path) as image:
			image = image.convert("RGB")
			image.thumbnail((320, 240))
			out = io.BytesIO()
			image.save(out, "JPEG", quality=70)
		return "data:image/jpeg;base64," + base64.b64encode(out.getvalue()).decode()
	except Exception:
		return ""


def _photo_cell(r):
	"""The tanker photo and, when there is one, the tank level photo, side by side."""
	tags = []
	for url, label in (
		(r.tanker_photo_stamped or r.tanker_photo, _("Water Tanker photo")),
		(r.tank_level_photo_stamped or r.tank_level_photo, _("Tank level photo")),
	):
		data = _thumb(url)
		if data:
			tags.append(f"<img src='{data}' alt='{frappe.utils.escape_html(label)}' class='p'>")
	return "".join(tags)


def _file_stem(from_date, to_date):
	return "water-tanker-report-" + "-".join(x for x in (_text(from_date), _text(to_date)) if x) if (from_date or to_date) else "water-tanker-report"


@frappe.whitelist()
def export_pdf(search=None, level=None, supplier=None, from_date=None, to_date=None):
	from frappe.utils.pdf import get_pdf

	rows = _report_rows(search, level, supplier, from_date, to_date)
	html = _report_html(rows, _summary(rows), _filter_text(search, level, supplier, from_date, to_date))
	frappe.response["filename"] = _file_stem(from_date, to_date) + ".pdf"
	frappe.response["filecontent"] = get_pdf(html, {"orientation": "Landscape", "page-size": "A4"})
	frappe.response["type"] = "pdf"


@frappe.whitelist()
def export_excel(search=None, level=None, supplier=None, from_date=None, to_date=None):
	from frappe.utils.xlsxutils import make_xlsx

	rows = _report_rows(search, level, supplier, from_date, to_date)
	summary = _summary(rows)
	head = [
		_("Date & Time"), _("Vehicle"), _("Water Supplier"), _("Driver"), _("Tank Level"),
		_("Expected Quantity"), _("Observed Quantity"), _("Checked By"), _("Inspection Remarks"), _("Tanker"),
		_("Photo Captured"), _("Latitude"), _("Longitude"), _("Google Maps"), _("Location Address"),
		_("Water Tanker Photo"), _("Tank Level Photo"),
	]
	data = [head]
	for r in rows:
		data.append(
			[
				_when(r.arrival_datetime), r.vehicle_number, r.water_supplier, r.driver_name or "",
				r.tank_level_check or "", flt(r.expected_quantity) if r.expected_quantity is not None else "",
				flt(r.observed_quantity) if r.observed_quantity is not None else "", r.checked_by or "",
				r.inspection_remarks or "", r.tanker or "", _when(r.photo_capture_datetime, True),
				flt(r.latitude) if r.latitude is not None else "", flt(r.longitude) if r.longitude is not None else "",
				_map_link(r), r.location_address or "",
				frappe.utils.get_url(r.tanker_photo_stamped or r.tanker_photo) if (r.tanker_photo_stamped or r.tanker_photo) else "",
				frappe.utils.get_url(r.tank_level_photo_stamped or r.tank_level_photo) if (r.tank_level_photo_stamped or r.tank_level_photo) else "",
			]
		)
	data.append(
		[_("Total ({0})").format(summary["total"]), "", "", "", "", summary["expected"], summary["observed"]]
		+ [""] * 10
	)
	widths = [20, 16, 24, 18, 13, 14, 14, 18, 34, 12, 22, 12, 12, 40, 40, 48, 48]
	frappe.response["filename"] = _file_stem(from_date, to_date) + ".xlsx"
	frappe.response["filecontent"] = make_xlsx(data, "Water Tanker Report", column_widths=widths).getvalue()
	frappe.response["type"] = "binary"


# ---- masters: water suppliers and tankers --------------------------------------------------------------------


def _in_use_message(doctype, name, can_disable=False):
	text = _("{0} {1} is used in water tanker entries, so it cannot be deleted.").format(doctype, name)
	return text + " " + _("Mark it Disabled instead.") if can_disable else text


@frappe.whitelist()
def list_suppliers():
	frappe.has_permission(SUPPLIER, "read", throw=True)
	return frappe.get_list(
		SUPPLIER,
		fields=["name", "supplier_name", "contact_number", "address", "disabled"],
		order_by="supplier_name asc",
		limit_page_length=0,
	)


@frappe.whitelist()
def save_supplier(data):
	data = _loads(data)
	name = _text(data.get("name"))
	if name:
		doc = frappe.get_doc(SUPPLIER, name)
		doc.check_permission("write")
	else:
		frappe.has_permission(SUPPLIER, "create", throw=True)
		supplier_name = _clean(data.get("supplier_name"))
		if not supplier_name:
			frappe.throw(_("Water Supplier Name is required"))
		if frappe.db.sql("select name from `tabWater Supplier` where lower(supplier_name) = lower(%s)", supplier_name):
			frappe.throw(_("Water Supplier {0} already exists").format(supplier_name))
		doc = frappe.get_doc({"doctype": SUPPLIER, "supplier_name": supplier_name})
	doc.contact_number = _clean(data.get("contact_number")) or None
	doc.address = _text(data.get("address")) or None
	doc.disabled = cint(data.get("disabled"))
	doc.save() if name else doc.insert()
	return {"name": doc.name}


@frappe.whitelist()
def delete_supplier(name):
	try:
		frappe.delete_doc(SUPPLIER, name)
	except frappe.LinkExistsError:
		frappe.throw(_in_use_message(_("Water Supplier"), name, can_disable=True))


@frappe.whitelist()
def list_vehicles():
	frappe.has_permission(VEHICLE, "read", throw=True)
	return frappe.get_list(
		VEHICLE,
		fields=["name", "vehicle_number", "water_supplier", "tanker_capacity", "capacity_uom"],
		order_by="vehicle_number asc",
		limit_page_length=0,
	)


@frappe.whitelist()
def list_uoms():
	"""Units to pick for a tanker's capacity."""
	frappe.has_permission(VEHICLE, "read", throw=True)
	return frappe.get_all("UOM", filters={"enabled": 1}, pluck="name", order_by="name asc", limit_page_length=0)


@frappe.whitelist()
def save_vehicle(data):
	data = _loads(data)
	name = _text(data.get("name"))
	supplier = _clean(data.get("water_supplier"))
	if supplier and not frappe.db.exists(SUPPLIER, supplier):
		frappe.throw(_("Water Supplier {0} does not exist. Add it under Water Suppliers first.").format(supplier))
	uom = _clean(data.get("capacity_uom"))
	if uom and not frappe.db.exists("UOM", uom):
		frappe.throw(_("Capacity UOM {0} does not exist").format(uom))
	if name:
		doc = frappe.get_doc(VEHICLE, name)
		doc.check_permission("write")
	else:
		frappe.has_permission(VEHICLE, "create", throw=True)
		number = normalise_vehicle_number(data.get("vehicle_number"))
		if not number:
			frappe.throw(_("Vehicle Number is required"))
		if frappe.db.exists(VEHICLE, number):
			frappe.throw(_("Water Tanker {0} already exists").format(number))
		doc = frappe.get_doc({"doctype": VEHICLE, "vehicle_number": number})
	doc.water_supplier = supplier or None
	doc.tanker_capacity = _number(data.get("tanker_capacity"), _("Water Tanker Capacity"))
	doc.capacity_uom = uom or None
	doc.save() if name else doc.insert()
	return {"name": doc.name}


@frappe.whitelist()
def delete_vehicle(name):
	try:
		frappe.delete_doc(VEHICLE, name)
	except frappe.LinkExistsError:
		frappe.throw(_in_use_message(_("Water Tanker"), name))
