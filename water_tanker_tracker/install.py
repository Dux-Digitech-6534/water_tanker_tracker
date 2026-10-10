import frappe


def after_install():
	ensure_role()


def ensure_role():
	"""The field staff who record tanker arrivals."""
	if not frappe.db.exists("Role", "Water Tanker User"):
		frappe.get_doc({"doctype": "Role", "role_name": "Water Tanker User", "desk_access": 1}).insert(
			ignore_permissions=True
		)
