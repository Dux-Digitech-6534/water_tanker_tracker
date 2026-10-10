import frappe
from frappe import _
from frappe.model.document import Document


class WaterSupplier(Document):
	def validate(self):
		self.supplier_name = " ".join((self.supplier_name or "").split())
		if not self.supplier_name:
			frappe.throw(_("Water Supplier Name is required"))
