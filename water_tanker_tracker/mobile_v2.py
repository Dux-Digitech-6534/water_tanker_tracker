"""Support for the Water Tanker Tracker mobile app (/water-tanker/m), version 2.

A NEW module (mobile_api.py is already loaded by the running web workers, and an imported module cannot be
edited in place without a restart). It follows the page's own rules: the API is water_tanker_tracker.service,
and Settings (the masters) belong to System Managers and Water Tanker Managers, exactly like the desk page.
Everything else the app does goes through service.* with the same permission checks.
"""

import frappe
from frappe.utils import get_fullname, nowdate

from water_tanker_tracker import service

ACTIONS = ("read", "create", "write", "delete")
ADMIN_ROLES = ("System Manager", "Water Tanker Manager")  # same as `this.admin` in the desk page


def _perms(doctype):
	return {action: bool(frappe.has_permission(doctype, action)) for action in ACTIONS}


@frappe.whitelist()
def boot():
	"""Who is signed in, what they may do, and the lists the entry form suggests from."""
	roles = frappe.get_roles()
	entry = _perms(service.ENTRY)
	label = next((r for r in ("System Manager", "Water Tanker Manager", "Water Tanker User") if r in roles), "")
	out = {
		"user": frappe.session.user,
		"full_name": get_fullname(frappe.session.user),
		"today": nowdate(),
		"is_admin": any(r in roles for r in ADMIN_ROLES),
		"role_label": label,
		"tankers": list(service.TANKERS),
		"entry": entry,
		"masters": {"suppliers": _perms(service.SUPPLIER), "vehicles": _perms(service.VEHICLE)},
		"suppliers": [],
		"vehicles": [],
	}
	if entry["read"]:
		lists = service.bootstrap()
		out["suppliers"] = lists.get("suppliers") or []
		out["vehicles"] = lists.get("vehicles") or []
	return out
