"""Roles and the approval step for Water Tanker Entry.

WT Guard     fills the form and saves a Draft (sees and changes only their own entries)
WT Observer  can only look: entries, report, print/export
WT Man       full access: approves (Submit), cancels, deletes, keeps the masters

Only these roles' rows on this app's three doctypes are written; other roles and other apps are not touched.
Everything stays adjustable afterwards in Role Permission Manager (nothing is hard-coded in the page).
Runs once from patches.txt on `bench migrate` (so it reaches an existing site, e.g. on Frappe Cloud) and from
after_install on a new one. Works on Frappe 15 and 16.
"""

import frappe

ENTRY = "Water Tanker Entry"
SUPPLIER = "Water Supplier"
VEHICLE = "Water Tanker Vehicle"
ROLES = ("WT Guard", "WT Observer", "WT Man")
PAGE = "water_tanker_tracker"
PAGE_ROLES = ("WT Guard", "WT Observer", "WT Man", "Water Tanker Manager")  # who may open the page

_FULL = {"read": 1, "write": 1, "create": 1, "delete": 1, "report": 1, "export": 1, "print": 1, "email": 1, "share": 1}
# doctype -> [(role, only_own_documents, permissions)]
PERMISSIONS = {
	ENTRY: [
		("WT Guard", 1, {"read": 1, "write": 1, "create": 1}),
		("WT Observer", 0, {"read": 1, "report": 1, "print": 1, "export": 1}),
		("WT Man", 0, {**_FULL, "submit": 1, "cancel": 1, "amend": 1}),
		("Water Tanker Manager", 0, {"submit": 1, "cancel": 1, "amend": 1}),  # the older manager role can approve too
	],
	SUPPLIER: [
		("WT Guard", 0, {"read": 1, "create": 1}),
		("WT Observer", 0, {"read": 1}),
		("WT Man", 0, _FULL),
	],
	VEHICLE: [
		("WT Guard", 0, {"read": 1, "create": 1}),
		("WT Observer", 0, {"read": 1}),
		("WT Man", 0, _FULL),
	],
}


def ensure_roles():
	for role in ROLES:
		if not frappe.db.exists("Role", role):
			frappe.get_doc({"doctype": "Role", "role_name": role, "desk_access": 1}).insert(ignore_permissions=True)


def grant(doctype, role, only_own, permissions):
	"""One Custom DocPerm row for this role on this doctype (created, or topped up if it is already there)."""
	if not frappe.db.exists("Role", role):
		return
	try:
		from frappe.permissions import setup_custom_perms

		setup_custom_perms(doctype)  # a doctype without Custom DocPerm rows first gets its standard ones copied over
	except Exception:
		pass
	name = frappe.db.get_value("Custom DocPerm", {"parent": doctype, "role": role, "permlevel": 0, "if_owner": 1 if only_own else 0})
	if name:
		doc = frappe.get_doc("Custom DocPerm", name)
	else:
		doc = frappe.new_doc("Custom DocPerm")
		doc.update({"parent": doctype, "parenttype": "DocType", "parentfield": "permissions", "role": role, "permlevel": 0, "if_owner": 1 if only_own else 0})
	for right, value in permissions.items():
		doc.set(right, value)
	doc.flags.ignore_permissions = True
	doc.save() if name else doc.insert(ignore_permissions=True)


def ensure_page_roles():
	"""Who may open the page. A site that already has the Page keeps its own role list on a normal sync, so the
	new roles are added here (rows are only added, never removed)."""
	if not frappe.db.exists("Page", PAGE):
		return
	have = set(frappe.get_all("Has Role", filters={"parent": PAGE, "parenttype": "Page"}, pluck="role"))
	for role in PAGE_ROLES:
		if role not in have and frappe.db.exists("Role", role):
			frappe.get_doc(
				{"doctype": "Has Role", "parent": PAGE, "parenttype": "Page", "parentfield": "roles", "role": role}
			).insert(ignore_permissions=True)
	frappe.clear_cache()


def setup():
	ensure_roles()
	ensure_page_roles()
	for doctype, rows in PERMISSIONS.items():
		for role, only_own, permissions in rows:
			grant(doctype, role, only_own, permissions)
		frappe.clear_cache(doctype=doctype)


def execute():
	"""The patch: roles and permissions, and the entries that already exist count as approved (they were accepted
	before there was an approval step), so only entries made from now on start as Drafts."""
	setup()
	frappe.db.sql("update `tabWater Tanker Entry` set docstatus = 1 where docstatus = 0")
