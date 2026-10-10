from datetime import timedelta

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import flt, get_datetime, now_datetime

# A photo is evidence of right now; one taken days ago is not.
MAX_PHOTO_AGE = timedelta(hours=24)
CLOCK_SLACK = timedelta(minutes=5)


class WaterTankerEntry(Document):
	def validate(self):
		self.set_arrival()
		self.require_evidence()
		self.check_quantities()
		self.set_status()
		self.guard_closed()

	def set_arrival(self):
		if self.is_new():
			# the form lets the user correct the arrival time; without one it is the time of saving
			self.arrival_datetime = self.arrival_datetime or now_datetime()
			if get_datetime(self.arrival_datetime) > now_datetime() + CLOCK_SLACK:
				frappe.throw(_("Arrival Date & Time cannot be in the future"))
			self.created_by = frappe.session.user
			self.checked_by = (self.checked_by or "").strip() or frappe.utils.get_fullname(frappe.session.user)

	def require_evidence(self):
		"""The photo, when it was taken and where: the three things this record exists to prove."""
		if not self.tanker_photo:
			frappe.throw(_("The water tanker photo is required"))
		if not self.photo_capture_datetime:
			frappe.throw(_("The time the water tanker photo was taken is missing. Retake the photo."))
		self.check_capture_time(self.photo_capture_datetime, _("Water Tanker photo"))
		if self.tank_level_photo:
			if not self.tank_level_photo_datetime:
				frappe.throw(_("The time the tank level photo was taken is missing. Retake the photo."))
			self.check_capture_time(self.tank_level_photo_datetime, _("Tank level photo"))

		if self.latitude is None or self.longitude is None:
			frappe.throw(_("The GPS location of the water tanker photo is required"))
		lat, lng = flt(self.latitude), flt(self.longitude)
		if not (-90 <= lat <= 90 and -180 <= lng <= 180) or (lat == 0 and lng == 0):
			frappe.throw(_("The GPS location is not valid. Retake the photo with location switched on."))
		if self.gps_accuracy is not None and flt(self.gps_accuracy) < 0:
			frappe.throw(_("The GPS accuracy is not valid"))

	def check_capture_time(self, value, label):
		taken = get_datetime(value)
		now = now_datetime()
		if taken > now + CLOCK_SLACK:
			frappe.throw(_("{0}: the capture time is in the future. Check the phone's date and time.").format(label))
		if self.is_new() and taken < now - MAX_PHOTO_AGE:
			frappe.throw(_("{0}: the photo is more than 24 hours old. Retake it.").format(label))

	def check_quantities(self):
		for fieldname, label in (("expected_quantity", _("Expected Quantity")), ("observed_quantity", _("Observed Quantity"))):
			if self.get(fieldname) is not None and flt(self.get(fieldname)) < 0:
				frappe.throw(_("{0} cannot be negative").format(label))

	def set_status(self):
		"""A new entry is Inspected as soon as the tank level has been checked; closing is done by hand."""
		if self.is_new() and (self.status or "Draft") == "Draft" and self.tank_level_check != "Not Checked":
			self.status = "Inspected"

	def guard_closed(self):
		before = self.get_doc_before_save()
		if before and before.status == "Closed":
			frappe.throw(_("A closed entry cannot be changed"))
