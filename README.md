### Water Tanker Tracker

Field staff record every water tanker that arrives: vehicle, supplier, tank level check, and a photo
taken with the device camera that carries the real capture time and GPS position.

One custom page, `/app/water_tanker_tracker` (Dashboard, Tanker Register, New Tanker Entry).

DocTypes: Water Supplier, Water Tanker Vehicle, Water Tanker Entry. Role: Water Tanker User.

### Installation

```
bench get-app <repo>
bench --site <site> install-app water_tanker_tracker
```

The camera and GPS need a secure (https) page.
