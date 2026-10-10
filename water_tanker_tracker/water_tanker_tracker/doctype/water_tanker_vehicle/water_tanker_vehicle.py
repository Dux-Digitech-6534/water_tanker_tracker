import re

import frappe
from frappe import _
from frappe.model.document import Document


def normalise_vehicle_number(value):
	"""MH 49 AB 1234, mh-49-ab-1234 and MH49AB1234 are the same tanker, so they get one record."""
	return re.sub(r"[\s\-]+", "", (value or "").upper())


class WaterTankerVehicle(Document):
	def autoname(self):
		self.vehicle_number = normalise_vehicle_number(self.vehicle_number)
		self.name = self.vehicle_number

	def validate(self):
		self.vehicle_number = normalise_vehicle_number(self.vehicle_number)
		if not self.vehicle_number:
			frappe.throw(_("Vehicle Number is required"))
		if self.tanker_capacity is not None and self.tanker_capacity < 0:
			frappe.throw(_("Water Tanker Capacity cannot be negative"))
