"""Support for the Water Tanker Tracker mobile app (/water-tanker/m).

A NEW module on purpose: the app's existing API (tanker_api.py) and the desk page are not touched and
no restart is needed. Everything the mobile app does (entries, photos, report, masters) goes through
tanker_api.*, so the same permission checks apply; this module only tells the app who is signed in and
what that person may do.
"""

import frappe
from frappe.utils import get_fullname, nowdate

from water_tanker_tracker import tanker_api

ACTIONS = ("read", "create", "write", "delete")


def _perms(doctype):
	return {action: bool(frappe.has_permission(doctype, action)) for action in ACTIONS}


@frappe.whitelist()
def boot():
	"""Who is signed in, what they may do, and the lists the entry form suggests from."""
	roles = frappe.get_roles()
	entry = _perms(tanker_api.ENTRY)
	out = {
		"user": frappe.session.user,
		"full_name": get_fullname(frappe.session.user),
		"today": nowdate(),
		# the desk page shows Settings (the masters) to System Managers only; the app follows the same rule
		"is_admin": "System Manager" in roles,
		"role_label": "System Manager" if "System Manager" in roles else ("Water Tanker User" if "Water Tanker User" in roles else ""),
		"entry": entry,
		"masters": {"suppliers": _perms(tanker_api.SUPPLIER), "vehicles": _perms(tanker_api.VEHICLE)},
		"suppliers": [],
		"vehicles": [],
	}
	if entry["read"]:
		lists = tanker_api.bootstrap()
		out["suppliers"] = lists.get("suppliers") or []
		out["vehicles"] = lists.get("vehicles") or []
	return out
