/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as DomEvent from './DomEvent';
import * as Util from '../core/Util';
import {PointFunction} from '../geometry/PointFunction';
import * as Browser from '../core/Browser';

// @ts-ignore
import {HTMLElement, Object, ReturnType, CSSStyleSheet} from 'typescript';
import { PointReturnImpl } from 'src/geometry/PointReturnImpl';

import {PointClass} from "src/geometry/PointClass";

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type HTMLElementReturnType = ReturnType<typeof HTMLElement>;
type CSSStyleSheetReturnType = ReturnType<typeof CSSStyleSheet>;
type NumberReturnType = ReturnType<typeof  PointFunction.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof PointFunction>;
type PointReturnType = ReturnType<typeof PointFunction>;
type ObjectReturnType = ReturnType<typeof Object.String>;
type StringReturnType = ReturnType<typeof HTMLElement> | ReturnType<typeof  PointFunction.prototype.toString> | string | ReturnType<typeof Object.String>;
type _roundReturnType = ReturnType<typeof  PointFunction.prototype._round> | number | ReturnType<typeof Object.Number>;
type roundReturnType = ReturnType<typeof  PointFunction.prototype.round> | number | ReturnType<typeof Object.Number>;
type floorReturnType = ReturnType<typeof  PointFunction.prototype.floor> | number | ReturnType<typeof Object.Number>;

type numberAuxX = ReturnType<typeof Object.Number>;

type numberAuxY = ReturnType<typeof Object.Number>;

/*
 * @namespace DomUtil
 *
 * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
 * tree, used by Leaflet internally.
 *
 * Most functions expecting or returning a `HTMLElement` also work for
 * SVG elements. The only difference is that classes refer to CSS classes
 * in HTML and SVG classes in SVG.
 */


// @property TRANSFORM: String
// Vendor-prefixed transform style name (e.g. `'webkitTransform'` for WebKit).
export const TRANSFORM = testProp(
	['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

// webkitTransition comes first because some browser versions that drop vendor prefix don't do
// the same for the transitionend event, in particular the Android 4.1 stock browser

// @property TRANSITION: String
// Vendor-prefixed transition style name.
export const TRANSITION = testProp(
	['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

// @property TRANSITION_END: String
// Vendor-prefixed transitionend event name.
export const TRANSITION_END =
	TRANSITION === 'webkitTransition' || TRANSITION === 'OTransition' ? TRANSITION + 'End' : 'transitionend';


// @function get(id: String|HTMLElement): HTMLElement
// Returns an element given its DOM id, or returns the element itself
// if it was passed directly.
export function get(id:StringReturnType|HTMLElementReturnType):HTMLElementReturnType {
	return typeof id === 'string' ? document.getElementById(id) : id;
}

// @function getStyle(el: HTMLElement, styleAttrib: String): String
// Returns the value for a certain style attribute on an element,
// including computed values or values set through CSS.
export function getStyle(el:HTMLElementReturnType, style:StringReturnType):StringReturnType {
	const value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

	if ((!value || value === 'auto') && document.defaultView) {
		const css = document.defaultView.getComputedStyle(el, null);
		value = css ? css[style] : null;
	}
	return value === 'auto' ? null : value;
}

// @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
// Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
export function create(tagName:StringReturnType, className:StringReturnType, container:HTMLElementReturnType):HTMLElementReturnType {
	const el = document.createElement(tagName);
	el.className = className || '';

	if (container) {
		container.appendChild(el);
	}
	return el;
}

// @function remove(el: HTMLElement)
// Removes `el` from its parent element
export function remove(el:HTMLElementReturnType) {
	const parent = el.parentNode;
	if (parent) {
		parent.removeChild(el);
	}
}

// @function empty(el: HTMLElement)
// Removes all of `el`'s children elements from `el`
export function empty(el:HTMLElementReturnType) {
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
}

// @function toFront(el: HTMLElement)
// Makes `el` the last child of its parent, so it renders in front of the other children.
export function toFront(el:HTMLElementReturnType) {
	const parent = el.parentNode;
	if (parent && parent.lastChild !== el) {
		parent.appendChild(el);
	}
}

// @function toBack(el: HTMLElement)
// Makes `el` the first child of its parent, so it renders behind the other children.
export function toBack(el:HTMLElementReturnType) {
	const parent = el.parentNode;
	if (parent && parent.firstChild !== el) {
		parent.insertBefore(el, parent.firstChild);
	}
}

// @function hasClass(el: HTMLElement, name: String): Boolean
// Returns `true` if the element's class attribute contains `name`.
export function hasClass(el:HTMLElementReturnType, name:StringReturnType):boolean {
	if (el.classList !== undefined) {
		return el.classList.contains(name);
	}
	const className = getClass(el);
	return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
}

// @function addClass(el: HTMLElement, name: String)
// Adds `name` to the element's class attribute.
export function addClass(el:HTMLElementReturnType, name:StringReturnType) {
	
	if (el.classList !== undefined) {
		
		const classes = Util.splitWords(name);

		for (const i = 0, len = classes.length; i < len; i++) {
			el.classList.add(classes[i]);
		}
		
	} else if (!hasClass(el, name)) {
		const className = getClass(el);
		setClass(el, (className ? className + ' ' : '') + name);
	}
}

// @function removeClass(el: HTMLElement, name: String)
// Removes `name` from the element's class attribute.
export function removeClass(el:HTMLElementReturnType, name:StringReturnType) {
	if (el.classList !== undefined) {
		el.classList.remove(name);
	} else {
		setClass(el, Util.trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
	}
}

// @function setClass(el: HTMLElement, name: String)
// Sets the element's class.
export function setClass(el:HTMLElementReturnType, name:StringReturnType) {
	if (el.className.baseVal === undefined) {
		el.className = name;
	} else {
		// in case of SVG element
		el.className.baseVal = name;
	}
}

// @function getClass(el: HTMLElement): String
// Returns the element's class.
export function getClass(el:HTMLElementReturnType):StringReturnType {
	// Check if the element is an SVGElementInstance and use the correspondingElement instead
	// (Required for linked SVG elements in IE11.)
	if (el.correspondingElement) {
		el = el.correspondingElement;
	}
	return el.className.baseVal === undefined ? el.className : el.className.baseVal;
}

// @function setOpacity(el: HTMLElement, opacity: Number)
// Set the opacity of an element (including old IE support).
// `opacity` must be a number from `0` to `1`.
export function setOpacity(el:HTMLElementReturnType, value:NumberReturnType) {
	if ('opacity' in el.style) {
		el.style.opacity = value;
	} else if ('filter' in el.style) {
		_setOpacityIE(el, value);
	}
}

function _setOpacityIE(el:HTMLElementReturnType, value:NumberReturnType) {
	let filter = false;
	const filterName = 'DXImageTransform.Microsoft.Alpha';

	// filters collection throws an error if we try to retrieve a filter that doesn't exist
	try {
		filter = el.filters.item(filterName);
	} catch (e) {
		// don't set opacity to 1 if we haven't already set an opacity,
		// it isn't needed and breaks transparent pngs.
		if (value === 1) { return; }
	}

	value = Math.round(value * 100);

	if (filter) {
		filter.Enabled = (value !== 100);
		filter.Opacity = value;
	} else {
		el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
	}
}

// @function testProp(props: String[]): String|false
// Goes through the array of style names and returns the first name
// that is a valid style name for an element. If no such name is found,
// it returns false. Useful for vendor-prefixed styles like `transform`.
export function testProp(props: StringReturnType[]): StringReturnType {
	const style = document.documentElement.style;

	// eslint-disable-next-line @typescript-eslint/no-for-in-array
	for (const i in props) {
		if (props[i] in style) {
			return props[i];
		}
	}
	return false;
}

// @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
// Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
// and optionally scaled by `scale`. Does not have an effect if the
// browser doesn't support 3D CSS transforms.
export function setTransform(el:HTMLElementReturnType, offset:PointReturnType, scale:NumberReturnType):HTMLElementReturnType {
	const pos = offset || new PointClass(0, 0);

	el.style[TRANSFORM] =
		(Browser.ie3d ?
			'translate(' + pos.x + 'px,' + pos.y + 'px)' :
			'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
		(scale ? ' scale(' + scale + ')' : '');
}

// @function setPosition(el: HTMLElement, position: Point)
// Sets the position of `el` to coordinates specified by `position`,
// using CSS translate or top/left positioning depending on the browser
// (used by Leaflet internally to position its layers).
export function setPosition(el:StringReturnType, point:PointReturnType):HTMLElementReturnType {

	/*eslint-disable */
	el._leaflet_pos = point;
	/* eslint-enable */

	if (Browser.any3d) {
		setTransform(el, point);
	} else {
		el.style.left = point.x + 'px';
		el.style.top = point.y + 'px';
	}
	return el;
}

// @function getPosition(el: HTMLElement): Point
// Returns the coordinates of an element previously positioned with setPosition.
export function getPosition(el:StringReturnType):PointReturnType {
	// this method is only used for elements previously positioned using setPosition,
	// so it's safe to cache the position for performance

	return el._leaflet_pos || new PointFunction(0, 0);
}

// @function disableTextSelection()
// Prevents the user from generating `selectstart` DOM events, usually generated
// when the user drags the mouse through a page with text. Used internally
// by Leaflet to override the behaviour of any click-and-drag interaction on
// the map. Affects drag interactions on the whole document.

// @function enableTextSelection()
// Cancels the effects of a previous [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection).
export const disableTextSelection;
export const enableTextSelection;
const _userSelect;
if ('onselectstart' in document) {
	disableTextSelection = function () {
		DomEvent.on(window, 'selectstart', DomEvent.preventDefault);
	};
	enableTextSelection = function () {
		DomEvent.off(window, 'selectstart', DomEvent.preventDefault);
	};
} else {
	const userSelectProperty = testProp(
		['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

	disableTextSelection = function () {
		if (userSelectProperty) {
			const style = document.documentElement.style;
			_userSelect = style[userSelectProperty];
			style[userSelectProperty] = 'none';
		}
	};
	enableTextSelection = function () {
		if (userSelectProperty) {
			document.documentElement.style[userSelectProperty] = _userSelect;
			_userSelect = undefined;
		}
	};
}

// @function disableImageDrag()
// As [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection), but
// for `dragstart` DOM events, usually generated when the user drags an image.
export function disableImageDrag() {
	DomEvent.on(window, 'dragstart', DomEvent.preventDefault);
}

// @function enableImageDrag()
// Cancels the effects of a previous [`L.DomUtil.disableImageDrag`](#domutil-disabletextselection).
export function enableImageDrag() {
	DomEvent.off(window, 'dragstart', DomEvent.preventDefault);
}

const _outlineElement:HTMLElementReturnType;
const _outlineStyle:CSSStyleSheetReturnType;
// @function preventOutline(el: HTMLElement)
// Makes the [outline](https://developer.mozilla.org/docs/Web/CSS/outline)
// of the element `el` invisible. Used internally by Leaflet to prevent
// focusable elements from displaying an outline when the user performs a
// drag interaction on them.
export function preventOutline(element:StringReturnType) {
	while (element.tabIndex === -1) {
		element = element.parentNode;
	}
	if (!element.style) { return; }
	restoreOutline();
	_outlineElement = element;
	_outlineStyle = element.style.outline;
	element.style.outline = 'none';
	DomEvent.on(window, 'keydown', restoreOutline);
}

// @function restoreOutline()
// Cancels the effects of a previous [`L.DomUtil.preventOutline`]().
export function restoreOutline() {
	if (!_outlineElement) { return; }
	_outlineElement.style.outline = _outlineStyle;
	_outlineElement = undefined;
	_outlineStyle = undefined;
	DomEvent.off(window, 'keydown', restoreOutline);
}

// @function getSizedParentNode(el: HTMLElement): HTMLElement
// Finds the closest parent node which size (width and height) is not null.
export function getSizedParentNode(element:StringReturnType):StringReturnType {
	do {
		const element = element.parentNode;
	} while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
	return element;
}

// @function getScale(el: HTMLElement): Object
// Computes the CSS scale currently applied on the element.
// Returns an object with `x` and `y` members as horizontal and vertical scales respectively,
// and `boundingClientRect` as the result of [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
export function getScale(element:StringReturnType):ObjectReturnType {
	const rect = element.getBoundingClientRect(); // Read-only in old browsers.

	return {
		x: rect.width / element.offsetWidth || 1,
		y: rect.height / element.offsetHeight || 1,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		boundingClientRect: rect
	};
}
