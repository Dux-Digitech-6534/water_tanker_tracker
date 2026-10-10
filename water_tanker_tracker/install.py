import frappe


def after_install():
	ensure_role()
	ensure_manager_role()


def ensure_role():
	"""The field staff who record tanker arrivals."""
	if not frappe.db.exists("Role", "Water Tanker User"):
		frappe.get_doc({"doctype": "Role", "role_name": "Water Tanker User", "desk_access": 1}).insert(
			ignore_permissions=True
		)


def ensure_manager_role():
	"""The people who keep the masters (Settings: suppliers and vehicles)."""
	if not frappe.db.exists("Role", "Water Tanker Manager"):
		frappe.get_doc({"doctype": "Role", "role_name": "Water Tanker Manager", "desk_access": 1}).insert(
			ignore_permissions=True
		)
