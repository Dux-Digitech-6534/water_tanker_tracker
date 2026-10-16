// Everything for this screen - markup, styles, camera, GPS - lives in this file and is scoped to
// .wt-app, so nothing here can reach the login page or any other app's pages. The look is the Face
// Attendance theme (same colours, type, sidebar, top bar, cards, tables and buttons).

(function () {
const API = "water_tanker_tracker.service.";
// DUX Digitech logo, embedded so the page needs no separate asset file (black on transparent; inverted in dark mode)
const WT_LOGO = "data:image/png;base64,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";
const TITLES = { dashboard: "Dashboard", register: "Water Tanker Register", entry: "New Water Tanker Entry", report: "Water Tanker Report", suppliers: "Water Suppliers", vehicles: "Water Tanker Vehicles" };
const LEVELS = ["Full", "Partial", "Low", "Not Checked"];
const LEVEL_TONE = { Full: "teal", Partial: "amber", Low: "red", "Not Checked": "" };
// WhatsApp sharing is switched off for now (no API, so it is a manual step). Set to true to bring the buttons back.
const SHOW_WHATSAPP = false;
const GPS_FRESH_MS = 30000; // a position older than this, at the moment of the shutter, is not used

const esc = (v) => frappe.utils.escape_html(v == null ? "" : String(v));
const pad = (n) => String(n).padStart(2, "0");
const hour12 = (h) => ({ h: pad(h % 12 || 12), ap: h >= 12 ? "PM" : "AM" });
// "2026-10-09 10:45:12.123" -> "09/10/2026 10:45 AM"
const fmtDT = (value, seconds) => {
	const m = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):?(\d{2})?/);
	if (!m) return value ? String(value) : "—";
	const t = hour12(Number(m[4]));
	return `${m[3]}/${m[2]}/${m[1]} ${t.h}:${m[5]}${seconds && m[6] ? ":" + m[6] : ""} ${t.ap}`;
};
// the stamp written on a photo, from the device clock at the moment of capture
const fmtStamp = (d) => {
	const t = hour12(d.getHours());
	return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${t.h}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${t.ap}`;
};
const fmtDay = (iso) => String(iso || "").split("-").reverse().join("/");
// the value a datetime-local box wants: the device's own date and time, to the minute
const localDateTime = () => {
	const d = new Date();
	return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const hasPoint = (e) => e && e.latitude != null && e.longitude != null && !(Number(e.latitude) === 0 && Number(e.longitude) === 0);
const mapUrl = (lat, lng) => `https://www.google.com/maps?q=${Number(lat).toFixed(6)},${Number(lng).toFixed(6)}`;
const coordText = (lat, lng) => (lat == null || lng == null ? "—" : `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`);
const normVehicle = (v) => String(v || "").toUpperCase().replace(/[\s-]+/g, "");
const uuid = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID() : `wt-${Date.now()}-${Math.random().toString(16).slice(2)}`);
const pill = (text, tone) => `<span class="wt-pill ${tone || ""}">${esc(text)}</span>`;
const levelPill = (level) => pill(level || "Not Checked", LEVEL_TONE[level || "Not Checked"]);

const svg = (paths) =>
	`<svg class="wt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
const ICONS = {
	moon: svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
	sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>'),
	dashboard: svg('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),
	register: svg('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
	truck: svg('<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),
	drop: svg('<path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>'),
	alert: svg('<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>'),
	calendar: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
	camera: svg('<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>'),
	pin: svg('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>'),
	chat: svg('<path d="M21 11.5a8.4 8.4 0 01-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1121 11.5z"/>'),
	plus: svg('<path d="M12 5v14M5 12h14"/>'),
	refresh: svg('<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>'),
	flip: svg('<path d="M3 7h14l-3-3M21 17H7l3 3"/>'),
	report: svg('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'),
	settings: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>'),
	chev: svg('<path d="M6 9l6 6 6-6"/>'),
	printer: svg('<path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'),
	file: svg('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>'),
	edit: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/>'),
	trash: svg('<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6"/>'),
	download: svg('<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>'),
};

const WT_CSS = `
/* Hides Frappe's own chrome - but only while body.wt-active is set (this page is open) AND this
   page's markup exists, so it can never reach the login page or any other app's pages. */
body.wt-active:has(.wt-app) .navbar,
body.wt-active:has(.wt-app) .page-head,
body.wt-active:has(.wt-app) .layout-side-section,
body.wt-active:has(.wt-app) .body-sidebar-container{display:none!important}
body.wt-active:has(.wt-app) .page-container,
body.wt-active:has(.wt-app) .layout-main-section-wrapper,
body.wt-active:has(.wt-app) .layout-main-section,
body.wt-active:has(.wt-app) .page-body,
body.wt-active:has(.wt-app) .page-wrapper,
body.wt-active:has(.wt-app) .layout-main,
body.wt-active:has(.wt-app) .page-content{margin:0!important;padding:0!important;max-width:none!important;width:100%!important}
body.wt-active:has(.wt-app) .wt-app{border-radius:0;min-height:100vh}
.wt-app{--wt-bg:#f3f4f7;--wt-panel:#fff;--wt-border:#dfe3eb;--wt-text:#202638;--wt-muted:#7d879c;
--wt-primary:#5b45e8;--wt-primary-soft:#eeebff;--wt-teal:#0c9d87;--wt-teal-soft:#e4f5f1;
--wt-amber:#b77b13;--wt-amber-soft:#fff3d9;--wt-red:#c94459;--wt-red-soft:#ffedf0;
--wt-shadow:0 12px 28px rgba(32,38,56,.055);
font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--wt-text);
background:var(--wt-bg);border-radius:0;padding:0}
[data-theme=dark] .wt-app{--wt-bg:#171c29;--wt-panel:#202637;--wt-border:#343d52;--wt-text:#edf1fb;--wt-muted:#a6aec0;
--wt-primary-soft:rgba(91,69,232,.22);--wt-teal-soft:rgba(12,157,135,.18);--wt-amber-soft:rgba(183,123,19,.2);--wt-red-soft:rgba(201,68,89,.2)}
.wt-app *{box-sizing:border-box}
.wt-app [hidden]{display:none!important}
.wt-shell{display:grid;grid-template-columns:232px minmax(0,1fr);gap:0;align-items:start}
.wt-nav-side{background:var(--wt-panel);border:0;border-right:1px solid var(--wt-border);border-radius:0;padding:12px;display:flex;flex-direction:column;gap:3px;position:sticky;top:0;height:100vh;overflow:auto}
.wt-logo{display:block;width:100%;max-width:168px;height:auto;margin:6px 10px 10px}
[data-theme=dark] .wt-logo{filter:invert(1)}
.wt-brand{font-size:13px;font-weight:700;padding:10px 10px 12px;color:var(--wt-primary);border-top:1px solid var(--wt-border);margin-bottom:4px}
.wt-side-title{font-size:18px;font-weight:800;line-height:1.25;letter-spacing:-.01em;color:var(--wt-text);padding:10px 10px 16px;margin:0 0 8px;border-bottom:1px solid var(--wt-border)}
.wt-nav{display:flex;align-items:center;justify-content:space-between;min-height:40px;padding:0 12px;border:0;border-radius:10px;background:transparent;color:var(--wt-text);font-size:13px;font-weight:600;text-align:left;cursor:pointer;width:100%}
.wt-nav:hover{background:var(--wt-primary-soft)}
.wt-nav.active{background:var(--wt-primary-soft);color:var(--wt-primary)}
.wt-nav-l{display:flex;align-items:center;gap:10px}
.wt-chev{transition:transform .15s}
.wt-group.open .wt-chev{transform:rotate(180deg)}
.wt-subnav{display:none;flex-direction:column;gap:2px;padding-left:12px}
.wt-subnav.open{display:flex}
.wt-subnav .wt-nav{font-weight:500;min-height:36px}
.wt-act{display:flex;gap:6px}
.wt-act button{min-height:32px;min-width:32px;padding:0 10px;border:1px solid var(--wt-border);border-radius:9px;background:var(--wt-panel);color:var(--wt-text);font-size:12px;font-weight:600;cursor:pointer}
.wt-act button:hover{border-color:var(--wt-primary);color:var(--wt-primary)}
.wt-act button.danger:hover{border-color:var(--wt-red);color:var(--wt-red)}
.wt-act button[data-row-edit],.wt-act button[data-row-del],.wt-act button[data-row-dl]{width:34px;height:34px;padding:0;display:inline-flex;align-items:center;justify-content:center}
.wt-act button[data-row-del]{color:var(--wt-red)}
.wt-act button .wt-ic{width:16px;height:16px}
.wt-e-shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
.wt-e-shot img,.wt-e-noshot{display:block;width:100%;height:200px;object-fit:cover;border:1px solid var(--wt-border);border-radius:10px;margin:6px 0 4px}
.wt-e-noshot{display:flex;align-items:center;justify-content:center;color:var(--wt-muted);font-size:12px;background:var(--wt-panel)}
.wt-e-shot-meta{display:block;min-height:16px;color:var(--wt-muted);font-size:11px;margin-bottom:6px}
.wt-btn-ghost.wt-d-delete{color:var(--wt-red)}.wt-btn-ghost.wt-d-delete:hover{border-color:var(--wt-red);background:var(--wt-red-soft)}
.wt-check{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;cursor:pointer}
.wt-check input{width:16px;height:16px;margin:0;accent-color:var(--wt-primary)}
.wt-wrap{white-space:normal;min-width:170px;max-width:280px}
.wt-rep-stats{margin-bottom:14px;grid-template-columns:repeat(3,minmax(0,1fr))}
.wt-rep-actions{display:flex;gap:8px;flex-wrap:wrap}
.wt-ic{flex:none;opacity:.85}
.wt-main{min-width:0}
.wt-spacer{flex:1}
.wt-field{display:flex;flex-direction:column;gap:4px;font-size:10px;font-weight:700;color:var(--wt-muted);text-transform:uppercase;letter-spacing:.04em;min-width:0}
.wt-field select,.wt-field input,.wt-field textarea,.wt-search{min-height:38px;border:1px solid var(--wt-border);border-radius:8px;background:var(--wt-panel);color:var(--wt-text);padding:0 10px;font-size:13px;text-transform:none;letter-spacing:0;font-weight:500;font-family:inherit}
.wt-field select,.wt-field input,.wt-field textarea{width:100%}
.wt-field textarea{padding:8px 10px;min-height:76px;resize:vertical}
.wt-field input[readonly]{background:var(--wt-bg);color:var(--wt-muted)}
.wt-field input:focus,.wt-field select:focus,.wt-field textarea:focus,.wt-search:focus{outline:0;border-color:var(--wt-primary);box-shadow:0 0 0 3px var(--wt-primary-soft)}
.wt-field .wt-hint{font-size:11px;font-weight:500;text-transform:none;letter-spacing:0;color:var(--wt-muted)}
.wt-req{color:var(--wt-red)}
.wt-btn-primary{min-height:44px;padding:0 24px;border:0;border-radius:12px;background:var(--wt-primary);color:#fff;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px}
.wt-btn-primary:hover{filter:brightness(1.08)}
.wt-btn-primary:disabled{opacity:.55;cursor:default;filter:none}
.wt-btn-ghost{min-height:44px;padding:0 20px;border:1px solid var(--wt-border);border-radius:12px;background:var(--wt-panel);color:var(--wt-text);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;text-decoration:none}
.wt-btn-ghost:hover{border-color:var(--wt-primary);color:var(--wt-primary)}
.wt-btn-ghost:disabled{opacity:.55;cursor:default}
.wt-btn-wa{background:var(--wt-teal)}
.wt-btn-sm{min-height:34px;padding:0 14px;font-size:12px;border-radius:10px}
.wt-link{border:0;background:transparent;color:var(--wt-primary);font-size:12px;font-weight:700;cursor:pointer;padding:0}
.wt-card{background:var(--wt-panel);border:1px solid var(--wt-border);border-radius:13px;box-shadow:var(--wt-shadow);padding:14px 16px}
.wt-card h4{margin:0 0 8px;font-size:12px;font-weight:750;color:var(--wt-muted);text-transform:uppercase;letter-spacing:.04em}
.wt-title{font-size:21px;font-weight:700;margin:0}
.wt-head{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.wt-table-wrap{background:var(--wt-panel);border:1px solid var(--wt-border);border-radius:13px;box-shadow:var(--wt-shadow);overflow:auto}
.wt-table{width:100%;border-collapse:collapse;font-size:12px}
.wt-table th{text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--wt-muted);background:var(--wt-panel);padding:11px 12px;border-bottom:1px solid var(--wt-border);white-space:nowrap}
.wt-table td{padding:10px 12px;border-bottom:1px solid var(--wt-border);vertical-align:middle}
.wt-table tr:last-child td{border-bottom:0}
.wt-table tbody tr[data-name]{cursor:pointer}
.wt-table tbody tr[data-name]:hover td{background:var(--wt-primary-soft)}
.wt-table .wt-num{font-variant-numeric:tabular-nums;white-space:nowrap}
.wt-table .wt-empty{text-align:center;color:var(--wt-muted);padding:26px}
.wt-thumb{width:46px;height:36px;border-radius:8px;object-fit:cover;background:var(--wt-primary-soft);display:block}
.wt-nophoto{color:var(--wt-muted)}
.wt-thumbs{display:flex;gap:6px;align-items:center}
.wt-thumbs a{display:block}
.wt-confirm{width:420px}
.wt-confirm-text{margin:4px 0 0;font-size:14px;line-height:1.55}
.wt-pill{display:inline-block;padding:2px 9px;border-radius:999px;font-size:10px;font-weight:700;background:var(--wt-primary-soft);color:var(--wt-primary);white-space:nowrap}
.wt-pill.teal{background:var(--wt-teal-soft);color:var(--wt-teal)}
.wt-pill.amber{background:var(--wt-amber-soft);color:var(--wt-amber)}
.wt-pill.red{background:var(--wt-red-soft);color:var(--wt-red)}
.wt-icon-btn{min-height:32px;min-width:32px;padding:0 10px;border:1px solid var(--wt-border);border-radius:9px;background:var(--wt-panel);color:var(--wt-teal);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:700}
.wt-icon-btn:hover{border-color:var(--wt-teal);background:var(--wt-teal-soft)}
.wt-maplink{color:var(--wt-primary);text-decoration:none;font-weight:600;white-space:nowrap}
.wt-maplink:hover{text-decoration:underline}
.wt-modal-back{position:fixed;inset:0;z-index:1050;background:rgba(20,24,40,.5);display:flex;align-items:center;justify-content:center;padding:16px}
.wt-modal{width:560px;max-width:100%;max-height:92vh;overflow:auto;background:var(--wt-bg);border:1px solid var(--wt-border);border-radius:13px;box-shadow:var(--wt-shadow);padding:18px}
.wt-modal.wide{width:780px}
.wt-modal-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}
.wt-modal-head b{font-size:16px}
.wt-x{border:0;background:transparent;color:var(--wt-muted);font-size:18px;cursor:pointer}
.wt-modal-foot{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
.wt-form{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.wt-form .wide{grid-column:1/-1}
.wt-greet{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;margin:0 0 22px}
.wt-eyebrow{font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--wt-muted)}
.wt-hello{margin:6px 0 0;font-size:24px;font-weight:800;line-height:1.15;color:var(--wt-text)}
.wt-grad{background:linear-gradient(90deg,var(--wt-primary),#1fb8c9);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.wt-greet-r{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}
.wt-today{text-align:right}
.wt-datebox{margin-top:6px;min-width:150px;padding:9px 16px;border:1px solid var(--wt-border);border-radius:10px;background:var(--wt-panel);font-size:13px;font-weight:700;text-align:center}
.wt-side-foot{margin-top:auto;padding:12px 10px 4px;border-top:1px solid var(--wt-border);display:flex;flex-direction:column;gap:8px}
.wt-user{font-size:12px;font-weight:600;color:var(--wt-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wt-side-foot .wt-btn-ghost{width:100%}
.wt-menu,.wt-backdrop{display:none}
.wt-navbar{display:flex;align-items:center;gap:10px;min-height:66px;padding:10px 28px;background:var(--wt-panel);border-bottom:1px solid var(--wt-border)}
.wt-content{max-width:1406px;margin:0 auto;padding:28px 32px}
.wt-crumb{display:flex;align-items:center;gap:8px;font-size:13px;min-width:0;white-space:nowrap}
.wt-crumb .wt-crumb-root{color:var(--wt-muted)}
.wt-crumb .wt-crumb-sep{color:var(--wt-muted);font-size:11px}
.wt-crumb b{font-weight:700;overflow:hidden;text-overflow:ellipsis}
.wt-nb-btn{width:38px;height:38px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--wt-border);border-radius:10px;background:var(--wt-panel);color:var(--wt-text);cursor:pointer;padding:0}
.wt-nb-btn:hover{border-color:var(--wt-primary);color:var(--wt-primary)}
.wt-nb-btn.spin svg{animation:wt-spin .6s linear}
@keyframes wt-spin{to{transform:rotate(360deg)}}
.wt-avatar{width:38px;height:38px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--wt-primary-soft);color:var(--wt-primary);font-size:12px;font-weight:800;letter-spacing:.02em}
.wt-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:16px}
.wt-stat{background:var(--wt-panel);border:1px solid var(--wt-border);border-radius:13px;box-shadow:var(--wt-shadow);padding:16px}
.wt-stat-ic{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:var(--wt-primary-soft);color:var(--wt-primary)}
.wt-stat-ic.teal{background:var(--wt-teal-soft);color:var(--wt-teal)}
.wt-stat-ic.amber{background:var(--wt-amber-soft);color:var(--wt-amber)}
.wt-stat-n{font-size:28px;font-weight:800;margin-top:12px;line-height:1.1;font-variant-numeric:tabular-nums}
.wt-stat-l{font-size:12px;color:var(--wt-muted);margin-top:3px}
.wt-dash-card{padding:14px 0 0;overflow:hidden}
.wt-dash-card h4{padding:0 16px;display:flex;align-items:center;gap:8px;margin-bottom:10px}
.wt-flat{border:0;border-radius:0;box-shadow:none}
.wt-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--wt-primary)}
.wt-dot.teal{background:var(--wt-teal)}
.wt-dot.amber{background:var(--wt-amber)}
.wt-search{min-width:200px}
.wt-more{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px;font-size:12px;color:var(--wt-muted)}
.wt-sub{color:var(--wt-muted);margin:6px 0 0;font-size:13px}
.wt-pagehead{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:18px}
.wt-pagehead .wt-title{margin:0}
.wt-panel{padding:22px}
.wt-section-head{font-size:13px;font-weight:800;color:var(--wt-primary);margin:26px 0 14px;padding-bottom:9px;border-bottom:1px solid var(--wt-border)}
.wt-section-head:first-child{margin-top:0}
.wt-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.wt-grid3 .full{grid-column:1/-1}
.wt-uploads{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.wt-upload{border:2px dashed var(--wt-border);border-radius:13px;padding:17px;background:var(--wt-bg);text-align:center;min-width:0}
.wt-upload strong{display:block;font-size:13px}
.wt-upload p{font-size:12px;color:var(--wt-muted);margin:6px 0 12px}
.wt-upload .wt-shot-img{max-height:260px}
.wt-upload .wt-shot-meta{margin-top:8px}
.wt-upload .wt-shot-btns{justify-content:center;margin-top:8px}
.wt-upload.wt-optional:not(.has-shot){border:0;background:transparent;padding:0;text-align:left}
.wt-upload.wt-optional:not(.has-shot) .wt-shot-empty{align-items:flex-start;justify-content:flex-start;gap:0;min-height:0;text-align:left}
.wt-upload.wt-optional:not(.has-shot) p{margin:8px 0 0}
.wt-tiny{font-size:12px;color:var(--wt-muted)}
.wt-toolbar{display:grid;grid-template-columns:2fr 1.2fr 1fr 1fr 1fr auto;gap:12px;align-items:end}
.wt-toolbar-card{margin-bottom:14px}
.wt-dash-head{padding:0 16px 10px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.wt-dash-card .wt-dash-head h4{padding:0;margin:0}
.wt-seg{display:flex;flex-wrap:wrap;background:var(--wt-panel);border:1px solid var(--wt-border);border-radius:12px;padding:3px;gap:2px}
.wt-seg button{flex:1;min-height:40px;padding:0 16px;border:0;border-radius:9px;background:transparent;color:var(--wt-muted);font-size:13px;font-weight:700;cursor:pointer}
.wt-seg button.active{background:var(--wt-primary);color:#fff}
.wt-seg button.active[data-level=Full]{background:var(--wt-teal)}
.wt-seg button.active[data-level=Partial]{background:var(--wt-amber)}
.wt-seg button.active[data-level=Low]{background:var(--wt-red)}
.wt-label{font-size:10px;font-weight:700;color:var(--wt-muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}
.wt-shots{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.wt-shot{border:1px dashed var(--wt-border);border-radius:13px;background:var(--wt-bg);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
.wt-shot-head{font-size:12px;font-weight:700}
.wt-shot-empty{min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;color:var(--wt-muted);font-size:12px}
.wt-shot-img{width:100%;border-radius:10px;display:block;background:#0b0f19;aspect-ratio:4/3;object-fit:cover}
.wt-shot-meta{font-size:11px;color:var(--wt-muted);line-height:1.5}
.wt-shot-btns{display:flex;gap:8px;flex-wrap:wrap}
.wt-ev{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.wt-ev-v,.wt-fact-v{font-size:13px;font-weight:600;word-break:break-word}
.wt-fact-v.mute{color:var(--wt-muted);font-weight:500}
.wt-actions{display:flex;gap:10px;flex-wrap:wrap}
.wt-done{max-width:640px;text-align:center;padding:26px 20px}
.wt-done-ic{width:60px;height:60px;border-radius:50%;margin:0 auto 14px;display:grid;place-items:center;font-size:30px;font-weight:700;color:#fff;background:var(--wt-teal)}
.wt-done h3{margin:0;font-size:20px}
.wt-done p{color:var(--wt-muted);font-size:13px;margin:8px 0 0}
.wt-done .wt-actions{justify-content:center;margin-top:18px}
.wt-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.wt-fact-wide{grid-column:1/-1}
.wt-sec{margin:16px 0 8px;font-size:11px;font-weight:750;color:var(--wt-muted);text-transform:uppercase;letter-spacing:.05em}
.wt-photos{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.wt-photos a{display:block}
.wt-photos img{width:100%;border-radius:10px;display:block;border:1px solid var(--wt-border);background:#0b0f19}
.wt-photos small{display:block;margin-top:4px;color:var(--wt-muted);font-size:11px}
.wt-cam-modal{width:560px}
.wt-cam-box{position:relative;background:#0b0f19;border-radius:11px;overflow:hidden;aspect-ratio:4/3}
.wt-cam-box video,.wt-cam-box .wt-cam-shot{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.wt-cam-box video{transform:scaleX(-1)}
.wt-cam-box.back video{transform:none}
.wt-cam-note{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;color:#dfe3eb;font-size:13px;line-height:1.5}
.wt-gps{margin-top:10px;padding:9px 12px;border-radius:10px;font-size:12px;font-weight:600;line-height:1.45;background:var(--wt-primary-soft);color:var(--wt-primary)}
.wt-gps[data-state=ok]{background:var(--wt-teal-soft);color:var(--wt-teal)}
.wt-gps[data-state=bad]{background:var(--wt-red-soft);color:var(--wt-red)}
.wt-gps .wt-link{color:inherit;text-decoration:underline;margin-left:6px}
@media (max-width:900px){
.wt-content{padding:16px 14px}
.wt-navbar{padding:10px 14px;min-height:60px}
.wt-menu{display:inline-flex;align-items:center;justify-content:center;min-height:38px;min-width:38px;border:1px solid var(--wt-border);border-radius:10px;background:var(--wt-panel);color:var(--wt-text);font-size:18px;cursor:pointer}
.wt-shell{grid-template-columns:1fr}
.wt-nav-side{position:fixed;z-index:1040;left:0;top:0;bottom:0;min-height:0;height:auto;width:260px;max-width:82vw;border-radius:0 13px 13px 0;border:1px solid var(--wt-border);transform:translateX(-105%);transition:transform .2s ease;overflow:auto}
.wt-menu-open .wt-nav-side{transform:none}
.wt-menu-open .wt-backdrop{display:block;position:fixed;inset:0;z-index:1039;background:rgba(20,24,40,.45)}
.wt-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
.wt-ev{grid-template-columns:repeat(2,minmax(0,1fr))}
.wt-grid3{grid-template-columns:repeat(2,minmax(0,1fr))}
.wt-toolbar{grid-template-columns:repeat(2,minmax(0,1fr))}
.wt-toolbar>:first-child{grid-column:1/-1}
}
@media (max-width:720px){
.wt-form{grid-template-columns:1fr}
.wt-shots,.wt-photos,.wt-uploads,.wt-grid3{grid-template-columns:1fr}
.wt-panel{padding:15px}
.wt-upload.wt-optional:not(.has-shot) .wt-shot-empty,.wt-upload.wt-optional:not(.has-shot) .wt-shot-empty .wt-btn-ghost{width:100%}
.wt-facts{grid-template-columns:repeat(2,minmax(0,1fr))}
.wt-cam-box{aspect-ratio:3/4;max-height:62vh;width:100%;margin:0 auto}
.wt-field select,.wt-field input,.wt-field textarea,.wt-search{font-size:16px}
.wt-search{min-width:0;flex:1}
.wt-head .wt-spacer{display:none}
.wt-head .wt-btn-primary{flex:1}
.wt-actions>*{flex:1}
.wt-hello{font-size:21px}
.wt-greet-r{width:100%}
.wt-greet-r .wt-btn-primary{flex:1}
.wt-modal-foot>*{flex:1}
.wt-reg thead{display:none}
.wt-reg,.wt-reg tbody,.wt-reg tr,.wt-reg td{display:block;width:100%}
.wt-reg tr{padding:10px 14px;border-bottom:1px solid var(--wt-border)}
.wt-reg tr:last-child{border-bottom:0}
.wt-reg td{border:0;padding:4px 0;display:flex;justify-content:space-between;align-items:center;gap:12px;text-align:right}
.wt-reg td::before{content:attr(data-label);flex:none;color:var(--wt-muted);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;text-align:left}
.wt-reg td.wt-empty{display:block;text-align:center}
.wt-reg td.wt-empty::before{content:none}
}
@media (max-width:440px){.wt-stat-n{font-size:24px}.wt-seg button{padding:0 10px}}
.wt-sel{position:relative;display:block;width:100%}
.wt-sel>select{position:absolute;inset:0;width:100%;height:100%;opacity:0;pointer-events:none}
.wt-sel-t{width:100%;min-height:38px;display:flex;align-items:center;justify-content:space-between;gap:8px;border:1px solid var(--wt-border);border-radius:8px;background:var(--wt-panel);color:var(--wt-text);padding:0 10px;font:inherit;font-size:13px;font-weight:500;text-align:left;cursor:pointer;text-transform:none;letter-spacing:0}
.wt-sel-t .wt-ic{flex:none;opacity:.6}
.wt-sel-t.ph .wt-sel-label{color:var(--wt-muted)}
.wt-sel-t:focus,.wt-sel-t.open{outline:0;border-color:var(--wt-primary);box-shadow:0 0 0 3px var(--wt-primary-soft)}
.wt-sel-t:disabled{background:var(--wt-bg);color:var(--wt-muted);cursor:default}
.wt-sel-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wt-sel-panel{position:fixed;z-index:1200;background:var(--wt-panel);border:1px solid var(--wt-border);border-radius:12px;box-shadow:0 18px 40px rgba(20,24,40,.18);padding:8px;display:flex;flex-direction:column;gap:8px}
.wt-sel-panel[hidden]{display:none}
.wt-sel-search{min-height:38px;border:1px solid var(--wt-primary);border-radius:8px;padding:0 12px;font:inherit;font-size:13px;background:var(--wt-panel);color:var(--wt-text);outline:0;box-shadow:0 0 0 3px var(--wt-primary-soft);width:100%}
.wt-sel-list{list-style:none;margin:0;padding:0;overflow:auto}
.wt-sel-opt{padding:10px 12px;border-radius:8px;font-size:13px;cursor:pointer;color:var(--wt-text)}
.wt-sel-opt:hover,.wt-sel-opt.active{background:var(--wt-primary-soft)}
.wt-sel-opt.selected{color:var(--wt-primary);font-weight:600}
.wt-sel-none{padding:12px;color:var(--wt-muted);font-size:13px}

/* ==========================================================================================================
   DUX Digitech design system theme (tokens from dux-digitech-design-system/project/tokens/*.css)
   Iris = interactive, Cyan = data (numbers, IDs, amounts, dates in mono), Geist for UI, thin-stroke icons,
   hairlines + soft ambient shadows, one hairline iris -> cyan gradient accent, light + dark ("instrument").
   Written last so it re-maps the page's own --wt-* variables; the rules above stay as the structure.
   ========================================================================================================== */
.wt-app{
--wt-bg:#F3F4F7;--wt-panel:#FFFFFF;--wt-surface:#FFFFFF;--wt-card:#FFFFFF;
--wt-border:#E7E9EE;--wt-border-2:#DCDFE6;
--wt-text:#1A2030;--wt-text-2:#586273;--wt-muted:#8A93A3;
--wt-primary:#5C4DE6;--wt-primary-deep:#4A3CD0;--wt-primary-soft:rgba(92,77,230,.10);
--wt-teal:#0E9C8B;--wt-teal-soft:rgba(14,156,139,.12);
--wt-amber:#B0741A;--wt-amber-soft:rgba(176,116,26,.11);
--wt-red:#C8475E;--wt-red-soft:rgba(200,71,94,.09);
--wt-ok:#15916A;--wt-ok-soft:rgba(21,145,106,.10);
--wt-th:#FAFAFC;--wt-hover:rgba(92,77,230,.045);--wt-hdr:rgba(255,255,255,.82);
--wt-shadow:0 6px 26px rgba(22,28,46,.07);--wt-pop:0 10px 34px rgba(22,28,46,.10);--wt-inset:inset 0 1px 0 rgba(255,255,255,.6);
--wt-brand-glow:0 6px 18px rgba(109,94,246,.40);
--wt-grad:linear-gradient(90deg,#5C4DE6 0%,#4F9FD8 55%,#0E9C8B 100%);
--wt-grad-line:linear-gradient(90deg,rgba(92,77,230,.6) 0%,rgba(79,159,216,.6) 55%,rgba(14,156,139,.6) 100%);
--wt-ambient:radial-gradient(120% 64% at 50% -16%,rgba(92,77,230,.06),transparent 60%),radial-gradient(80% 50% at 88% 6%,rgba(14,156,139,.045),transparent 55%);
--wt-font:'Geist','Geist Variable',system-ui,-apple-system,'Segoe UI',sans-serif;
--wt-mono:'JetBrains Mono',ui-monospace,'SF Mono',Menlo,monospace;
--wt-spring:cubic-bezier(.22,1,.36,1);--wt-ease:cubic-bezier(.4,0,.2,1);
font-family:var(--wt-font);background:var(--wt-ambient),var(--wt-bg);-webkit-font-smoothing:antialiased;line-height:1.5}
[data-theme=dark] .wt-app{
--wt-bg:#0A0D13;--wt-panel:#161A25;--wt-surface:#11151E;--wt-card:linear-gradient(180deg,#181D29,#161A25);
--wt-border:#232938;--wt-border-2:#2C3344;
--wt-text:#E8EAF1;--wt-text-2:#9AA3B7;--wt-muted:#9AA3B7;
--wt-primary:#6D5EF6;--wt-primary-deep:#5B4DE0;--wt-primary-soft:rgba(109,94,246,.14);
--wt-teal:#2DD4BF;--wt-teal-soft:rgba(45,212,191,.14);
--wt-amber:#E0A85C;--wt-amber-soft:rgba(224,168,92,.11);
--wt-red:#E8738A;--wt-red-soft:rgba(232,115,138,.10);
--wt-ok:#34D39A;--wt-ok-soft:rgba(52,211,154,.10);
--wt-th:#141926;--wt-hover:rgba(109,94,246,.06);--wt-hdr:rgba(17,21,30,.80);
--wt-shadow:0 18px 50px rgba(0,0,0,.42);--wt-pop:0 14px 40px rgba(0,0,0,.40);--wt-inset:inset 0 1px 0 rgba(255,255,255,.045);
--wt-grad-line:linear-gradient(90deg,rgba(109,94,246,.6) 0%,rgba(79,159,216,.6) 55%,rgba(45,212,191,.6) 100%);
--wt-grad:linear-gradient(90deg,#6D5EF6 0%,#4F9FD8 55%,#2DD4BF 100%);
--wt-ambient:radial-gradient(120% 70% at 50% -12%,rgba(109,94,246,.16),transparent 60%),radial-gradient(90% 60% at 88% 8%,rgba(45,212,191,.07),transparent 55%)}
body.wt-active:has(.wt-app){background:var(--wt-bg,#F3F4F7)}
.wt-app :focus-visible{outline:2px solid var(--wt-primary);outline-offset:2px}
.wt-app ::selection{background:var(--wt-primary-soft)}

/* shell: sidebar + blurred header */
.wt-nav-side{background:var(--wt-surface);border-right-color:var(--wt-border)}
.wt-brand{border-top-color:var(--wt-border);font-weight:600;letter-spacing:-.01em}
.wt-nav{border-radius:12px;font-weight:500;color:var(--wt-text-2);transition:background .18s var(--wt-ease),color .18s var(--wt-ease),transform .25s var(--wt-spring)}
.wt-nav:hover{background:var(--wt-primary-soft);color:var(--wt-text);transform:translateX(3px)}
.wt-nav.active{background:var(--wt-primary-soft);color:var(--wt-primary);font-weight:600}
.wt-navbar{position:sticky;top:0;z-index:30;background:var(--wt-hdr);-webkit-backdrop-filter:blur(14px) saturate(1.4);backdrop-filter:blur(14px) saturate(1.4);border-bottom-color:var(--wt-border)}
.wt-crumb b{font-weight:600}
.wt-nb-btn,.wt-menu{border-radius:12px;border-color:var(--wt-border-2);background:var(--wt-surface);box-shadow:var(--wt-inset);transition:all .25s var(--wt-spring)}
.wt-nb-btn:hover{transform:translateY(-1px);border-color:var(--wt-primary);color:var(--wt-primary)}
.wt-avatar{background:var(--wt-primary-soft);color:var(--wt-primary);box-shadow:0 0 0 1px var(--wt-primary-soft)}
.wt-side-foot{border-top-color:var(--wt-border)}
.wt-user{color:var(--wt-text-2);font-weight:500}

/* type */
.wt-title{font-size:22px;font-weight:600;letter-spacing:-.025em}
.wt-hello{font-size:26px;font-weight:600;letter-spacing:-.025em}
.wt-grad{background:var(--wt-grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.wt-eyebrow,.wt-label,.wt-sec,.wt-card h4,.wt-field{font-size:11px;font-weight:600;letter-spacing:.08em;color:var(--wt-muted)}
.wt-field .wt-hint{letter-spacing:0}
.wt-sub,.wt-tiny,.wt-stat-l,.wt-more{color:var(--wt-muted)}
.wt-section-head{font-weight:600;color:var(--wt-primary);border-bottom-color:var(--wt-border)}

/* numbers, IDs, amounts and dates: mono + tabular, cyan */
.wt-amt,.wt-num,.wt-sr,.wt-id,.wt-stat-n,.wt-rep-card-v,.wt-datebox,.wt-pg-btn{font-family:var(--wt-mono);font-variant-numeric:tabular-nums}
.wt-amt,.wt-num,.wt-id,.wt-stat-n,.wt-rep-card-v{color:var(--wt-teal)}
.wt-id{font-weight:500}
.wt-stat-n{font-weight:600;letter-spacing:-.02em}
.wt-rep-card-v{font-weight:600;font-size:15.5px;letter-spacing:-.02em}
.wt-sr{font-weight:400}
.wt-datebox{font-weight:500;color:var(--wt-teal)}
input.wt-dash-date{display:block;cursor:pointer;outline:none;font-size:13px;min-width:150px;box-sizing:border-box}
input.wt-dash-date:focus{border-color:var(--wt-teal)}
.wt-table .wt-num,.wt-table .wt-amt{font-size:12.5px}

/* cards: hairline + ambient shadow + lit top edge, hairline gradient accent on filter bar and tables */
.wt-card,.wt-stat,.wt-table-wrap,.wt-datebox,.wt-seg,.wt-rep-msg{background:var(--wt-card);border-color:var(--wt-border);box-shadow:var(--wt-shadow),var(--wt-inset)}
.wt-card,.wt-stat,.wt-table-wrap,.wt-rep-msg{border-radius:16px}
.wt-toolbar-card,.wt-table-wrap,.wt-dash-card{background:var(--wt-grad-line) top/100% 2px no-repeat,var(--wt-card)}
.wt-flat{background:transparent;box-shadow:none}
.wt-stat{transition:transform .25s var(--wt-spring),border-color .18s var(--wt-ease)}
.wt-stat.wt-click:hover{transform:translateY(-2px);border-color:var(--wt-primary)}
.wt-stat-ic{border-radius:10px}
.wt-stat-s{color:var(--wt-text-2)}
.wt-modal{background:var(--wt-surface);border-color:var(--wt-border);border-radius:18px;box-shadow:var(--wt-pop),var(--wt-inset)}
.wt-modal-back{background:rgba(10,13,19,.46);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}
.wt-modal-head b{font-weight:600;letter-spacing:-.01em}
.wt-upload,.wt-shot{border-color:var(--wt-border-2);background:var(--wt-bg)}

/* tables */
.wt-table{font-size:13px}
.wt-table th{font-size:11px;font-weight:600;letter-spacing:.08em;color:var(--wt-muted);background:var(--wt-th);border-bottom-color:var(--wt-border)}
.wt-table td{border-bottom-color:var(--wt-border)}
.wt-table tbody tr[data-name]:hover td,.wt-table tbody tr[data-pay]:hover td,.wt-table tbody tr.wt-pickrow:hover td{background:var(--wt-hover)}
.wt-table tbody tr[data-pay]{cursor:pointer}
.wt-table .wt-empty{color:var(--wt-muted)}
.wt-table input[type=text],.wt-table input:not([type]){border-radius:10px;border-color:var(--wt-border-2);background:var(--wt-surface)}

/* inputs: 12px radius, hairline, iris focus ring */
.wt-field select,.wt-field input,.wt-field textarea,.wt-search,.wt-sel-t{border-radius:12px;border-color:var(--wt-border-2);background:var(--wt-surface);box-shadow:var(--wt-inset);color:var(--wt-text);font-weight:450;transition:border-color .25s var(--wt-ease),box-shadow .25s var(--wt-ease)}
.wt-field input:focus,.wt-field select:focus,.wt-field textarea:focus,.wt-search:focus,.wt-sel-t:focus,.wt-sel-t.open{border-color:var(--wt-primary);box-shadow:0 0 0 3px var(--wt-primary-soft)}
.wt-field input[readonly]{background:var(--wt-bg)}
.wt-date .wt-date-b{color:var(--wt-muted)}
.wt-sel-panel{background:var(--wt-surface);border-color:var(--wt-border-2);border-radius:14px;box-shadow:var(--wt-pop)}
.wt-sel-search{border-radius:10px;background:var(--wt-surface)}
.wt-sel-opt{border-radius:10px}
.wt-sel-opt:hover,.wt-sel-opt.active{background:var(--wt-hover)}
.wt-check input,.wt-pick,.wt-pick-all{accent-color:var(--wt-primary)}

/* buttons: pills; primary = iris gradient with brand glow */
.wt-btn-primary,.wt-btn-ghost{border-radius:999px;font-weight:500;min-height:40px;transition:all .25s var(--wt-spring)}
.wt-btn-primary{background:linear-gradient(150deg,var(--wt-primary),var(--wt-primary-deep));box-shadow:var(--wt-brand-glow),inset 0 1px 0 rgba(255,255,255,.22)}
.wt-btn-primary:hover:not(:disabled){filter:none;transform:translateY(-1px)}
.wt-btn-ghost{background:var(--wt-surface);border-color:var(--wt-border-2);box-shadow:var(--wt-inset);color:var(--wt-text)}
.wt-btn-ghost:hover:not(:disabled){transform:translateY(-1px);border-color:var(--wt-primary);color:var(--wt-primary)}
.wt-btn-sm{min-height:32px;padding:0 14px;border-radius:999px}
.wt-btn-wa{background:linear-gradient(150deg,var(--wt-teal),var(--wt-teal));box-shadow:none}
.wt-link{font-weight:600}
.wt-act button,.wt-icon-btn{border-radius:10px;border-color:var(--wt-border-2);background:var(--wt-surface);box-shadow:var(--wt-inset);transition:all .25s var(--wt-spring);display:inline-flex;align-items:center;justify-content:center}
.wt-act button:hover,.wt-icon-btn:hover{transform:translateY(-1px)}
.wt-act button .wt-ic{width:16px;height:16px}
.wt-btn-ghost.wt-d-delete,.wt-btn-ghost.wt-d-del{color:var(--wt-red)}
.wt-seg button{font-weight:500;border-radius:10px}
.wt-seg button.active{background:linear-gradient(150deg,var(--wt-primary),var(--wt-primary-deep));box-shadow:var(--wt-brand-glow)}

/* status tags: dot + tinted pill (DUX StatusTag): New = pending amber, Approved = iris, Completed = ok green */
.wt-pill{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:500;line-height:1;padding:4px 9px;border-radius:999px;background:var(--wt-primary-soft);color:var(--wt-primary)}
.wt-pill::before{content:"";width:5px;height:5px;border-radius:50%;background:currentColor;flex:none}
.wt-pill.amber{background:var(--wt-amber-soft);color:var(--wt-amber)}
.wt-pill.teal{background:var(--wt-ok-soft);color:var(--wt-ok)}
.wt-pill.red{background:var(--wt-red-soft);color:var(--wt-red)}
.wt-rep-sec .wt-pill::before{display:none}
.wt-gps{border-radius:12px}

/* report cards + pager */
.wt-rep-card{background:var(--wt-card);border-color:var(--wt-border);border-radius:14px;transition:border-color .18s var(--wt-ease),box-shadow .25s var(--wt-spring),background .18s var(--wt-ease)}
.wt-rep-card.tone-g{--tone:var(--wt-teal);--tone-soft:var(--wt-teal-soft)}
.wt-rep-card-l{color:var(--wt-text-2);font-weight:500}
.wt-rep-card.total .wt-rep-card-v{color:var(--wt-teal)}
.wt-rep-sec h3{font-weight:600;letter-spacing:-.02em}
.wt-pg-btn{border-radius:10px;border-color:var(--wt-border-2);background:var(--wt-surface);font-weight:500;font-size:12.5px}
.wt-pg-btn.active{background:linear-gradient(150deg,var(--wt-primary),var(--wt-primary-deep));border-color:transparent;box-shadow:var(--wt-brand-glow)}
.wt-pg-info{color:var(--wt-muted)}

/* icons: thin 1.7 stroke */
.wt-ic{opacity:1}
.wt-app svg.wt-ic *{stroke-width:1.7}

/* scrollbars */
.wt-app ::-webkit-scrollbar{width:10px;height:10px}
.wt-app ::-webkit-scrollbar-thumb{background:var(--wt-border-2);border-radius:10px;border:2px solid transparent;background-clip:content-box}

@media (prefers-reduced-motion:reduce){.wt-app *,.wt-app *::before{transition:none!important;animation:none!important}}

/* settings (masters) tables: first column strong, codes / numbers cyan mono, the rest secondary - not all one black */
.wt-mtable td{color:var(--wt-text-2)}
.wt-mtable td.wt-first{color:var(--wt-text);font-weight:500}
.wt-mtable td.wt-first b{font-weight:500}
.wt-mtable td.wt-num{color:var(--wt-teal)}
.wt-mtable .wt-sr{color:var(--wt-muted)}
.wt-subnav .wt-nav{color:var(--wt-text-2)}
.wt-subnav .wt-nav.active{color:var(--wt-primary)}

`;

class WaterTankerApp {
	constructor(wrapper, page) {
		this.wrapper = wrapper;
		this.page = page;
		this.tab = "dashboard";
		this.dashTimer = null;
		this.searchTimer = null;
		this.boot = { suppliers: [], vehicles: [], user: "", can_create: true, can_write: true };
		this.rows = [];
		this.total = 0;
		this.filter = { search: "", level: "", supplier: "", from_date: frappe.datetime.get_today(), to_date: frappe.datetime.get_today() }; // the register's filters (today by default)
		this.admin = frappe.user.has_role("System Manager") || frappe.user.has_role("Water Tanker Manager"); // settings (the masters) are for administrators
		this.rep = { search: "", level: "", supplier: "", from_date: frappe.datetime.month_start(), to_date: frappe.datetime.get_today() }; // the report's filters
		this.report = null; // what the report on screen shows
		this.masters = { suppliers: [], vehicles: [], uoms: null };
		this.cap = { tanker: null, level: null }; // the photos taken on the open form, with their time and place
		this.ref = uuid(); // one per form: a repeated submit of the same form can never make a second entry
		this.saving = false;
		this.camera = null;
		this.facing = this.savedFacing();
		this.injectStyle();
		this.render();
		this.initSelects();
		this.bind();
		frappe.router.on("change", () => {
			if (frappe.get_route()[0] !== "water_tanker_tracker") {
				this.stopDashboard();
				this.closeCamera();
				this.setChrome(false);
			}
		});
		this.loadBoot();
	}

	// ---- small helpers ----------------------------------------------------------------------------------

	$(selector) {
		return $(this.page.main).find(selector);
	}

	call(method, args) {
		return new Promise((resolve, reject) =>
			frappe.call({ method: API + method, args, callback: (r) => resolve(r.message), error: () => reject(new Error("call failed")) })
		);
	}

	warn(message) {
		frappe.show_alert({ message, indicator: "red" }, 6);
	}

	savedFacing() {
		try {
			return window.localStorage.getItem("wt_facing") === "user" ? "user" : "environment";
		} catch (e) {
			return "environment";
		}
	}

	// ---- dropdowns with a search box: this page's own look instead of the browser's select ---------------------------------
	// Every <select> keeps working underneath (its value is read and its change event fires as before); what the person sees
	// is a button that opens a panel with a Search box and a scrolling list, the chosen option in the theme colour.

	initSelects() {
		this.selPanel = $(`<div class="wt-sel-panel" hidden><input class="wt-sel-search" placeholder="${__("Search...")}" autocomplete="off" aria-label="${__("Search")}"><ul class="wt-sel-list" role="listbox"></ul></div>`);
		this.$(".wt-app").append(this.selPanel);
		this.selOpen = null;
		this.selObserver = new MutationObserver(() => {
			window.clearTimeout(this.selTimer);
			this.selTimer = window.setTimeout(() => this.enhanceSelects(), 0);
		});
		this.selObserver.observe(this.$(".wt-app")[0], { childList: true, subtree: true });
		this.enhanceSelects();
		$(document)
			.off("mousedown.wtsel")
			.on("mousedown.wtsel", (e) => {
				if (this.selOpen && !$(e.target).closest(".wt-sel-panel, .wt-sel-t").length) this.closeSel();
			});
		$(window)
			.off("resize.wtsel scroll.wtsel")
			.on("resize.wtsel scroll.wtsel", () => this.placeSel());
	}

	/** Give every select that has no button yet one; selects that appear later (forms, dialogs) are picked up too. */
	enhanceSelects() {
		this.$(".wt-app select").not("[data-wtsel]").each((_, el) => {
			const select = $(el).attr("data-wtsel", "1").attr("tabindex", "-1");
			select.wrap('<span class="wt-sel"></span>');
			select.after(`<button type="button" class="wt-sel-t" aria-haspopup="listbox"><span class="wt-sel-label"></span>${ICONS.chev}</button>`);
		});
		this.refreshSelects();
	}

	/** Show each button's label from its select's current value (call after a value is set from code). */
	refreshSelects() {
		this.$(".wt-app select[data-wtsel]").each((_, el) => {
			const select = $(el);
			const t = select.siblings(".wt-sel-t");
			const chosen = select.find("option:selected").first();
			const label = t.find(".wt-sel-label");
			const shown = chosen.length ? chosen.text() : "";
			if (label.text() !== shown) label.text(shown);
			t.toggleClass("ph", !select.val()).prop("disabled", !!select.prop("disabled"));
		});
	}

	bindSelects(root) {
		root.on("click", ".wt-sel-t", (e) => {
			e.preventDefault();
			this.openSel($(e.currentTarget));
		});
		root.on("click", ".wt-sel-opt", (e) => this.chooseSel($(e.currentTarget).attr("data-v")));
		root.on("input", ".wt-sel-search", (e) => this.paintSelList(String($(e.currentTarget).val() || "")));
		root.on("keydown", ".wt-sel-search", (e) => this.selKey(e));
		root.on("keydown", ".wt-sel-t", (e) => {
			if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
				e.preventDefault();
				this.openSel($(e.currentTarget));
			}
		});
	}

	openSel(trigger) {
		if (trigger.prop("disabled")) return;
		if (this.selOpen && this.selOpen.trigger[0] === trigger[0]) return this.closeSel(true);
		this.closeSel();
		this.selOpen = { select: trigger.siblings("select"), trigger };
		trigger.addClass("open");
		this.selPanel.prop("hidden", false).find(".wt-sel-search").val("");
		this.paintSelList("");
		this.placeSel();
		this.selPanel.find(".wt-sel-search").trigger("focus");
	}

	closeSel(focusTrigger) {
		if (!this.selOpen) return;
		const { trigger } = this.selOpen;
		trigger.removeClass("open");
		this.selPanel.prop("hidden", true);
		this.selOpen = null;
		if (focusTrigger) trigger.trigger("focus");
	}

	paintSelList(term) {
		if (!this.selOpen) return;
		const select = this.selOpen.select;
		const current = String(select.val() == null ? "" : select.val());
		const needle = term.toLowerCase().trim();
		const items = select
			.find("option")
			.map((_, o) => ({ v: $(o).attr("value") == null ? $(o).text() : $(o).attr("value"), t: $(o).text() }))
			.get()
			.filter((i) => !needle || i.t.toLowerCase().includes(needle));
		const list = this.selPanel.find(".wt-sel-list");
		list.html(
			items.length
				? items.map((i) => `<li class="wt-sel-opt ${i.v === current ? "selected" : ""}" data-v="${esc(i.v)}" role="option">${esc(i.t)}</li>`).join("")
				: `<li class="wt-sel-none">${__("No results")}</li>`
		);
		const start = list.find(".selected").first().length ? list.find(".selected").first() : list.find(".wt-sel-opt").first();
		start.addClass("active");
		if (start[0] && start[0].scrollIntoView) start[0].scrollIntoView({ block: "nearest" });
	}

	selKey(e) {
		const list = this.selPanel.find(".wt-sel-list");
		const opts = list.find(".wt-sel-opt");
		const at = opts.index(list.find(".wt-sel-opt.active"));
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			const next = opts.eq(Math.max(0, Math.min(opts.length - 1, at + (e.key === "ArrowDown" ? 1 : -1))));
			opts.removeClass("active");
			next.addClass("active");
			if (next[0] && next[0].scrollIntoView) next[0].scrollIntoView({ block: "nearest" });
		} else if (e.key === "Enter") {
			e.preventDefault();
			const pick = list.find(".wt-sel-opt.active");
			if (pick.length) this.chooseSel(pick.attr("data-v"));
		} else if (e.key === "Escape" || e.key === "Tab") {
			this.closeSel(e.key === "Escape");
		}
	}

	chooseSel(value) {
		if (!this.selOpen) return;
		const { select } = this.selOpen;
		select.val(value).trigger("change");
		this.closeSel(true);
		this.refreshSelects();
	}

	/** The panel sits under its button (or above it when there is no room), as wide as the button. */
	placeSel() {
		if (!this.selOpen) return;
		const rect = this.selOpen.trigger[0].getBoundingClientRect();
		const below = window.innerHeight - rect.bottom;
		const above = rect.top;
		const up = below < 260 && above > below;
		this.selPanel.css({
			left: Math.max(8, rect.left),
			width: Math.max(rect.width, 220),
			top: up ? "auto" : rect.bottom + 4,
			bottom: up ? window.innerHeight - rect.top + 4 : "auto",
		});
		this.selPanel.find(".wt-sel-list").css("max-height", Math.max(120, Math.min(260, (up ? above : below) - 80)));
	}

	/** Values set from code (a form filled, a filter reset) have no event: keep the buttons' labels in step while the page is open. */
	startSelSync() {
		if (this.selSync) return;
		this.selSync = window.setInterval(() => {
			if (!document.hidden) this.refreshSelects();
		}, 400);
	}

	stopSelSync() {
		window.clearInterval(this.selSync);
		this.selSync = null;
	}

	setChrome(on) {
		document.body.classList.toggle("wt-active", on);
		this.applyTheme(on);
		if (on) this.startSelSync();
		else {
			this.stopSelSync();
			this.closeSel();
		}
	}

	/** DUX light / dark. The choice is remembered per browser (shared with the other DUX pages); the desk's own theme comes back when this page is left. */
	applyTheme(on) {
		const root = document.documentElement;
		if (on) {
			if (this.deskTheme === undefined) this.deskTheme = root.getAttribute("data-theme");
			let saved = "";
			try {
				saved = window.localStorage.getItem("dux_theme") || "";
			} catch (e) {
				saved = "";
			}
			if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
		} else if (this.deskTheme !== undefined) {
			if (this.deskTheme === null) root.removeAttribute("data-theme");
			else root.setAttribute("data-theme", this.deskTheme);
			this.deskTheme = undefined;
		}
		this.paintThemeBtn();
	}

	paintThemeBtn() {
		const dark = document.documentElement.getAttribute("data-theme") === "dark";
		this.$(".wt-theme").html(dark ? ICONS.sun : ICONS.moon).attr("title", dark ? __("Light theme") : __("Dark theme"));
	}

	toggleTheme() {
		const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
		document.documentElement.setAttribute("data-theme", next);
		try {
			window.localStorage.setItem("dux_theme", next);
		} catch (e) {
			/* private window: the choice just is not remembered */
		}
		this.paintThemeBtn();
	}

	injectStyle() {
		if (document.getElementById("wt-style")) return;
		const style = document.createElement("style");
		style.id = "wt-style";
		style.textContent = WT_CSS;
		document.head.appendChild(style);
		if (!document.getElementById("dux-fonts")) {
			const link = document.createElement("link");
			link.id = "dux-fonts";
			link.rel = "stylesheet";
			link.href = "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;450;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
			document.head.appendChild(link);
		}
	}

	initials() {
		const words = String(frappe.session.user_fullname || frappe.session.user || "").trim().split(/\s+/).filter(Boolean);
		return ((words[0] || "?")[0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
	}

	// ---- shell -------------------------------------------------------------------------------------------

	render() {
		$(this.page.main).html(`
			<div class="wt-app">
				<div class="wt-backdrop"></div>
				<div class="wt-shell">
					<aside class="wt-nav-side">
						<div class="wt-side-title">${__("Water Tanker Tracker")}</div>
						<button type="button" class="wt-nav active" data-tab="dashboard"><span class="wt-nav-l">${ICONS.dashboard}${__("Dashboard")}</span></button>
						<button type="button" class="wt-nav" data-tab="register"><span class="wt-nav-l">${ICONS.register}${__("Water Tanker Register")}</span></button>
						<button type="button" class="wt-nav" data-tab="report"><span class="wt-nav-l">${ICONS.report}${__("Report")}</span></button>
						${this.admin ? `<button type="button" class="wt-nav wt-group" data-group="settings"><span class="wt-nav-l">${ICONS.settings}${__("Settings")}</span>${ICONS.chev}</button>
						<div class="wt-subnav" data-subnav="settings">
							<button type="button" class="wt-nav" data-tab="suppliers"><span class="wt-nav-l">${__("Water Suppliers")}</span></button>
							<button type="button" class="wt-nav" data-tab="vehicles"><span class="wt-nav-l">${__("Water Tanker Vehicles")}</span></button>
						</div>` : ""}
						<div class="wt-side-foot">
							<div class="wt-user">${esc(frappe.session.user_fullname || frappe.session.user)}</div>
							<button type="button" class="wt-btn-ghost wt-btn-sm wt-logout">${__("Logout")}</button>
						</div>
					</aside>
					<main class="wt-main">
						<div class="wt-navbar">
							<button type="button" class="wt-menu" aria-label="${__("Menu")}">☰</button>
							<div class="wt-crumb"><span class="wt-crumb-root">${__("Water Tanker Tracker")}</span><span class="wt-crumb-sep">›</span><b class="wt-crumb-now">${__(TITLES.dashboard)}</b></div>
							<div class="wt-spacer"></div>
							<button type="button" class="wt-nb-btn wt-theme" aria-label="${__("Theme")}"></button>
							<button type="button" class="wt-nb-btn wt-refresh" title="${__("Refresh")}" aria-label="${__("Refresh")}">${ICONS.refresh}</button>
							<span class="wt-avatar" title="${esc(frappe.session.user_fullname || frappe.session.user)}">${esc(this.initials())}</span>
						</div>
						<div class="wt-content">
							<section data-pane="dashboard">${this.dashboardHtml()}</section>
							<section data-pane="register" hidden>${this.registerHtml()}</section>
							<section data-pane="entry" hidden></section>
							<section data-pane="report" hidden>${this.reportHtml()}</section>
							<section data-pane="suppliers" hidden>${this.masterHtml("suppliers")}</section>
							<section data-pane="vehicles" hidden>${this.masterHtml("vehicles")}</section>
						</div>
					</main>
				</div>
			</div>`);
	}

	greetingHtml() {
		const hour = new Date().getHours();
		const word = hour < 12 ? __("morning") : hour < 17 ? __("afternoon") : __("evening");
		const name = frappe.session.user_fullname || frappe.session.user;
		return `<div>
				<div class="wt-eyebrow">${__("Water Tanker Tracker")} · ${__("Dashboard")}</div>
				<h2 class="wt-hello">${__("Good")} <span class="wt-grad">${esc(word)}</span>, ${esc(name)}</h2>
			</div>
			<div class="wt-greet-r">
				<div class="wt-today"><div class="wt-eyebrow wt-dash-date-l">${this.dashDate && this.dashDate !== frappe.datetime.get_today() ? __("Date") : __("Today")}</div><input type="date" class="wt-datebox wt-dash-date" value="${esc(this.dashDate || frappe.datetime.get_today())}"></div>
			</div>`;
	}

	dashboardHtml() {
		const stat = (key, icon, tone, label) =>
			`<div class="wt-stat"><div class="wt-stat-ic ${tone}">${icon}</div><div class="wt-stat-n" data-stat="${key}">–</div><div class="wt-stat-l">${label}</div></div>`;
		return `
			<div class="wt-greet">${this.greetingHtml()}</div>
			<div class="wt-stats">
				${stat("total", ICONS.truck, "", __("Total Water Tanker Arrivals"))}
				${stat("full", ICONS.drop, "teal", __("Full Water Tankers"))}
				${stat("partial_low", ICONS.alert, "amber", __("Partial Level Water Tankers"))}
				${stat("today", ICONS.calendar, "", __("Today's Arrivals"))}
			</div>
			<div class="wt-card wt-dash-card">
				<div class="wt-dash-head">
					<h4><i class="wt-dot teal"></i>${__("Recent Water Tanker Entries")}</h4>
				</div>
				<div class="wt-table-wrap wt-flat"><table class="wt-table wt-reg"><thead><tr><th>${__("Date & Time")}</th><th>${__("Vehicle")}</th><th>${__("Water Supplier")}</th><th>${__("Tank Level")}</th><th>${__("Photo")}</th></tr></thead><tbody data-recent></tbody></table></div>
			</div>`;
	}

	registerHtml() {
		return `
			<div class="wt-pagehead"><div><h2 class="wt-title">${__("Water Tanker Register")}</h2></div>
				<button type="button" class="wt-btn-primary wt-new">${ICONS.plus}${__("New Water Tanker Entry")}</button></div>
			<div class="wt-card wt-toolbar-card"><div class="wt-toolbar">
				<label class="wt-field">${__("Search")}<input class="wt-reg-search"></label>
				<label class="wt-field">${__("Water Supplier")}<select class="wt-sup-filter"><option value="">${__("All suppliers")}</option></select></label>
				<label class="wt-field">${__("Tank Level")}<select class="wt-level-filter">
					<option value="">${__("All level statuses")}</option>
					<option value="Full">${__("Full")}</option>
					<option value="Partial / Low">${__("Partial")}</option>
					<option value="Not Checked">${__("Not Checked")}</option>
				</select></label>
				<label class="wt-field">${__("From date")}<input type="date" class="wt-reg-from"></label>
				<label class="wt-field">${__("To date")}<input type="date" class="wt-reg-to"></label>
				<button type="button" class="wt-btn-ghost wt-reg-clear">${__("Clear")}</button>
			</div></div>
			<div class="wt-table-wrap"><table class="wt-table wt-reg"><thead><tr><th>${__("Date & Time")}</th><th>${__("Vehicle Number")}</th><th>${__("Water Supplier")}</th><th>${__("Tank Level")}</th><th>${__("Photo")}</th><th>${__("GPS Location")}</th><th>${__("Actions")}</th></tr></thead><tbody data-register></tbody></table></div>
			<div class="wt-more"><span class="wt-count"></span><button type="button" class="wt-btn-ghost wt-btn-sm wt-load-more" hidden>${__("Load more")}</button></div>`;
	}

	bind() {
		const root = $(this.page.main);
		this.bindSelects(root);
		root.on("click", ".wt-nav[data-tab]", (e) => this.open($(e.currentTarget).data("tab")));
		root.on("click", ".wt-menu, .wt-backdrop", () => this.$(".wt-app").toggleClass("wt-menu-open"));
		root.on("click", ".wt-logout", () => this.confirm(__("Log out of Water Tanker Tracker?"), () => frappe.app.logout()));
		root.on("click", ".wt-refresh", () => this.refresh());
		root.on("click", ".wt-theme", () => this.toggleTheme());
		root.on("click", ".wt-new", () => this.newEntry());
		root.on("click", ".wt-back", () => this.open("register"));
		root.on("click", ".wt-group", () => {
			this.$('[data-subnav="settings"]').toggleClass("open");
			this.$(".wt-group").toggleClass("open");
		});

		// report
		root.on("change", ".wt-rp-sup, .wt-rp-level, .wt-rp-from, .wt-rp-to", (e) => {
			const box = $(e.currentTarget);
			if (box.is(".wt-rp-from, .wt-rp-to")) this.coupleDates(".wt-rp-from", ".wt-rp-to", box.is(".wt-rp-to") ? "to" : "from");
			this.readReportFilters();
			this.loadReport();
		});
		root.on("input", ".wt-rp-search", (e) => {
			window.clearTimeout(this.searchTimer);
			const term = $(e.currentTarget).val();
			this.searchTimer = window.setTimeout(() => {
				this.readReportFilters();
				this.loadReport();
			}, 350);
		});
		root.on("click", ".wt-rp-clear", () => {
			this.rep = { search: "", level: "", supplier: "", from_date: frappe.datetime.month_start(), to_date: frappe.datetime.get_today() };
			this.syncReportFilters();
			this.loadReport();
		});
		root.on("click", ".wt-rp-excel", () => this.downloadReport("export_excel", __("Excel")));
		root.on("click", ".wt-rp-pdf", () => this.downloadReport("export_pdf", __("PDF")));
		root.on("click", ".wt-rp-print", () => this.printReport());

		// masters
		root.on("click", "[data-add]", (e) => this.masterForm($(e.currentTarget).data("add")));
		root.on("click", "[data-edit]", (e) => this.masterForm($(e.currentTarget).data("edit"), $(e.currentTarget).attr("data-key")));
		root.on("click", "[data-del]", (e) => this.masterDelete($(e.currentTarget).data("del"), $(e.currentTarget).attr("data-key")));
		root.on("input", ".wt-master-search", (e) => {
			const input = $(e.currentTarget);
			const term = String(input.val() || "").toLowerCase().trim();
			input.closest("section").find("tbody tr").each((_, tr) => {
				const row = $(tr);
				if (row.find(".wt-empty").length) return;
				row.toggle(!term || row.text().toLowerCase().includes(term));
			});
		});

		// lists: a row opens the entry, the buttons inside it do their own thing
		root.on("click", "tr[data-name]", (e) => {
			if ($(e.target).closest("a,button").length) return;
			this.detail($(e.currentTarget).data("name"));
		});
		root.on("click", "[data-row-edit]", (e) => this.detail($(e.currentTarget).attr("data-row-edit"), true));
		root.on("click", "[data-row-del]", (e) => this.deleteEntry($(e.currentTarget).attr("data-row-del")));
		root.on("click", "[data-row-dl]", async (e) => {
			const button = $(e.currentTarget);
			if (button.prop("disabled")) return;
			button.prop("disabled", true);
			let entry;
			try {
				entry = await this.call("get_entry", { name: button.attr("data-row-dl") });
			} catch (err) {
				button.prop("disabled", false);
				return;
			}
			this.downloadImage(entry, button);
		});
		root.on("change", ".wt-dash-date", (e) => {
			const picked = String($(e.currentTarget).val() || "");
			this.dashDate = picked && picked !== frappe.datetime.get_today() ? picked : "";
			this.$(".wt-dash-date-l").text(this.dashDate ? __("Date") : __("Today"));
			if (!picked) $(e.currentTarget).val(frappe.datetime.get_today());
			this.loadDashboard();
		});
		root.on("change", ".wt-level-filter, .wt-sup-filter, .wt-reg-from, .wt-reg-to", (e) => {
			const box = $(e.currentTarget);
			if (box.is(".wt-reg-from, .wt-reg-to")) this.coupleDates(".wt-reg-from", ".wt-reg-to", box.is(".wt-reg-to") ? "to" : "from");
			this.readFilters();
			this.loadRegister(true);
		});
		root.on("click", ".wt-reg-clear", () => {
			this.filter = { search: "", level: "", supplier: "", from_date: frappe.datetime.get_today(), to_date: frappe.datetime.get_today() };
			this.syncFilters();
			this.loadRegister(true);
		});
		root.on("input", ".wt-reg-search", (e) => {
			window.clearTimeout(this.searchTimer);
			const term = $(e.currentTarget).val();
			this.searchTimer = window.setTimeout(() => {
				this.filter.search = term;
				this.loadRegister(true);
			}, 350);
		});
		root.on("click", ".wt-load-more", () => this.loadRegister(false));

		// the entry form
		root.on("click", "[data-capture]", (e) => this.capture($(e.currentTarget).data("capture")));
		root.on("click", "[data-remove]", (e) => {
			this.cap[$(e.currentTarget).data("remove")] = null;
			this.paintShots();
		});
		root.on("click", ".wt-save", () => this.save());
		root.on("click", ".wt-clear", () => this.clearForm());
		root.on("input", '[data-f="vehicle_number"]', () => this.vehicleChanged());
		root.on("input", '[data-f="water_supplier"]', (e) => $(e.currentTarget).removeAttr("data-auto"));
		root.on("click", ".wt-view-saved", (e) => this.detail($(e.currentTarget).data("name")));
		root.on("click", ".wt-share-saved", () => this.saved && this.share(this.saved));
	}

	open(tab) {
		this.closeSel();
		this.tab = tab;
		this.$(".wt-app").removeClass("wt-menu-open");
		this.$(".wt-nav").removeClass("active");
		this.$(`.wt-nav[data-tab="${tab}"]`).addClass("active");
		this.$("[data-pane]").attr("hidden", true);
		this.$(`[data-pane="${tab}"]`).removeAttr("hidden");
		this.page.set_title(__(TITLES[tab]));
		this.$(".wt-crumb-now").text(__(TITLES[tab]));
		if (tab === "dashboard") this.startDashboard();
		else this.stopDashboard();
		if (tab === "register") {
			this.syncFilters();
			this.loadRegister(true);
		}
		if (tab === "report") {
			this.syncReportFilters();
			this.loadReport();
		}
		if (tab === "suppliers" || tab === "vehicles") {
			this.$('[data-subnav="settings"]').addClass("open");
			this.$('[data-group="settings"]').addClass("open");
			this.loadMaster(tab);
		}
		window.scrollTo(0, 0);
	}

	onShow() {
		this.setChrome(true);
		if (this.tab === "dashboard") this.startDashboard();
		if (!this.boot.user) this.loadBoot();
	}

	refresh() {
		const button = this.$(".wt-refresh").addClass("spin");
		window.setTimeout(() => button.removeClass("spin"), 650);
		this.loadBoot();
		if (this.tab === "dashboard") this.loadDashboard();
		else if (this.tab === "register") this.loadRegister(true);
		else if (this.tab === "report") this.loadReport();
		else if (this.tab === "suppliers" || this.tab === "vehicles") this.loadMaster(this.tab);
	}

	async loadBoot() {
		try {
			this.boot = (await this.call("bootstrap")) || this.boot;
		} catch (e) {
			return; // frappe has already shown the reason
		}
		this.fillLists();
		if (!this.boot.can_create) this.$(".wt-new").hide();
	}

	fillLists() {
		this.$("#wt-suppliers").html(this.boot.suppliers.map((s) => `<option value="${esc(s.name)}"></option>`).join(""));
		this.$("#wt-vehicles").html(this.boot.vehicles.map((v) => `<option value="${esc(v.name)}">${esc(v.water_supplier || "")}</option>`).join(""));
		this.$(".wt-sup-filter").html(
			`<option value="">${__("All suppliers")}</option>` + this.boot.suppliers.map((s) => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join("")
		);
		this.$(".wt-sup-filter").val(this.filter.supplier);
		this.$(".wt-rp-sup").html(this.$(".wt-sup-filter").html()).val(this.rep.supplier);
	}

	/**
	 * From can never be after To. Each date box is limited to the other (so the picker will not offer a bad day)
	 * and a date typed by hand that breaks the rule is put right with a message.
	 */
	coupleDates(fromSel, toSel, changed) {
		const from = this.$(fromSel);
		const to = this.$(toSel);
		let a = String(from.val() || "");
		let b = String(to.val() || "");
		if (a && b && a > b) {
			this.warn(__("From date cannot be after To date"));
			if (changed === "to") to.val(a);
			else from.val(b);
			a = String(from.val() || "");
			b = String(to.val() || "");
		}
		if (a) to.attr("min", a);
		else to.removeAttr("min");
		if (b) from.attr("max", b);
		else from.removeAttr("max");
	}

	/** The captured photos of an entry: the tanker photo and, when there is one, the tank level photo. Click opens the original. */
	photosCell(e) {
		const one = (url, original, label) =>
			url ? `<a href="${esc(original || url)}" target="_blank" rel="noopener" title="${esc(label)}"><img class="wt-thumb" src="${esc(url)}" alt="${esc(label)}" loading="lazy"></a>` : "";
		const html =
			one(e.tanker_photo_stamped || e.tanker_photo, e.tanker_photo, __("Water Tanker photo")) +
			one(e.tank_level_photo_stamped || e.tank_level_photo, e.tank_level_photo, __("Tank level photo"));
		return html ? `<div class="wt-thumbs">${html}</div>` : `<span class="wt-nophoto">—</span>`;
	}

	/** Put the register's filters into its boxes. */
	syncFilters() {
		this.$(".wt-reg-search").val(this.filter.search);
		this.$(".wt-sup-filter").val(this.filter.supplier);
		this.$(".wt-level-filter").val(this.filter.level);
		this.$(".wt-reg-from").val(this.filter.from_date);
		this.$(".wt-reg-to").val(this.filter.to_date);
		this.coupleDates(".wt-reg-from", ".wt-reg-to");
	}

	/** Take the register's filters from its boxes. */
	readFilters() {
		this.filter = {
			search: String(this.$(".wt-reg-search").val() || ""),
			supplier: String(this.$(".wt-sup-filter").val() || ""),
			level: String(this.$(".wt-level-filter").val() || ""),
			from_date: String(this.$(".wt-reg-from").val() || ""),
			to_date: String(this.$(".wt-reg-to").val() || ""),
		};
	}

	// ---- dashboard ----------------------------------------------------------------------------------------

	startDashboard() {
		this.loadDashboard();
		if (!this.dashTimer) this.dashTimer = window.setInterval(() => this.loadDashboard(), 30000);
	}

	stopDashboard() {
		if (this.dashTimer) window.clearInterval(this.dashTimer);
		this.dashTimer = null;
	}

	async loadDashboard() {
		let data;
		try {
			const day = this.dashDate || frappe.datetime.get_today();
			data = await this.call("dashboard", { recent: 8, from_date: day, to_date: day });
		} catch (e) {
			return;
		}
		["total", "full", "partial_low", "today"].forEach((key) => this.$(`[data-stat="${key}"]`).text(data[key] == null ? "–" : data[key]));
		this.rows = this.mergeRows(this.rows, data.recent || []);
		this.$("[data-recent]").html(
			(data.recent || []).length
				? data.recent.map((e) => this.entryRow(e, false)).join("")
				: `<tr><td class="wt-empty" colspan="5">${this.dashDate ? __("No water tanker entries on this date") : __("No water tanker entries yet")}</td></tr>`
		);
	}

	mergeRows(existing, fresh) {
		const byName = new Map(existing.map((r) => [r.name, r]));
		fresh.forEach((r) => byName.set(r.name, r));
		return [...byName.values()];
	}

	findRow(name) {
		return this.rows.find((r) => r.name === name);
	}

	photoCell(e) {
		const url = e.tanker_photo_stamped || e.tanker_photo;
		return url ? `<img class="wt-thumb" src="${esc(url)}" alt="" loading="lazy">` : `<span class="wt-nophoto">—</span>`;
	}

	locationCell(e) {
		return hasPoint(e)
			? `<a class="wt-maplink" href="${esc(mapUrl(e.latitude, e.longitude))}" target="_blank" rel="noopener" title="${__("Open in Google Maps")}">${ICONS.pin.replace('class="wt-ic"', 'class="wt-ic" style="vertical-align:-4px;margin-right:4px"')}${esc(Number(e.latitude).toFixed(5))}, ${esc(Number(e.longitude).toFixed(5))}</a>`
			: `<span class="wt-nophoto">—</span>`;
	}

	entryRow(e, full) {
		const cells = [
			`<td class="wt-num" data-label="${__("Date & Time")}">${esc(fmtDT(e.arrival_datetime))}</td>`,
			`<td data-label="${__("Vehicle")}"><b class="wt-id">${esc(e.vehicle_number)}</b></td>`,
			`<td data-label="${__("Water Supplier")}">${esc(e.water_supplier)}</td>`,
			`<td data-label="${__("Tank Level")}">${levelPill(e.tank_level_check)}</td>`,
			`<td data-label="${__("Photo")}">${this.photoCell(e)}</td>`,
		];
		if (full) {
			cells.push(`<td data-label="${__("GPS Location")}">${this.locationCell(e)}</td>`);
			const edit = frappe.model.can_write("Water Tanker Entry") ?`<button type="button" data-row-edit="${esc(e.name)}" title="${__("Edit")}" aria-label="${__("Edit")}">${ICONS.edit}</button>` : "";
			const del = frappe.model.can_delete("Water Tanker Entry") ? `<button type="button" class="danger" data-row-del="${esc(e.name)}" title="${__("Delete")}" aria-label="${__("Delete")}">${ICONS.trash}</button>` : "";
			const dl = `<button type="button" data-row-dl="${esc(e.name)}" title="${__("Download Image")}" aria-label="${__("Download Image")}">${ICONS.download}</button>`;
			cells.push(`<td data-label="${__("Actions")}"><div class="wt-act">${edit}${del}${dl}</div></td>`);
		}
		return `<tr data-name="${esc(e.name)}">${cells.join("")}</tr>`;
	}

	// ---- register -----------------------------------------------------------------------------------------

	async loadRegister(reset) {
		const start = reset ? 0 : this.registerRows.length;
		let data;
		try {
			data = await this.call("list_entries", { ...this.filter, start });
		} catch (e) {
			return;
		}
		this.registerRows = reset ? data.rows : this.registerRows.concat(data.rows);
		this.rows = this.mergeRows(this.rows, data.rows);
		this.total = data.total;
		const body = this.$("[data-register]");
		body.html(
			this.registerRows.length
				? this.registerRows.map((e) => this.entryRow(e, true)).join("")
				: `<tr><td class="wt-empty" colspan="7">${__("No water tanker entries found")}</td></tr>`
		);
		this.$(".wt-count").text(this.registerRows.length ? __("Showing {0} of {1}", [this.registerRows.length, data.total]) : "");
		this.$(".wt-load-more").prop("hidden", this.registerRows.length >= data.total);
	}

	get registerRows() {
		return this._registerRows || [];
	}

	set registerRows(rows) {
		this._registerRows = rows;
	}

	// ---- new entry ----------------------------------------------------------------------------------------

	newEntry() {
		this.cap = { tanker: null, level: null };
		this.ref = uuid();
		this.saved = null;
		this.$('[data-pane="entry"]').html(this.entryHtml());
		this.fillLists();
		this.open("entry");
		this.paintShots();
	}

	/** The form follows the supplied preview: stepper, three sections in a three-column grid, two photo boxes. */
	entryHtml() {
		const field = (label, name, extra = "", cls = "", hint = "") =>
			`<label class="wt-field ${cls}"><span class="wt-lbl">${label}</span><input data-f="${name}" autocomplete="off" ${extra}>${hint ? `<span class="wt-hint">${hint}</span>` : ""}</label>`;
		const req = ` <span class="wt-req">*</span>`;
		const upload = (kind, title, required, button, help) => `
			<div class="wt-upload" data-kind="${kind}">
				<strong>${ICONS.camera} ${title}${required ? req : ` <span style="color:var(--wt-muted);font-weight:500">(${__("Optional")})</span>`}</strong>
				<div class="wt-shot-empty"><button type="button" class="wt-btn-primary" data-capture="${kind}">${ICONS.camera}${button}</button></div>
				<div class="wt-shot-full" hidden>
					<img class="wt-shot-img" alt="">
					<div class="wt-shot-meta"></div>
					<div class="wt-shot-btns"><button type="button" class="wt-btn-ghost wt-btn-sm" data-capture="${kind}">${ICONS.camera}${__("Retake")}</button></div>
				</div>
			</div>`;
		// the optional photo: just a button until one is taken, then the same kind of tile as the required one
		const optional = (kind, title, button, help) => `
			<div class="wt-upload wt-optional" data-kind="${kind}">
				<div class="wt-shot-empty">
					<button type="button" class="wt-btn-ghost" data-capture="${kind}">${ICONS.plus}${button}</button>
				</div>
				<div class="wt-shot-full" hidden>
					<strong>${ICONS.camera} ${title} <span style="color:var(--wt-muted);font-weight:500">(${__("Optional")})</span></strong>
					<img class="wt-shot-img" alt="" style="margin-top:10px">
					<div class="wt-shot-meta"></div>
					<div class="wt-shot-btns"><button type="button" class="wt-btn-ghost wt-btn-sm" data-capture="${kind}">${ICONS.camera}${__("Retake")}</button><button type="button" class="wt-btn-ghost wt-btn-sm" data-remove="${kind}">${__("Remove")}</button></div>
				</div>
			</div>`;
		const ev = (label, cls) => `<div><div class="wt-label">${label}</div><div class="wt-ev-v ${cls}">—</div></div>`;
		return `
			<div class="wt-pagehead"><div><h2 class="wt-title">${__("New Water Tanker Entry")}</h2></div>
				<button type="button" class="wt-btn-ghost wt-back">${__("Back to List")}</button></div>
			<div class="wt-card wt-panel wt-entry">
				<div class="wt-section-head">${__("Arrival Details")}</div>
				<div class="wt-grid3">
					${field(__("Arrival Date & Time") + req, "arrival", `type="datetime-local" value="${localDateTime()}" max="${localDateTime()}"`)}
					<label class="wt-field"><span class="wt-lbl">${__("Tanker") + req}</span><select data-f="tanker">
						<option value="">${__("Select tanker")}</option>
						<option value="RGI Group">${__("RGI Group")}</option>
						<option value="Rented">${__("Rented")}</option>
					</select></label>
					${field(__("Vehicle / Water Tanker Number") + req, "vehicle_number", 'list="wt-vehicles" autocapitalize="characters"')}
					${field(__("Water Supplier Name") + req, "water_supplier", `list="wt-suppliers"`)}
					${field(__("Driver Name (Optional)"), "driver_name", ``)}
					${field(__("Expected Quantity (Optional)"), "expected_quantity", 'type="number" inputmode="decimal" min="0" step="any"')}
				</div>
				<datalist id="wt-vehicles"></datalist><datalist id="wt-suppliers"></datalist>

				<div class="wt-section-head">${__("Physical Inspection")}</div>
				<div class="wt-grid3">
					<label class="wt-field"><span class="wt-lbl">${__("Tank Level Check") + req}</span><select data-f="tank_level_check">
						<option value="">${__("Select status")}</option>
						<option value="Full">${__("Full Water Tanker")}</option>
						<option value="Partial">${__("Partially Filled")}</option>
						<option value="Not Checked">${__("Not Checked")}</option>
					</select></label>
					${field(__("Checked By (Optional)"), "checked_by", `value="${esc(this.boot.user || frappe.session.user_fullname || "")}"`)}
					${field(__("Observed Quantity (Optional)"), "observed_quantity", `type="number" inputmode="decimal" min="0" step="any"`)}
					<label class="wt-field full">${__("Inspection Remarks (Optional)")}<textarea data-f="inspection_remarks" rows="3"></textarea></label>
				</div>

				<div class="wt-section-head">${__("Photo Evidence")}</div>
				<div class="wt-uploads">
					${upload("tanker", __("Water Tanker / Vehicle Photo"), true, __("Capture Water Tanker Photo"), __("Taken with the phone camera. Date, time and location are added automatically."))}
					${optional("level", __("Top / Level Photo"), __("Add Tank Level Photo (optional)"), __("If safe, attach level evidence from a permitted inspection position."))}
				</div>
				<div class="wt-ev" style="margin-top:16px">
					${ev(__("Capture Date & Time"), "wt-ev-time")}${ev(__("GPS Location"), "wt-ev-loc")}
				</div>
				<div class="wt-grid3" style="margin-top:14px">
					<label class="wt-field full">${__("Location Address")}<textarea data-f="location_address" rows="2"></textarea></label>
				</div>

				<div class="wt-actions" style="margin-top:22px">
					<button type="button" class="wt-btn-primary wt-save">✓ ${__("Save Water Tanker Entry")}</button>
					<button type="button" class="wt-btn-ghost wt-clear">${__("Clear Form")}</button>
				</div>
			</div>`;
	}

	vehicleChanged() {
		const typed = normVehicle(this.$('[data-f="vehicle_number"]').val());
		const known = this.boot.vehicles.find((v) => v.name === typed);
		const supplier = this.$('[data-f="water_supplier"]');
		// a known tanker brings its supplier along
		if (known && known.water_supplier && (!supplier.val() || supplier.attr("data-auto"))) supplier.val(known.water_supplier).attr("data-auto", "1");
	}

	paintShots() {
		["tanker", "level"].forEach((kind) => {
			const tile = this.$(`.wt-upload[data-kind="${kind}"]`);
			const c = this.cap[kind];
			tile.toggleClass("has-shot", !!c);
			tile.find(".wt-shot-empty").prop("hidden", !!c);
			tile.find(".wt-shot-full").prop("hidden", !c);
			if (c) {
				tile.find(".wt-shot-img").attr("src", c.previewUrl);
				tile.find(".wt-shot-meta").html(
					`${esc(fmtStamp(c.capturedLocal))}<br>${c.lat != null ? `${esc(coordText(c.lat, c.lng))} · ±${Math.round(c.accuracy || 0)} m` : __("Location not available")}`
				);
			}
		});
		const t = this.cap.tanker;
		this.$(".wt-ev-time").text(t ? fmtStamp(t.capturedLocal) : "—");
		this.$(".wt-ev-loc").text(t && t.lat != null ? coordText(t.lat, t.lng) : "—");
	}

	async capture(kind) {
		if (this.camera || this.saving) return;
		const shot = await this.openCamera(kind);
		if (!shot) return;
		this.cap[kind] = shot;
		this.paintShots();
		if (kind === "tanker" && shot.lat != null) this.fillAddress(shot);
	}

	/** An address for the place, looked up from the real coordinates; left empty if the lookup fails. */
	async fillAddress(shot) {
		const box = this.$('[data-f="location_address"]');
		if (box.val()) return;
		try {
			const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${shot.lat}&lon=${shot.lng}&zoom=18`, { headers: { Accept: "application/json" } });
			const place = await response.json();
			if (place && place.display_name && this.cap.tanker === shot && !box.val()) box.val(place.display_name);
		} catch (e) {
			/* no address; the coordinates and the map link are still recorded */
		}
	}

	clearForm() {
		const touched = this.cap.tanker || this.cap.level || ["vehicle_number", "water_supplier", "driver_name", "expected_quantity", "observed_quantity", "inspection_remarks", "tank_level_check"].some((f) => this.$(`[data-f="${f}"]`).val());
		const reset = () => this.newEntry();
		if (touched) this.confirm(__("Clear everything on this form, including the photos?"), reset);
		else reset();
	}

	async uploadBlob(blob, name) {
		const form = new FormData();
		form.append("file", blob, name);
		form.append("is_private", "1");
		form.append("folder", "Home/Attachments");
		const response = await fetch("/api/method/upload_file", { method: "POST", headers: { "X-Frappe-CSRF-Token": frappe.csrf_token, Accept: "application/json" }, body: form });
		const result = await response.json().catch(() => null);
		if (!response.ok || !result || !result.message) throw new Error("upload failed");
		return result.message.file_url;
	}

	/** Upload what has not been uploaded yet; the urls are kept so a retry never uploads a photo twice. */
	async uploadShot(shot, label, tag = this.ref.slice(0, 8)) {
		if (!shot.urls) shot.urls = {};
		if (!shot.urls.original) shot.urls.original = await this.uploadBlob(shot.original, `${label}_${tag}_original.jpg`);
		if (!shot.urls.stamped) shot.urls.stamped = await this.uploadBlob(shot.stamped, `${label}_${tag}_stamped.jpg`);
		return shot.urls;
	}

	async save() {
		if (this.saving) return;
		const v = (f) => String(this.$(`[data-f="${f}"]`).val() || "").trim();
		if (!v("vehicle_number")) return this.warn(__("Vehicle / Water Tanker Number is required"));
		if (!v("water_supplier")) return this.warn(__("Water Supplier Name is required"));
		if (!v("arrival")) return this.warn(__("Arrival Date & Time is required"));
		const arrival = new Date(v("arrival"));
		if (isNaN(arrival.getTime())) return this.warn(__("Arrival Date & Time is not valid"));
		if (!v("tanker")) return this.warn(__("Select the Tanker (RGI Group or Rented)"));
		if (!v("tank_level_check")) return this.warn(__("Select the Tank Level Check"));
		const tanker = this.cap.tanker;
		if (!tanker) return this.warn(__("Capture the water tanker photo first"));
		if (tanker.lat == null) return this.warn(__("The water tanker photo has no GPS location. Allow location access and retake the photo."));

		const button = this.$(".wt-save");
		this.saving = true;
		button.prop("disabled", true).text(__("Saving…"));
		try {
			const t = await this.uploadShot(tanker, "tanker");
			const level = this.cap.level;
			const l = level ? await this.uploadShot(level, "tank_level") : null;
			const result = await this.call("save_entry", {
				data: {
					client_ref: this.ref,
					arrival_datetime: arrival.toISOString(),
					tanker: v("tanker"),
					vehicle_number: v("vehicle_number"),
					water_supplier: v("water_supplier"),
					driver_name: v("driver_name"),
					expected_quantity: v("expected_quantity"),
					tank_level_check: v("tank_level_check"),
					checked_by: v("checked_by"),
					observed_quantity: v("observed_quantity"),
					inspection_remarks: this.$('[data-f="inspection_remarks"]').val(),
					location_address: this.$('[data-f="location_address"]').val(),
					tanker_photo: t.original,
					tanker_photo_stamped: t.stamped,
					photo_capture_datetime: tanker.capturedAt,
					latitude: tanker.lat,
					longitude: tanker.lng,
					gps_accuracy: tanker.accuracy,
					tank_level_photo: l ? l.original : "",
					tank_level_photo_stamped: l ? l.stamped : "",
					tank_level_photo_datetime: level ? level.capturedAt : "",
				},
			});
			this.showSaved(result);
			this.loadBoot();
		} catch (e) {
			this.warn(__("The entry was not saved. Your photos are kept: check the connection and tap Save Water Tanker Entry again. The same entry is never saved twice."));
			button.prop("disabled", false).text(`✓ ${__("Save Water Tanker Entry")}`);
		} finally {
			this.saving = false;
		}
	}

	showSaved(entry) {
		this.saved = entry;
		this.rows = this.mergeRows(this.rows, [entry]);
		const photo = entry.tanker_photo_stamped || entry.tanker_photo;
		this.$('[data-pane="entry"]').html(`
			<div class="wt-card wt-done">
				<div class="wt-done-ic">✓</div>
				<h3>${entry.duplicate ? __("This entry was already saved") : __("Entry saved")}</h3>
				<p><b>${esc(entry.name)}</b> · ${esc(entry.vehicle_number)} · ${esc(entry.water_supplier)}<br>${esc(fmtDT(entry.arrival_datetime))} · ${esc(entry.tank_level_check)}</p>
				<div class="wt-actions">
					${SHOW_WHATSAPP ? `<button type="button" class="wt-btn-primary wt-btn-wa wt-share-saved">${ICONS.chat}${__("Share on WhatsApp")}</button>` : ""}
					${photo ? `<a class="wt-btn-ghost" href="${esc(photo)}" download>${ICONS.download}${__("Download photo")}</a>` : ""}
					<button type="button" class="wt-btn-ghost wt-view-saved" data-name="${esc(entry.name)}">${__("View entry")}</button>
					<button type="button" class="wt-btn-ghost wt-new">${ICONS.plus}${__("New Water Tanker Entry")}</button>
				</div>
			</div>`);
	}

	// ---- report: on screen, Excel, PDF, print ---------------------------------------------------------------

	reportHtml() {
		const stat = (key, icon, tone, label) =>
			`<div class="wt-stat"><div class="wt-stat-ic ${tone}">${icon}</div><div class="wt-stat-n" data-rp-stat="${key}">–</div><div class="wt-stat-l">${label}</div></div>`;
		return `
			<div class="wt-pagehead"><div><h2 class="wt-title">${__("Water Tanker Report")}</h2></div>
				<div class="wt-rep-actions">
					<button type="button" class="wt-btn-ghost wt-btn-sm wt-rp-excel">${ICONS.download}${__("Excel")}</button>
					<button type="button" class="wt-btn-ghost wt-btn-sm wt-rp-pdf">${ICONS.file}${__("PDF")}</button>
					<button type="button" class="wt-btn-primary wt-btn-sm wt-rp-print">${ICONS.printer}${__("Print")}</button>
				</div></div>
			<div class="wt-card wt-toolbar-card"><div class="wt-toolbar">
				<label class="wt-field">${__("Search")}<input class="wt-rp-search"></label>
				<label class="wt-field">${__("Water Supplier")}<select class="wt-rp-sup"><option value="">${__("All suppliers")}</option></select></label>
				<label class="wt-field">${__("Tank Level")}<select class="wt-rp-level">
					<option value="">${__("All level statuses")}</option>
					<option value="Full">${__("Full")}</option>
					<option value="Partial / Low">${__("Partial")}</option>
					<option value="Not Checked">${__("Not Checked")}</option>
				</select></label>
				<label class="wt-field">${__("From date")}<input type="date" class="wt-rp-from"></label>
				<label class="wt-field">${__("To date")}<input type="date" class="wt-rp-to"></label>
				<button type="button" class="wt-btn-ghost wt-rp-clear">${__("Reset")}</button>
			</div></div>
			<div class="wt-stats wt-rep-stats">
				${stat("total", ICONS.truck, "", __("Total Entries"))}
				${stat("Full", ICONS.drop, "teal", __("Full Water Tankers"))}
				${stat("Partial", ICONS.alert, "amber", __("Partial Level Water Tankers"))}
			</div>
			<div class="wt-table-wrap"><table class="wt-table"><thead><tr><th>${__("Date & Time")}</th><th>${__("Vehicle")}</th><th>${__("Water Supplier")}</th><th>${__("Driver")}</th><th>${__("Tank Level")}</th><th>${__("Expected")}</th><th>${__("Observed")}</th><th>${__("Checked By")}</th><th>${__("Remarks")}</th><th>${__("GPS Location")}</th><th>${__("Photos")}</th></tr></thead>
				<tbody data-report></tbody><tfoot data-report-foot></tfoot></table></div>
			<p class="wt-tiny wt-rp-note" style="margin:10px 0 0" hidden></p>`;
	}

	syncReportFilters() {
		this.$(".wt-rp-search").val(this.rep.search);
		this.$(".wt-rp-sup").val(this.rep.supplier);
		this.$(".wt-rp-level").val(this.rep.level);
		this.$(".wt-rp-from").val(this.rep.from_date);
		this.$(".wt-rp-to").val(this.rep.to_date);
		this.coupleDates(".wt-rp-from", ".wt-rp-to");
	}

	readReportFilters() {
		this.rep = {
			search: String(this.$(".wt-rp-search").val() || ""),
			supplier: String(this.$(".wt-rp-sup").val() || ""),
			level: String(this.$(".wt-rp-level").val() || ""),
			from_date: String(this.$(".wt-rp-from").val() || ""),
			to_date: String(this.$(".wt-rp-to").val() || ""),
		};
	}

	async loadReport() {
		let data;
		try {
			data = await this.call("report", { ...this.rep });
		} catch (e) {
			return;
		}
		this.report = data;
		const rows = data.rows || [];
		const sum = data.summary || { total: 0, levels: {}, expected: 0, observed: 0 };
		const qty = (v) => (v == null || v === "" ? "—" : Number(v).toLocaleString("en-IN"));
		this.$('[data-rp-stat="total"]').text(sum.total);
		const lv = sum.levels || {};
		this.$('[data-rp-stat="Full"]').text(lv.Full || 0);
		this.$('[data-rp-stat="Partial"]').text((lv.Partial || 0) + (lv.Low || 0)); // partial level = partial and low
		this.$("[data-report]").html(
			rows.length
				? rows
						.map(
							(r) => `<tr>
								<td class="wt-num">${esc(fmtDT(r.arrival_datetime))}</td><td><b>${esc(r.vehicle_number)}</b></td><td>${esc(r.water_supplier)}</td><td>${esc(r.driver_name || "—")}</td>
								<td>${levelPill(r.tank_level_check)}</td><td class="wt-num">${qty(r.expected_quantity)}</td><td class="wt-num">${qty(r.observed_quantity)}</td>
								<td>${esc(r.checked_by || "—")}</td><td class="wt-wrap">${esc(r.inspection_remarks || "—")}</td><td>${this.locationCell(r)}</td><td>${this.photosCell(r)}</td></tr>`
						)
						.join("")
				: `<tr><td class="wt-empty" colspan="11">${__("No water tanker entries in this selection")}</td></tr>`
		);
		this.$("[data-report-foot]").html(
			rows.length
				? `<tr style="background:var(--wt-primary-soft);font-weight:700"><td colspan="5">${__("Total")} (${sum.total}) · ${__("Full")}: ${lv.Full || 0} · ${__("Partial")}: ${(lv.Partial || 0) + (lv.Low || 0)} · ${__("Not Checked")}: ${lv["Not Checked"] || 0}</td>
					<td class="wt-num">${qty(sum.expected)}</td><td class="wt-num">${qty(sum.observed)}</td><td colspan="4"></td></tr>`
				: ""
		);
		this.$(".wt-rp-note").prop("hidden", !data.truncated).text(__("Only the first {0} entries are shown. Narrow the dates to see the rest.", [5000]));
	}

	/** Excel and PDF come from the server, made from the filters on screen; the file is saved by the browser. */
	async downloadReport(method, label) {
		this.readReportFilters();
		const body = new URLSearchParams({ ...this.rep });
		frappe.show_alert({ message: __("Preparing the {0} file…", [label]), indicator: "blue" }, 4);
		try {
			const response = await fetch(`/api/method/${API}${method}`, {
				method: "POST",
				headers: { "X-Frappe-CSRF-Token": frappe.csrf_token, "Content-Type": "application/x-www-form-urlencoded", Accept: "*/*" },
				body,
			});
			if (!response.ok) throw new Error("download failed");
			const blob = await response.blob();
			const disposition = response.headers.get("Content-Disposition") || "";
			const named = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = named ? decodeURIComponent(named[1]) : `water-tanker-report.${method === "export_pdf" ? "pdf" : "xlsx"}`;
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.setTimeout(() => URL.revokeObjectURL(link.href), 4000);
		} catch (e) {
			this.warn(__("The {0} file could not be created. Check the connection and try again.", [label]));
		}
	}

	/** Opens the printable page in a new tab and starts the print dialog (which can also save it as a PDF). */
	async printReport() {
		this.readReportFilters();
		const win = window.open("", "_blank"); // opened straight from the click so the browser does not block it
		if (!win) return this.warn(__("Allow pop-ups for this site to print the report."));
		win.document.write(`<p style="font-family:Arial;color:#555;padding:20px">${__("Preparing the report…")}</p>`);
		try {
			const data = await this.call("print_report", { ...this.rep });
			win.document.open();
			win.document.write(data.html);
			win.document.close();
			win.focus();
			window.setTimeout(() => win.print(), 400);
		} catch (e) {
			win.close();
		}
	}

	// ---- settings: the masters ----------------------------------------------------------------------------

	masterDoctype(kind) {
		return kind === "suppliers" ? "Water Supplier" : "Water Tanker Vehicle";
	}

	/** Role Permission Manager decides who may add, change or delete masters. */
	can(kind, action) {
		const check = { create: frappe.model.can_create, write: frappe.model.can_write, delete: frappe.model.can_delete }[action];
		return !!check && check.call(frappe.model, this.masterDoctype(kind));
	}

	masterHtml(kind) {
		const suppliers = kind === "suppliers";
		return `
			<div class="wt-pagehead"><div><h2 class="wt-title">${suppliers ? __("Water Suppliers") : __("Water Tanker Vehicles")}</h2></div>
				<div class="wt-rep-actions">
					<input class="wt-search wt-master-search" placeholder="${__("Search…")}" style="min-width:200px">
					<button type="button" class="wt-btn-primary wt-btn-sm wt-master-add" data-add="${kind}">${ICONS.plus}${suppliers ? __("Add Supplier") : __("Add Water Tanker")}</button>
				</div></div>
			<div class="wt-table-wrap"><table class="wt-table wt-mtable"><thead><tr>${
				suppliers
					? `<th>${__("Water Supplier Name")}</th><th>${__("Contact Number")}</th><th>${__("Address")}</th><th>${__("Status")}</th><th></th>`
					: `<th>${__("Vehicle Number")}</th><th>${__("Water Supplier")}</th><th>${__("Water Tanker Capacity")}</th><th>${__("Capacity UOM")}</th><th></th>`
			}</tr></thead><tbody data-master="${kind}"></tbody></table></div>`;
	}

	masterActions(kind, key) {
		const edit = this.can(kind, "write") ? `<button type="button" data-edit="${kind}" data-key="${esc(key)}" title="${__("Edit")}" aria-label="${__("Edit")}">${ICONS.edit}</button>` : "";
		const del = this.can(kind, "delete") ? `<button type="button" class="danger" data-del="${kind}" data-key="${esc(key)}" title="${__("Delete")}" aria-label="${__("Delete")}">${ICONS.trash}</button>` : "";
		return `<div class="wt-act">${edit}${del}</div>`;
	}

	async loadMaster(kind) {
		let rows;
		try {
			rows = await this.call(kind === "suppliers" ? "list_suppliers" : "list_vehicles");
		} catch (e) {
			return;
		}
		this.masters[kind] = rows || [];
		this.$(`.wt-master-add[data-add="${kind}"]`).toggle(this.can(kind, "create"));
		this.$(`[data-master="${kind}"]`).html(
			this.masters[kind].length
				? this.masters[kind]
						.map((r) =>
							kind === "suppliers"
								? `<tr><td class="wt-first"><b>${esc(r.supplier_name)}</b></td><td class="wt-num">${esc(r.contact_number || "—")}</td><td class="wt-wrap">${esc(r.address || "—")}</td><td>${r.disabled ? pill(__("Disabled"), "red") : pill(__("Active"), "teal")}</td><td>${this.masterActions(kind, r.name)}</td></tr>`
								: `<tr><td class="wt-first"><b class="wt-id">${esc(r.vehicle_number)}</b></td><td>${esc(r.water_supplier || "—")}</td><td class="wt-num">${r.tanker_capacity ? esc(Number(r.tanker_capacity).toLocaleString("en-IN")) : "—"}</td><td>${esc(r.capacity_uom || "—")}</td><td>${this.masterActions(kind, r.name)}</td></tr>`
						)
						.join("")
				: `<tr><td class="wt-empty" colspan="5">${kind === "suppliers" ? __("No water suppliers yet") : __("No water tankers yet")}</td></tr>`
		);
		this.$(`[data-pane="${kind}"] .wt-master-search`).trigger("input");
	}

	async masterForm(kind, key) {
		const suppliers = kind === "suppliers";
		const row = key ? (this.masters[kind] || []).find((r) => r.name === key) || {} : {};
		const f = (label, name, value, extra = "") => `<label class="wt-field"><span class="wt-lbl">${label}</span><input data-m="${name}" value="${esc(value == null ? "" : value)}" autocomplete="off" ${extra}></label>`;
		let body;
		if (suppliers) {
			body = `<div class="wt-form">
				${f(__("Water Supplier Name") + ` <span class="wt-req">*</span>`, "supplier_name", row.supplier_name, key ? "readonly" : "")}
				${f(__("Contact Number"), "contact_number", row.contact_number, 'inputmode="tel"')}
				<label class="wt-field wide">${__("Address")}<textarea data-m="address" rows="3">${esc(row.address || "")}</textarea></label>
				<label class="wt-check wide"><input type="checkbox" data-m="disabled" ${row.disabled ? "checked" : ""}> ${__("Disabled")}</label></div>`;
		} else {
			if (this.masters.uoms == null) {
				try {
					this.masters.uoms = (await this.call("list_uoms")) || [];
				} catch (e) {
					this.masters.uoms = [];
				}
			}
			const supplierNames = this.boot.suppliers.map((s) => s.name);
			body = `<div class="wt-form">
				${f(__("Vehicle Number") + ` <span class="wt-req">*</span>`, "vehicle_number", row.vehicle_number, key ? "readonly" : 'autocapitalize="characters"')}
				${f(__("Water Supplier"), "water_supplier", row.water_supplier, 'list="wt-m-suppliers"')}
				${f(__("Water Tanker Capacity"), "tanker_capacity", row.tanker_capacity || "", 'type="number" inputmode="decimal" min="0" step="any"')}
				${f(__("Capacity UOM"), "capacity_uom", row.capacity_uom, 'list="wt-m-uoms"')}
				<datalist id="wt-m-suppliers">${supplierNames.map((n) => `<option value="${esc(n)}"></option>`).join("")}</datalist>
				<datalist id="wt-m-uoms">${this.masters.uoms.map((n) => `<option value="${esc(n)}"></option>`).join("")}</datalist></div>`;
		}
		const title = key ? (suppliers ? __("Edit Water Supplier") : __("Edit Water Tanker")) : suppliers ? __("Add Water Supplier") : __("Add Water Tanker");
		const node = this.modal(title, body, `<button type="button" class="wt-btn-primary wt-m-save">${__("Save")}</button><button type="button" class="wt-btn-ghost wt-close">${__("Cancel")}</button>`);
		node.on("click", ".wt-m-save", async (e) => {
			const button = $(e.currentTarget).prop("disabled", true);
			const data = { name: key || "" };
			node.find("[data-m]").each((_, el) => {
				const input = $(el);
				data[input.data("m")] = input.is(":checkbox") ? (input.is(":checked") ? 1 : 0) : input.val();
			});
			if (suppliers && !String(data.supplier_name || "").trim()) {
				button.prop("disabled", false);
				return this.warn(__("Water Supplier Name is required"));
			}
			if (!suppliers && !String(data.vehicle_number || "").trim()) {
				button.prop("disabled", false);
				return this.warn(__("Vehicle Number is required"));
			}
			try {
				await this.call(suppliers ? "save_supplier" : "save_vehicle", { data });
			} catch (err) {
				button.prop("disabled", false); // frappe has already shown the reason
				return;
			}
			node.remove();
			frappe.show_alert({ message: __("Saved"), indicator: "green" }, 3);
			this.loadMaster(kind);
			this.loadBoot();
		});
	}

	masterDelete(kind, key) {
		this.confirm(__("Delete {0}? This cannot be undone.", [key]), async () => {
			try {
				await this.call(kind === "suppliers" ? "delete_supplier" : "delete_vehicle", { name: key });
			} catch (e) {
				return;
			}
			this.loadMaster(kind);
			this.loadBoot();
		});
	}

	// ---- one entry ------------------------------------------------------------------------------------------

	/** A question in this page's own look (Yes in the theme colour), used instead of Frappe's black-buttoned dialog. */
	confirm(message, onYes, onNo) {
		const node = $(`<div class="wt-modal-back wt-confirm-back"><div class="wt-modal wt-confirm" role="alertdialog">
			<div class="wt-modal-head"><b>${__("Confirm")}</b><button type="button" class="wt-x" aria-label="${__("Close")}">✕</button></div>
			<p class="wt-confirm-text">${esc(message)}</p>
			<div class="wt-modal-foot" style="justify-content:flex-end"><button type="button" class="wt-btn-ghost wt-btn-sm wt-confirm-no">${__("No")}</button><button type="button" class="wt-btn-primary wt-btn-sm wt-confirm-yes">${__("Yes")}</button></div>
		</div></div>`);
		this.$(".wt-app").append(node);
		const no = () => {
			node.remove();
			if (onNo) onNo();
		};
		node.on("click", ".wt-confirm-no, .wt-x", no);
		node.on("click", (e) => {
			if ($(e.target).hasClass("wt-modal-back")) no();
		});
		node.on("click", ".wt-confirm-yes", () => {
			node.remove();
			if (onYes) onYes();
		});
		node.find(".wt-confirm-yes").trigger("focus");
		return node;
	}

	modal(title, body, foot, cls = "") {
		const node = $(`<div class="wt-modal-back"><div class="wt-modal ${cls}">
			<div class="wt-modal-head"><b>${title}</b><button type="button" class="wt-x" aria-label="${__("Close")}">✕</button></div>
			<div class="wt-modal-body">${body}</div>
			<div class="wt-modal-foot">${foot}</div>
		</div></div>`);
		this.$(".wt-app").append(node);
		node.on("click", ".wt-x, .wt-close", () => node.remove());
		node.on("click", (e) => {
			if ($(e.target).hasClass("wt-modal-back")) node.remove();
		});
		return node;
	}

	fact(label, value, wide = false) {
		const empty = value == null || value === "" || value === "—";
		return `<div class="${wide ? "wt-fact-wide" : ""}"><div class="wt-label">${label}</div><div class="wt-fact-v ${empty ? "mute" : ""}">${empty ? "—" : value}</div></div>`;
	}

	async detail(name, edit = false) {
		let e;
		try {
			e = await this.call("get_entry", { name });
		} catch (err) {
			return;
		}
		this.rows = this.mergeRows(this.rows, [e]);
		const photo = (url, original, label, when) =>
			url ? `<div><a href="${esc(original || url)}" target="_blank" rel="noopener"><img src="${esc(url)}" alt="${esc(label)}"></a><small>${esc(label)}${when ? " · " + esc(fmtDT(when, true)) : ""}</small></div>` : "";
		const photos = photo(e.tanker_photo_stamped || e.tanker_photo, e.tanker_photo, __("Water Tanker photo"), e.photo_capture_datetime) + photo(e.tank_level_photo_stamped || e.tank_level_photo, e.tank_level_photo, __("Tank level photo"), e.tank_level_photo_datetime);
		const body = `
			<div class="wt-facts">
				${this.fact(__("Arrival Date & Time"), esc(fmtDT(e.arrival_datetime, true)))}
				${this.fact(__("Tanker"), esc(e.tanker))}
				${this.fact(__("Vehicle / Water Tanker Number"), `<b>${esc(e.vehicle_number)}</b>`)}
				${this.fact(__("Water Supplier"), esc(e.water_supplier))}
				${this.fact(__("Driver Name"), esc(e.driver_name))}
				${this.fact(__("Expected Quantity"), e.expected_quantity == null ? "" : esc(e.expected_quantity))}
			</div>
			<div class="wt-sec">${__("Physical Inspection")}</div>
			<div class="wt-facts">
				${this.fact(__("Tank Level Check"), levelPill(e.tank_level_check))}
				${this.fact(__("Checked By"), esc(e.checked_by))}
				${this.fact(__("Observed Quantity"), e.observed_quantity == null ? "" : esc(e.observed_quantity))}
				${this.fact(__("Inspection Remarks"), esc(e.inspection_remarks).replace(/\n/g, "<br>"), true)}
			</div>
			<div class="wt-sec">${__("Photo Evidence")}</div>
			<div class="wt-photos">${photos || `<span class="wt-nophoto">${__("No photo")}</span>`}</div>
			<div class="wt-sec">${__("Capture & Location")}</div>
			<div class="wt-facts">
				${this.fact(__("Photo Capture Time"), esc(fmtDT(e.photo_capture_datetime, true)))}
				${this.fact(__("GPS Latitude / Longitude"), hasPoint(e) ? `<a class="wt-maplink" href="${esc(mapUrl(e.latitude, e.longitude))}" target="_blank" rel="noopener">${esc(coordText(e.latitude, e.longitude))}</a>` : "")}
				${this.fact(__("GPS Accuracy"), e.gps_accuracy == null ? "" : `±${Math.round(e.gps_accuracy)} m`)}
				${this.fact(__("Location Address"), esc(e.location_address), true)}
			</div>
			<div class="wt-sec">${__("Record")}</div>
			<div class="wt-facts">
				${this.fact(__("Entry"), esc(e.name))}
				${this.fact(__("Created By"), esc(e.created_by))}
			</div>`;
		// edit is whatever Role Permission Manager gives the user on Water Tanker Entry
		const editable = !!e.can_write;
		// delete is whatever Role Permission Manager gives the user on Water Tanker Entry
		const deletable = frappe.model.can_delete("Water Tanker Entry");
		const foot = `
			${SHOW_WHATSAPP ? `<button type="button" class="wt-btn-primary wt-btn-wa wt-d-share">${ICONS.chat}${__("Share on WhatsApp")}</button>` : ""}
			<button type="button" class="wt-btn-primary wt-d-download">${__("Download Image")}</button>
			${navigator.canShare ? `<button type="button" class="wt-btn-ghost wt-d-shareimg">${__("Share Image")}</button>` : ""}
			${editable ? `<button type="button" class="wt-btn-ghost wt-d-edit">${__("Edit")}</button>` : ""}
			${deletable ? `<button type="button" class="wt-btn-ghost wt-d-delete">${__("Delete")}</button>` : ""}
			<button type="button" class="wt-btn-ghost wt-close">${__("Close")}</button>`;
		const node = this.modal(`${esc(e.name)} · ${esc(e.vehicle_number)}`, body, foot, "wide");
		node.on("click", ".wt-d-share", () => this.share(e));
		node.on("click", ".wt-d-download", (ev) => this.downloadImage(e, $(ev.currentTarget)));
		node.on("click", ".wt-d-shareimg", (ev) => this.shareImage(e, $(ev.currentTarget)));
		node.on("click", ".wt-d-edit", () => this.editInspection(node, e));
		if (edit && editable) this.editInspection(node, e);
		node.on("click", ".wt-d-delete", () => {
			node.hide();
			this.deleteEntry(e.name, () => node.remove(), () => node.show());
		});
	}

	deleteEntry(name, onDone, onCancel) {
		this.confirm(
			__("Delete {0}? Its photos are deleted too. This cannot be undone.", [name]),
			async () => {
				try {
					await frappe.xcall("frappe.client.delete", { doctype: "Water Tanker Entry", name });
				} catch (err) {
					if (onCancel) onCancel();
					return;
				}
				if (onDone) onDone();
				frappe.show_alert({ message: __("{0} deleted", [name]), indicator: "green" }, 4);
				this.afterChange(name, false);
			},
			onCancel
		);
	}

	editInspection(node, e) {
		let level = e.tank_level_check || "Not Checked";
		const retaken = {}; // kind -> a photo taken again in this edit, saved with the rest
		const f = (label, name, value, extra = "") => `<label class="wt-field">${label}<input data-e="${name}" value="${esc(value == null ? "" : value)}" ${extra}></label>`;
		const shotTile = (kind, label, url, when) => `<div class="wt-e-shot" data-kind="${kind}">
				<div class="wt-label">${label}</div>
				${url ? `<img src="${esc(url)}" alt="${esc(label)}">` : `<div class="wt-e-noshot">${__("No photo")}</div>`}
				<small class="wt-e-shot-meta">${when ? esc(fmtDT(when, true)) : ""}</small>
				<button type="button" class="wt-btn-ghost wt-btn-sm wt-e-retake" data-kind="${kind}">${ICONS.camera}${url ? __("Retake Photo") : __("Take Photo")}</button>
			</div>`;
		node.find(".wt-modal-body").html(`
			<div class="wt-label">${__("Tank Level Check")}</div>
			<div class="wt-seg wt-e-seg">${LEVELS.filter((l) => l !== "Low" || level === "Low").map((l) => `<button type="button" data-level="${l}" class="${l === level ? "active" : ""}">${__(l)}</button>`).join("")}</div>
			<div class="wt-form" style="margin-top:12px">
				<label class="wt-field">${__("Tanker")}<select data-e="tanker">${["", "RGI Group", "Rented"].map((t) => `<option value="${t}" ${t === (e.tanker || "") ? "selected" : ""}>${t ? __(t) : __("Select tanker")}</option>`).join("")}</select></label>
				${f(__("Checked By"), "checked_by", e.checked_by)}
				${f(__("Observed Quantity"), "observed_quantity", e.observed_quantity, 'type="number" inputmode="decimal" min="0" step="any"')}
				${f(__("Driver Name"), "driver_name", e.driver_name)}
				${f(__("Expected Quantity"), "expected_quantity", e.expected_quantity, 'type="number" inputmode="decimal" min="0" step="any"')}
				<label class="wt-field wide">${__("Inspection Remarks")}<textarea data-e="inspection_remarks" rows="3">${esc(e.inspection_remarks || "")}</textarea></label>
				<label class="wt-field wide">${__("Location Address")}<textarea data-e="location_address" rows="2">${esc(e.location_address || "")}</textarea></label>
			</div>
			<div class="wt-sec">${__("Photo Evidence")}</div>
			<div class="wt-e-shots">
				${shotTile("tanker", __("Water Tanker Photo"), e.tanker_photo_stamped || e.tanker_photo, e.photo_capture_datetime)}
				${shotTile("level", __("Tank Level Photo"), e.tank_level_photo_stamped || e.tank_level_photo, e.tank_level_photo_datetime)}
			</div>
			<p style="color:var(--wt-muted);font-size:12px;margin:10px 0 0">${__("A retaken photo replaces the old one, with its new capture time and GPS location.")}</p>`);
		node.find(".wt-modal-foot").html(`<button type="button" class="wt-btn-primary wt-e-save">${__("Save")}</button><button type="button" class="wt-btn-ghost wt-close">${__("Cancel")}</button>`);
		node.on("click", ".wt-e-seg button", (ev) => {
			level = $(ev.currentTarget).data("level");
			node.find(".wt-e-seg button").removeClass("active");
			$(ev.currentTarget).addClass("active");
		});
		node.on("click", ".wt-e-retake", async (ev) => {
			if (this.camera) return;
			const kind = $(ev.currentTarget).data("kind");
			const shot = await this.openCamera(kind);
			if (!shot) return;
			retaken[kind] = shot;
			const tile = node.find(`.wt-e-shot[data-kind="${kind}"]`);
			tile.find("img, .wt-e-noshot").replaceWith(`<img src="${shot.previewUrl}" alt="">`);
			tile.find(".wt-e-shot-meta").text(`${fmtStamp(shot.capturedLocal)}${shot.lat != null ? " · " + coordText(shot.lat, shot.lng) : ""} · ${__("not saved yet")}`);
			if (kind === "tanker" && shot.lat != null) {
				// the photo has a new place: look its address up again
				try {
					const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${shot.lat}&lon=${shot.lng}&zoom=18`, { headers: { Accept: "application/json" } });
					const place = await response.json();
					if (place && place.display_name && retaken.tanker === shot) node.find('[data-e="location_address"]').val(place.display_name);
				} catch (err) {
					/* the address stays as it was; the coordinates are still saved */
				}
			}
		});
		node.on("click", ".wt-e-save", async (ev) => {
			const button = $(ev.currentTarget).prop("disabled", true);
			const data = { tank_level_check: level };
			node.find("[data-e]").each((_, el) => {
				data[$(el).data("e")] = $(el).val();
			});
			try {
				const tag = String(e.name).replace(/[^A-Za-z0-9-]/g, "");
				const t = retaken.tanker;
				if (t) {
					const u = await this.uploadShot(t, "tanker", tag);
					Object.assign(data, { tanker_photo: u.original, tanker_photo_stamped: u.stamped, photo_capture_datetime: t.capturedAt, latitude: t.lat, longitude: t.lng, gps_accuracy: t.accuracy });
				}
				const l = retaken.level;
				if (l) {
					const u = await this.uploadShot(l, "tank_level", tag);
					Object.assign(data, { tank_level_photo: u.original, tank_level_photo_stamped: u.stamped, tank_level_photo_datetime: l.capturedAt });
				}
			} catch (err) {
				this.warn(__("The new photo could not be uploaded. Check the connection and press Save again."));
				button.prop("disabled", false);
				return;
			}
			try {
				await this.call("update_entry", { name: e.name, data });
			} catch (err) {
				button.prop("disabled", false);
				return;
			}
			node.remove();
			this.afterChange(e.name);
			frappe.show_alert({ message: __("Saved"), indicator: "green" }, 3);
		});
	}

	afterChange(name, reopen = true) {
		if (this.tab === "dashboard") this.loadDashboard();
		if (this.tab === "register") this.loadRegister(true);
		if (this.tab === "report") this.loadReport();
		if (reopen) this.detail(name);
	}

	// ---- WhatsApp -------------------------------------------------------------------------------------------

	waText(e) {
		const lines = [
			`*${__("Water Tanker Entry")}* ${e.name || ""}`.trim(),
			`${__("Vehicle")}: ${e.vehicle_number}`,
			`${__("Water Supplier")}: ${e.water_supplier}`,
			`${__("Arrival")}: ${fmtDT(e.arrival_datetime)}`,
			`${__("Tank Level")}: ${e.tank_level_check || "Not Checked"}`,
			`${__("Photo Captured")}: ${fmtDT(e.photo_capture_datetime, true)}`,
		];
		if (hasPoint(e)) lines.push(`${__("Location")}: ${mapUrl(e.latitude, e.longitude)}`);
		if (e.inspection_remarks) lines.push(`${__("Remarks")}: ${e.inspection_remarks}`);
		return lines.join("\n");
	}

	/** Opens WhatsApp with the message ready. The photo is attached by hand: there is no automatic image sharing. */
	/** The entry as one picture (details + photos) to save or send. Drawn on a canvas, nothing leaves the browser. */
	async entryImage(e) {
		const W = 1080, P = 48, GAP = 28, colW = (W - 2 * P - GAP) / 2;
		const canvas = document.createElement("canvas");
		canvas.width = W;
		canvas.height = 6000;
		const ctx = canvas.getContext("2d");
		const font = (size, weight = 400) => `${weight} ${size}px Inter, "Segoe UI", Arial, sans-serif`;
		const load = (src) =>
			new Promise((resolve) => {
				if (!src) return resolve(null);
				const img = new Image();
				img.onload = () => resolve(img);
				img.onerror = () => resolve(null);
				img.src = src;
			});
		// splits text into lines that fit the width
		const wrap = (text, width) => {
			const lines = [];
			String(text).split("\n").forEach((para) => {
				let line = "";
				para.split(/\s+/).forEach((word) => {
					const test = line ? line + " " + word : word;
					if (ctx.measureText(test).width > width && line) {
						lines.push(line);
						line = word;
					} else line = test;
				});
				lines.push(line);
			});
			return lines;
		};

		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, W, canvas.height);
		ctx.textBaseline = "top";

		// header: logo, title, entry number
		let y = P;
		const logo = await load(WT_LOGO);
		if (logo) {
			const h = 64, w = (logo.width / logo.height) * h;
			ctx.drawImage(logo, P, y, w, h);
		}
		ctx.textAlign = "right";
		ctx.fillStyle = "#5b45e8";
		ctx.font = font(30, 700);
		ctx.fillText(__("Water Tanker Entry"), W - P, y);
		ctx.fillStyle = "#202638";
		ctx.font = font(22, 600);
		ctx.fillText(`${e.name} · ${e.vehicle_number}`, W - P, y + 42);
		ctx.textAlign = "left";
		y += 96;
		ctx.fillStyle = "#e4e7ee";
		ctx.fillRect(P, y, W - 2 * P, 2);
		y += 26;

		const section = (title) => {
			ctx.fillStyle = "#5b45e8";
			ctx.font = font(17, 700);
			ctx.fillText(title.toUpperCase(), P, y);
			y += 36;
		};
		// facts two to a row; wide ones take the full row
		const facts = (list) => {
			let col = 0, rowH = 0;
			const flush = () => {
				y += rowH + 22;
				col = 0;
				rowH = 0;
			};
			list.forEach(([label, value, wide]) => {
				if (wide && col) flush();
				const x = P + col * (colW + GAP), width = wide ? W - 2 * P : colW;
				ctx.fillStyle = "#7d879c";
				ctx.font = font(15, 600);
				ctx.fillText(label.toUpperCase(), x, y);
				ctx.fillStyle = "#202638";
				ctx.font = font(23, 600);
				const lines = wrap(value == null || value === "" ? "—" : value, width);
				lines.forEach((line, i) => ctx.fillText(line, x, y + 24 + i * 31));
				rowH = Math.max(rowH, 24 + lines.length * 31);
				if (wide || col === 1) flush();
				else col = 1;
			});
			if (col) flush();
			y += 8;
		};
		const qty = (v) => (v == null ? "" : String(v));

		section(__("Arrival Details"));
		facts([
			[__("Arrival Date & Time"), fmtDT(e.arrival_datetime, true)],
			[__("Tanker"), e.tanker],
			[__("Vehicle / Water Tanker Number"), e.vehicle_number],
			[__("Water Supplier"), e.water_supplier],
			[__("Driver Name"), e.driver_name],
			[__("Expected Quantity"), qty(e.expected_quantity)],
		]);
		section(__("Physical Inspection"));
		facts([
			[__("Tank Level Check"), e.tank_level_check],
			[__("Checked By"), e.checked_by],
			[__("Observed Quantity"), qty(e.observed_quantity)],
			[__("Inspection Remarks"), e.inspection_remarks, true],
		]);
		section(__("Capture & Location"));
		facts([
			[__("Photo Capture Time"), fmtDT(e.photo_capture_datetime, true)],
			[__("GPS Accuracy"), e.gps_accuracy == null ? "" : `±${Math.round(e.gps_accuracy)} m`],
			[__("GPS Latitude / Longitude"), hasPoint(e) ? coordText(e.latitude, e.longitude) : ""],
			[__("Location Address"), e.location_address, true],
		]);

		// photos: the stamped copies, which carry the time and GPS on the picture itself
		const shots = (await Promise.all([load(e.tanker_photo_stamped || e.tanker_photo), load(e.tank_level_photo_stamped || e.tank_level_photo)])).filter(Boolean);
		if (shots.length) {
			section(__("Photo Evidence"));
			const width = shots.length === 2 ? colW : W - 2 * P;
			let tallest = 0;
			shots.forEach((img, i) => {
				let w = width, h = (img.height / img.width) * w;
				if (h > 1100) {
					h = 1100;
					w = (img.width / img.height) * h;
				}
				ctx.drawImage(img, P + i * (colW + GAP), y, w, h);
				tallest = Math.max(tallest, h);
			});
			y += tallest + 26;
		}

		ctx.fillStyle = "#e4e7ee";
		ctx.fillRect(P, y, W - 2 * P, 2);
		y += 18;
		ctx.fillStyle = "#7d879c";
		ctx.font = font(15, 500);
		ctx.fillText(`${__("Created By")}: ${e.created_by || "—"}   ·   ${__("Generated")}: ${fmtDT(new Date().toISOString(), true)}`, P, y);
		y += 20 + P;

		const out = document.createElement("canvas");
		out.width = W;
		out.height = Math.ceil(y);
		out.getContext("2d").drawImage(canvas, 0, 0);
		const blob = await new Promise((resolve) => out.toBlob(resolve, "image/jpeg", 0.9));
		return new File([blob], `${e.name}_${normVehicle(e.vehicle_number)}.jpg`, { type: "image/jpeg" });
	}

	async downloadImage(e, button) {
		button.prop("disabled", true);
		try {
			const file = await this.entryImage(e);
			const url = URL.createObjectURL(file);
			const a = document.createElement("a");
			a.href = url;
			a.download = file.name;
			document.body.appendChild(a);
			a.click();
			a.remove();
			setTimeout(() => URL.revokeObjectURL(url), 10000);
		} catch (err) {
			this.warn(__("The image could not be made. Try again."));
		} finally {
			button.prop("disabled", false);
		}
	}

	// the device share sheet (WhatsApp, mail, ...) where the browser can send files
	async shareImage(e, button) {
		button.prop("disabled", true);
		try {
			const file = await this.entryImage(e);
			if (navigator.canShare && navigator.canShare({ files: [file] })) {
				await navigator.share({ files: [file], title: `${e.name} · ${e.vehicle_number}` });
			} else {
				this.warn(__("This browser cannot share files. Use Download Image and send the file."));
			}
		} catch (err) {
			if (err && err.name !== "AbortError") this.warn(__("The image could not be shared. Use Download Image instead."));
		} finally {
			button.prop("disabled", false);
		}
	}

	share(e) {
		window.open("https://wa.me/?text=" + encodeURIComponent(this.waText(e)), "_blank", "noopener");
	}

	// ---- camera, date/time stamp and GPS --------------------------------------------------------------------

	closeCamera() {
		if (this.camera) this.camera.close();
	}

	/**
	 * Opens the device camera and a live GPS watch together. Resolves with the photo - the untouched
	 * original, a copy with date/time/location written on it, the moment the shutter was pressed and the
	 * GPS fix - or null if cancelled. A position that is not fresh at the moment of the shutter is never
	 * used: a new one is requested instead. For the tanker photo, no GPS fix means no capture.
	 */
	openCamera(kind) {
		const required = kind === "tanker";
		const label = required ? __("Water Tanker Photo") : __("Tank Level Photo");
		return new Promise((resolve) => {
			let stream = null;
			let watchId = null;
			let fix = null;
			let facing = this.facing;
			let shot = null;
			let busy = false;
			let finished = false;

			const node = $(`<div class="wt-modal-back"><div class="wt-modal wt-cam-modal">
				<div class="wt-modal-head"><b>${esc(label)}</b><button type="button" class="wt-x" aria-label="${__("Close")}">✕</button></div>
				<div class="wt-cam-box"><video playsinline muted autoplay></video><img class="wt-cam-shot" alt="" hidden><div class="wt-cam-note">${__("Starting camera…")}</div></div>
				<div class="wt-gps" data-state="wait"></div>
				<div class="wt-modal-foot">
					<button type="button" class="wt-btn-primary wt-snap" disabled>${ICONS.camera}${__("Capture")}</button>
					<button type="button" class="wt-btn-primary wt-use" hidden>${__("Use Photo")}</button>
					<button type="button" class="wt-btn-ghost wt-retake" hidden>${__("Retake")}</button>
					<button type="button" class="wt-btn-ghost wt-cam-flip">${ICONS.flip}<span></span></button>
					<button type="button" class="wt-btn-ghost wt-cancel">${__("Cancel")}</button>
				</div>
			</div></div>`);
			this.$(".wt-app").append(node);
			const video = node.find("video")[0];
			const note = node.find(".wt-cam-note");

			const setGps = (state, html) => node.find(".wt-gps").attr("data-state", state).html(html);
			const ready = () => !!stream && !busy && !shot && (!required || !!fix);
			const refresh = () => node.find(".wt-snap").prop("disabled", !ready());
			const paintFlip = () => {
				node.find(".wt-cam-box").toggleClass("back", facing === "environment");
				node.find(".wt-cam-flip span").text(facing === "environment" ? __("Use front camera") : __("Use back camera"));
			};

			const geoMessage = (error) => {
				const reasons = {
					1: __("Location permission was denied. Allow location for this site in the browser or phone settings, then try again."),
					2: __("The location is not available. Switch on GPS / location services and try again."),
					3: __("Getting the location took too long. Check the GPS signal and try again."),
				};
				return reasons[error && error.code] || __("Location needs a secure (https) page and a device with GPS.");
			};
			const onPosition = (p) => {
				fix = { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy, at: p.timestamp };
				setGps("ok", `${ICONS.pin} ${__("Location ready")} · ±${Math.round(fix.accuracy)} m`);
				refresh();
			};
			const onGeoError = (error) => {
				fix = null;
				const text = esc(geoMessage(error));
				setGps("bad", `${text}<button type="button" class="wt-link wt-gps-retry">${__("Try again")}</button>${required ? "" : ` ${__("You can still take this photo without a location.")}`}`);
				refresh();
			};
			const stopGeo = () => {
				if (watchId != null && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
				watchId = null;
			};
			const startGeo = () => {
				stopGeo();
				fix = null;
				refresh();
				if (!navigator.geolocation || !window.isSecureContext) return onGeoError({ code: 0 });
				setGps("wait", __("Getting your location…"));
				watchId = navigator.geolocation.watchPosition(onPosition, onGeoError, { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 });
			};
			const freshFix = () =>
				new Promise((resolve, reject) =>
					navigator.geolocation.getCurrentPosition(
						(p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy, at: p.timestamp }),
						reject,
						{ enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
					)
				);

			const stopStream = () => {
				if (stream) stream.getTracks().forEach((t) => t.stop());
				stream = null;
				video.srcObject = null;
			};
			const startStream = async () => {
				stopStream();
				note.text(__("Starting camera…")).show();
				if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
					note.text(__("The camera needs a secure (https) page."));
					return;
				}
				const upright = window.matchMedia("(max-width: 720px)").matches;
				const size = upright ? { width: { ideal: 1080 }, height: { ideal: 1440 } } : { width: { ideal: 1920 }, height: { ideal: 1080 } };
				const open = (facingMode) => navigator.mediaDevices.getUserMedia({ video: { facingMode, ...size }, audio: false });
				try {
					let s;
					try {
						s = await open(facing === "environment" ? { exact: "environment" } : "user");
					} catch (e) {
						if (facing !== "environment" || (e && e.name === "NotAllowedError")) throw e;
						facing = "user"; // no back camera on this device
						frappe.show_alert({ message: __("This device has no back camera"), indicator: "orange" });
						s = await open("user");
					}
					if (finished) {
						s.getTracks().forEach((t) => t.stop()); // closed before the camera answered
						return;
					}
					stream = s;
					video.srcObject = s;
					video.play().catch(() => {});
					note.hide();
					paintFlip();
				} catch (error) {
					const reasons = {
						NotAllowedError: __("Camera blocked. Allow camera access for this site (lock icon in the address bar) and try again."),
						NotFoundError: __("No camera found on this device."),
						NotReadableError: __("The camera is being used by another app or tab. Close it and try again."),
					};
					note.text(reasons[error && error.name] || __("The camera could not be started.")).show();
				}
				refresh();
			};

			const finish = (result) => {
				if (finished) return;
				finished = true;
				stopStream();
				stopGeo();
				node.remove();
				this.camera = null;
				resolve(result);
			};
			this.camera = { close: () => finish(null) };

			const toBlob = (canvas, quality) => new Promise((done) => canvas.toBlob(done, "image/jpeg", quality));
			// the date, time and place written on the picture, from the clock and GPS at the moment of capture
			const stampCanvas = (source, when, point) => {
				const canvas = document.createElement("canvas");
				canvas.width = source.width;
				canvas.height = source.height;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(source, 0, 0);
				const size = Math.max(16, Math.round(Math.min(canvas.width, canvas.height) / 28));
				const lines = [
					fmtStamp(when),
					point ? `Lat ${point.lat.toFixed(6)}  Lng ${point.lng.toFixed(6)}  ±${Math.round(point.accuracy)} m` : "Location not available",
					`${required ? "Water Tanker Photo" : "Tank Level Photo"} · Water Tanker Tracker`,
				];
				const gap = Math.round(size * 0.6);
				const lineHeight = Math.round(size * 1.35);
				const height = gap * 2 + lineHeight * lines.length;
				ctx.fillStyle = "rgba(0,0,0,.62)";
				ctx.fillRect(0, canvas.height - height, canvas.width, height);
				ctx.fillStyle = "#fff";
				ctx.textBaseline = "top";
				ctx.font = `600 ${size}px Inter, Arial, sans-serif`;
				lines.forEach((text, i) => ctx.fillText(text, gap, canvas.height - height + gap + i * lineHeight, canvas.width - gap * 2));
				return canvas;
			};

			const snap = async () => {
				if (!ready()) return;
				if (!video.videoWidth) {
					this.warn(__("The camera is not ready yet"));
					return;
				}
				busy = true;
				refresh();
				const capturedAt = new Date(); // the shutter: this is the capture time, not the time of saving
				const frame = document.createElement("canvas");
				frame.width = video.videoWidth;
				frame.height = video.videoHeight;
				frame.getContext("2d").drawImage(video, 0, 0); // the true picture, not the mirrored preview
				let point = fix && Math.abs(capturedAt.getTime() - fix.at) <= GPS_FRESH_MS ? fix : null;
				if (!point && navigator.geolocation) {
					setGps("wait", __("Getting a fresh location…"));
					try {
						point = await freshFix();
					} catch (error) {
						busy = false;
						onGeoError(error);
						if (required) return;
					}
				}
				if (required && !point) {
					busy = false;
					refresh();
					return;
				}
				const original = await toBlob(frame, 0.92);
				const stamped = await toBlob(stampCanvas(frame, capturedAt, point), 0.9);
				shot = {
					original,
					stamped,
					previewUrl: URL.createObjectURL(stamped),
					capturedAt: capturedAt.toISOString(),
					capturedLocal: capturedAt,
					lat: point ? point.lat : null,
					lng: point ? point.lng : null,
					accuracy: point ? point.accuracy : null,
				};
				busy = false;
				stopStream();
				node.find(".wt-cam-shot").attr("src", shot.previewUrl).prop("hidden", false);
				video.hidden = true;
				node.find(".wt-snap, .wt-cam-flip").prop("hidden", true);
				node.find(".wt-use, .wt-retake").prop("hidden", false);
				setGps("ok", point ? `${ICONS.pin} ${esc(fmtStamp(capturedAt))} · ${esc(coordText(point.lat, point.lng))} · ±${Math.round(point.accuracy)} m` : esc(fmtStamp(capturedAt)));
			};

			node.on("click", ".wt-snap", snap);
			node.on("click", ".wt-use", () => shot && finish(shot));
			node.on("click", ".wt-retake", () => {
				if (shot && shot.previewUrl) URL.revokeObjectURL(shot.previewUrl);
				shot = null;
				node.find(".wt-cam-shot").prop("hidden", true);
				video.hidden = false;
				node.find(".wt-snap, .wt-cam-flip").prop("hidden", false);
				node.find(".wt-use, .wt-retake").prop("hidden", true);
				startGeo();
				startStream();
			});
			node.on("click", ".wt-cam-flip", () => {
				facing = facing === "environment" ? "user" : "environment";
				try {
					window.localStorage.setItem("wt_facing", facing);
				} catch (e) {
					/* the choice just is not remembered */
				}
				this.facing = facing;
				startStream();
			});
			node.on("click", ".wt-gps-retry", () => startGeo());
			node.on("click", ".wt-x, .wt-cancel", () => finish(null));
			node.on("click", (e) => {
				if ($(e.target).hasClass("wt-modal-back")) finish(null);
			});

			paintFlip();
			startGeo();
			startStream();
		});
	}
}

frappe.pages["water_tanker_tracker"].on_page_load = function (wrapper) {
	const page = frappe.ui.make_app_page({ parent: wrapper, title: __("Dashboard"), single_column: true });
	wrapper.water_tanker_tracker = new WaterTankerApp(wrapper, page);
};

frappe.pages["water_tanker_tracker"].on_page_show = function (wrapper) {
	if (wrapper.water_tanker_tracker) wrapper.water_tanker_tracker.onShow();
};
})();
