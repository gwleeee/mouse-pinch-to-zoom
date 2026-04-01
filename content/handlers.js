// handlers for mouse events
// zoom level calculations

'use strict';

const zoomResponseCurves = [
	[
		{ input: 0, output: 0 },
		{ input: 40, output: 10 },
		{ input: 120, output: 90 },
		{ input: 240, output: 200 },
		{ input: 480, output: 500 }
	],
	[
		{ input: 0, output: 0 },
		{ input: 40, output: 18 },
		{ input: 120, output: 120 },
		{ input: 240, output: 280 },
		{ input: 480, output: 680 }
	],
	[
		{ input: 0, output: 0 },
		{ input: 40, output: 28 },
		{ input: 120, output: 150 },
		{ input: 240, output: 360 },
		{ input: 480, output: 860 }
	]
];

function smoothstep(t) {
	return t * t * (3 - 2 * t);
}

function remapZoomDelta(rawDelta) {
	const direction = Math.sign(rawDelta);
	const magnitude = Math.abs(rawDelta);
	if (!magnitude) return 0;
	const zoomResponseCurve = zoomResponseCurves[responsePreset] || zoomResponseCurves[1];

	for (let i = 0; i < zoomResponseCurve.length - 1; i++) {
		const current = zoomResponseCurve[i];
		const next = zoomResponseCurve[i + 1];
		if (magnitude <= next.input) {
			const span = next.input - current.input;
			const t = span ? (magnitude - current.input) / span : 0;
			const eased = smoothstep(Math.max(0, Math.min(1, t)));
			return direction * (current.output + (next.output - current.output) * eased);
		}
	}

	const prev = zoomResponseCurve[zoomResponseCurve.length - 2];
	const last = zoomResponseCurve[zoomResponseCurve.length - 1];
	const slope = (last.output - prev.output) / (last.input - prev.input);
	return direction * (last.output + (magnitude - last.input) * slope);
}

// this is the function connected with the scroll event listener 
function scrollEvent(e) {
	// if iframe, send to top
	if (!isTop) {
		if (!configured) iframeConfigure();
		parent.postMessage({ from: ID, type: 'scroll', deltaY: e.deltaY, clientX: e.clientX, clientY: e.clientY }, '*');
		return;
	}

	// check flag
	// this is meant to prevent unexpected behavior from making two zooms at the same time
	if (triggered) {
		nextEvent = e;
		return;
	}

	// check zoom
	// if you're fully zoomed out and try to zoom out further, do nothing
	if (e && zoom == 1 && e.deltaY > 0) return;

	// don't zoom if deltaY is small
	// prevents activtion when using alt+tab after a touchpad scroll
	if (e && fixTouchpadScroll && Math.abs(e.deltaY) < fixTouchpadScrollThreshold) return;

	// set flag
	triggered = true;
	lastEvent = e;

	// before configuration, save scrollX scrollY (fix for wolfram alpha)
	let scrollX, scrollY;
	// configuration
	if (!configured) {
		scrollX = body.scrollLeft || undefined;
		scrollY = body.scrollTop || undefined;
		configure(e);
	}

	// calculate max zoom (max zoom is the target zoom of one mouse wheel move, it's divided into steps to make it smoother)
	let maxZoom;
	const shapedDelta = remapZoomDelta(e.deltaY);
	let newZoom = zoom + zoom * -1 * shapedDelta * 0.01 * mult; // mult is what you can change in the extension settings ('speed' setting)
	if (newZoom < 1) maxZoom = 1; // don't zoom below 1
	else if (newZoom > 1000) maxZoom = 1000; // don't zoom to far in because the browser goes crazy
	else maxZoom = newZoom;

	// execute scale
	let start;
	let i = 1;
	const zoomBefore = zoom;

	// the section below uses requestAnimationFrame to synchronize the zoom with display refresh rate and make it seem smooth
	function step(timestamp) {
		if (!start) start = timestamp;

		if (i <= steps) { // steps is the 'smoothness' setting
			const stepZoom = zoomBefore + (i / steps) * (maxZoom - zoomBefore); // this is the target zoom of this STEP of zooming
			i == 1 ? scale(e, stepZoom, scrollX, scrollY) : scale(e, stepZoom);
			i++;
			requestAnimationFrame(step);
		}
		else {
			triggered = false;
			//lastEvent = undefined;
			if (nextEvent) { // if the user moves the mouse wheel while the previous zoom is still executing, it's saved and run just after the previous one finishes
				const temp = nextEvent;
				nextEvent = undefined;
				scrollEvent(temp);
			}
		}
	}

	requestAnimationFrame(step);
}

// this is connected to the mouse wheel clicking listener
function clickEvent() {
	// if iframe, send to top
	if (!isTop) {
		parent.postMessage({ from: ID, type: 'click' }, '*');
		return;
	}
	scale(undefined, 1);
	restore();
}
