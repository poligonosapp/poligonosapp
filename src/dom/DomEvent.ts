/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {PointFunction} from '../geometry/PointFunction';
import * as Util from '../core/Util';
import * as Browser from '../core/Browser';
import {addPointerListener, removePointerListener} from './DomEvent.Pointer';
import {addDoubleTapListener, removeDoubleTapListener} from './DomEvent.DoubleTap';
import {getScale} from './DomUtil';

import {HTMLElement, ReturnType, Event, Object, EventListener} from "typescript";

type FunctionReturnType = ReturnType<typeof Function| typeof EventListener>;
type ObjectReturnType = ReturnType<typeof Object>;

type PointReturnType = ReturnType<typeof PointFunction>;

type NumberReturnType = ReturnType<typeof Number>;
type TypeReturnType = ReturnType<typeof String | typeof Number | typeof Event>;

type HTMLElementReturnType = ReturnType<typeof HTMLElement>;
type EventReturnType = ReturnType<typeof Event>;
type StringReturnType = ReturnType<typeof  PointFunction.prototype.toString> | string | ReturnType<typeof Object.String>;

interface Props{
	constext: EventListener;
}

/*
 * @namespace DomEvent
 * Utility functions to work with the [DOM events](https://developer.mozilla.org/docs/Web/API/Event), used by Leaflet internally.
 */

// Inspired by John Resig, Dean Edwards and YUI addEvent implementations.

// @function on(el: HTMLElement, types: String, fn: Function, context?: Object): this
// Adds a listener function (`fn`) to a particular DOM event type of the
// element `el`. You can optionally specify the context of the listener
// (object the `this` keyword will point to). You can also pass several
// space-separated types (e.g. `'click dblclick'`).

// @alternative
// @function on(el: HTMLElement, eventMap: Object, context?: Object): this
// Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
export function on(obj:HTMLElementReturnType, types: StringReturnType[], 
	fn:FunctionReturnType, context:ObjectReturnType):StringReturnType {

	if (typeof types === 'object') {
		for (let i in types) {
			addOne(obj, i, types[i], fn);
		}
	} else {
		types = Util.splitWords(types);

		for (let i in types) {
			addOne(obj, types[i], fn, context);
		}
	}

	return this;
}

const eventsKey = '_leaflet_events';

// @function off(el: HTMLElement, types: String, fn: Function, context?: Object): this
// Removes a previously added listener function.
// Note that if you passed a custom context to on, you must pass the same
// context to `off` in order to remove the listener.

// @alternative
// @function off(el: HTMLElement, eventMap: Object, context?: Object): this
// Removes a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
export function off(obj:HTMLElementReturnType[][],
	types:StringReturnType[], fn:FunctionReturnType, context:ObjectReturnType):EventReturnType {

	if (typeof types === 'object') {
		for (let i in types) {
			removeOne(obj, i, types[i], fn);
		}
	} else if (types) {
		types = Util.splitWords(types);

		for (let i = 0, len = types.length; i < len; i++) {
			removeOne(obj, types[i], fn, context);
		}
	} else {
		for (const j in obj[eventsKey]) {
			removeOne(obj, j, obj[eventsKey][j]);
		}
		delete obj[eventsKey];
	}

	return this;
}

function browserFiresNativeDblClick() {
	// See https://github.com/w3c/pointerevents/issues/171
	if (Browser.pointer) {
		return !(Browser.edge || Browser.safari);
	}
}

const mouseSubst = {
	mouseenter: 'mouseover',
	mouseleave: 'mouseout',
	wheel: !('onwheel' in window) && 'mousewheel'
};

function addOne(obj:HTMLElementReturnType, type:TypeReturnType[], fn:FunctionReturnType, context:ObjectReturnType):StringReturnType {
	const id = type + Util.stamp(fn) + (context ? '_' + Util.stamp(context) : '');

	if (obj[eventsKey] && obj[eventsKey][id]) { return this; }

	let handler = function (e:EventReturnType) {
		return fn.call(context || obj, e || window.event);
	};

	const originalHandler = handler;

	if (Browser.pointer && type.indexOf('touch') === 0) {
		// Needs DomEvent.Pointer.tsc
		addPointerListener(obj, type, handler, id);

	} else if (Browser.touch && (type === 'dblclick') && !browserFiresNativeDblClick()) {
		addDoubleTapListener(obj, handler, id);

	} else if ('addEventListener' in obj) {

		if (type === 'touchstart' || type === 'touchmove' || type === 'wheel' ||  type === 'mousewheel') {
			obj.addEventListener(mouseSubst[type] || type, handler, Browser.passiveEvents ? {passive: false} : false);

		} else if (type === 'mouseenter' || type === 'mouseleave') {
			handler = function (e) {
				e = e || window.event;
				if (isExternalTarget(obj, e)) {
					originalHandler(e);
				}
			};
			obj.addEventListener(mouseSubst[type], handler, false);

		} else {
			obj.addEventListener(type, originalHandler, false);
		}

	} else if ('attachEvent' in obj) {
		obj.attachEvent('on' + type, handler);
	}

	obj[eventsKey] = obj[eventsKey] || {};
	obj[eventsKey][id] = handler;
}

function removeOne(obj:HTMLElementReturnType, i: TypeReturnType[], fn:FunctionReturnType, context:ObjectReturnType) {

	const id = i + Util.stamp(fn) + (context ? '_' + Util.stamp(context) : '');
	const handler = obj[eventsKey] && obj[eventsKey][id];

	if (!handler) { return this; }

	if (Browser.pointer && i.indexOf('touch') === 0) {
		removePointerListener(obj, i, id);

	} else if (Browser.touch && (i === 'dblclick') && !browserFiresNativeDblClick()) {
		removeDoubleTapListener(obj, id);

	} else if ('removeEventListener' in obj) {

		obj.removeEventListener(mouseSubst[i] || i, handler, false);

	} else if ('detachEvent' in obj) {
		obj.detachEvent('on' + i, handler);
	}

	obj[eventsKey][id] = null;
}

// @function stopPropagation(ev: DOMEvent): this
// Stop the given event from propagation to parent elements. Used inside the listener functions:
// ```tsc
// L.DomEvent.on(div, 'click', function (ev) {
// 	L.DomEvent.stopPropagation(ev);
// });
// ```
export function stopPropagation(e:EventReturnType):EventReturnType {

	if (e.stopPropagation) {
		e.stopPropagation();
	} else if (e.originalEvent) {  // In case of Leaflet event.
		e.originalEvent._stopped = true;
	} else {
		e.cancelBubble = true;
	}
	skipped(e);

	return this;
}

// @function disableScrollPropagation(el: HTMLElement): this
// Adds `stopPropagation` to the element's `'wheel'` events (plus browser variants).
export function disableScrollPropagation(el:HTMLElementReturnType):EventReturnType {
	addOne(el, 'wheel', stopPropagation);
	return this;
}

// @function disableClickPropagation(el: HTMLElement): this
// Adds `stopPropagation` to the element's `'click'`, `'dblclick'`,
// `'mousedown'` and `'touchstart'` events (plus browser variants).
export function disableClickPropagation(el:HTMLElementReturnType):EventReturnType {
	on(el, 'mousedown touchstart dblclick', stopPropagation);
	addOne(el, 'click', fakeStop);
	return this;
}

// @function preventDefault(ev: DOMEvent): this
// Prevents the default action of the DOM Event `ev` from happening (such as
// following a link in the href of the a element, or doing a POST request
// with page reload when a `<form>` is submitted).
// Use it inside listener functions.
export function preventDefault(e:EventReturnType):EventReturnType {
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
	return this;
}

// @function stop(ev: DOMEvent): this
// Does `stopPropagation` and `preventDefault` at the same time.
export function stop(e:EventReturnType):EventReturnType {
	preventDefault(e);
	stopPropagation(e);
	return this;
}

// @function getMousePosition(ev: DOMEvent, container?: HTMLElement): Point
// Gets normalized mouse position from a DOM event relative to the
// `container` (border excluded) or to the whole page if not specified.
export function getMousePosition(e:EventReturnType, container:HTMLElementReturnType):PointReturnType {
	if (!container) {
		return PointFunction(e.clientX, e.clientY, undefined);
	}

	const scale = getScale(container);
	const offset = scale.boundingClientRect; // left and top  values are in page scale (like the event clientX/Y)

	return PointFunction(
		// offset.left/top values are in page scale (like clientX/Y),
		// whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
		(e.clientX - offset.left) / scale.x - container.clientLeft,
		(e.clientY - offset.top) / scale.y - container.clientTop,
		undefined
	);
}

// Chrome on Win scrolls double the pixels as in other platforms (see #4538),
// and Firefox scrolls device pixels, not CSS pixels
const wheelPxFactor =
	(Browser.win && Browser.chrome) ? 2 * window.devicePixelRatio :
	Browser.gecko ? window.devicePixelRatio : 1;

// @function getWheelDelta(ev: DOMEvent): Number
// Gets normalized wheel delta from a wheel DOM event, in vertical
// pixels scrolled (negative if scrolling down).
// Events from pointing devices without precise scrolling are mapped to
// a best guess of 60 pixels.
export function getWheelDelta(e:EventReturnType):NumberReturnType {
	return (Browser.edge) ? e.wheelDeltaY / 2 : // Don't trust window-geometry-based delta
	       (e.deltaY && e.deltaMode === 0) ? -e.deltaY / wheelPxFactor : // Pixels
	       (e.deltaY && e.deltaMode === 1) ? -e.deltaY * 20 : // Lines
	       (e.deltaY && e.deltaMode === 2) ? -e.deltaY * 60 : // Pages
	       (e.deltaX || e.deltaZ) ? 0 :	// Skip horizontal/depth wheel events
	       e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : // Legacy IE pixels
	       (e.detail && Math.abs(e.detail) < 32765) ? -e.detail * 20 : // Legacy Moz lines
	       e.detail ? e.detail / -32765 * 60 : // Legacy Moz pages
	       0;
}

let skipEvents = [false, false, false];

skipEvents = [false, true, false, false];

export function fakeStop(e:EventReturnType):boolean[] {
	// fakes stopPropagation by setting a special event flag, checked/reset with skipped(e)
	skipEvents[e.type] = true
	return skipEvents;
}

export function skipped(e:EventReturnType) {
	const events = skipEvents[e.type];
	// reset when checking, as it's only used in map container and propagates outside of the map
	skipEvents[e.type] = false;
	return events;
}

// check if element really left/entered the event target (for mouseenter/mouseleave)
export function isExternalTarget(el:HTMLElementReturnType, e:EventReturnType) {

	let related = e.relatedTarget;

	if (!related) { return true; }

	try {
		while (related && (related !== el)) {
			related = related.parentNode;
		}
	} catch (err) {
		return false;
	}
	return (related !== el);
}

// @function addListener(…): this
// Alias to [`L.DomEvent.on`](#domevent-on)
export {on as addListener};

// @function removeListener(…): this
// Alias to [`L.DomEvent.off`](#domevent-off)
export {off as removeListener};
