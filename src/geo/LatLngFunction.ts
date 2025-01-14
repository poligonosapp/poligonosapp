/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as Util from '../core/Util';
import {Earth} from './crs/CRS.Earth';
import {toLatLngBoundsFunction} from './LatLngBoundsFunction';

// import {Point} from '../../geometry/Point';
import {BoundsClass} from "src/geometry/BoundsClass";
import {BoundsFunction} from "src/geometry/BoundsFunction";

import {LatLngBoundsClass} from "src/geo/LatLngBoundsClass";
import {LatLngBoundsFunction} from "src/geo/LatLngBoundsFunction";

import {Object, ReturnType, HTMLElement} from 'typescript';
import {Point} from "../geometry";
import {FeatureGroup} from "../layer";
import { LatLngClass } from './LatLngClass';

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type LatLngReturnType = ReturnType<typeof LatLngFunction> | ReturnType<typeof LatLngFunction.prototype.clone>;
type LatLngBoundsReturnType= ReturnType<typeof LatLngBounds>;
type HTMLElementReturnType = ReturnType<typeof HTMLElement>;
type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
// type pointReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

// type GridLayerReturnType = ReturnType<typeof  FeatureGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
// type LayerReturnType = ReturnType<typeof  FeatureGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
// type LayerGroupReturnType = ReturnType<typeof  LayerGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

// type PointReturnType = ReturnType<typeof Point>;
// type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type StringReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof Object.String>;
// type _roundReturnType = ReturnType<typeof  Point.prototype._round> | number | ReturnType<typeof Object.Number>;
// type roundReturnType = ReturnType<typeof  Point.prototype.round> | number | ReturnType<typeof Object.Number>;
// type floorReturnType = ReturnType<typeof  Point.prototype.floor> | number | ReturnType<typeof Object.Number>;

// type numberAuxX = ReturnType<typeof Object.Number>;

// type numberAuxY = ReturnType<typeof Object.Number>;

/* @class LatLng
 * @aka L.LatLng
 *
 * Represents a geographical point with a certain latitude and longitude.
 *
 * @example
 *
 * ```
 * const latlng = L.latLng(50.5, 30.5);
 * ```
 *
 * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
 *
 * ```
 * map.panTo([50, 30]);
 * map.panTo({lon: 30, lat: 50});
 * map.panTo({lat: 50, lng: 30});
 * map.panTo(L.latLng(50, 30));
 * ```
 *
 * Note that `LatLng` does not inherit from Leaflet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

export interface Props{
	lat:NumberReturnType;
	lng:NumberReturnType;
	alt:NumberReturnType;
}

export function LatLngFunction(lat:Props["lat"], lng:Props["lng"], alt:Props["alt"]):void {
	
	if (isNaN(lat) || isNaN(lng)) {
		throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
	}

	// @property lat: Number
	// Latitude in degrees
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	// this.lat:NumberReturnType = +lat;// Declaring this in a function unreachable code

	// @property lng: Number
	// Longitude in degrees
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	// this.lng:NumberReturnType = +lng;

	// @property alt: Number
	// Altitude in meters (optional)
	// if (alt !== undefined) {
		// this.alt = +alt;
	// }
}

LatLngFunction.prototype = {
	// @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
	// Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
	equals: function (obj:LatLngReturnType, maxMargin:NumberReturnType):boolean {
		if (!obj) { return false; }

		obj = toLatLng(obj.lat, obj.lng, obj.alt);

		const margin = Math.max(Math.abs(this.lat - obj.lat), Math.abs(this.lng - obj.lng));

		return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
	},

	// @method toString(): String
	// Returns a string representation of the point (for debugging purposes).
	toString: function (precision:NumberReturnType):StringReturnType {
		return 'LatLng(' + Util.formatNum(this.lat, precision) + ', ' + Util.formatNum(this.lng, precision) + ')';
	},

	// @method distanceTo(otherLatLng: LatLng): Number
	// Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
	distanceTo: function (other:LatLngReturnType):NumberReturnType {
		return Earth.distance(toLatLng(this.lat,this.lng,this.alt), toLatLng(other.lat, other.lng, other.alt));
	},

	// @method wrap(): LatLng
	// Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
	wrap: function ():LatLngReturnType {
		return LatLngFunction(-180, 180, undefined);
	},

	// @method toBounds(sizeInMeters: Number): LatLngBounds
	// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
	toBounds: function (sizeInMeters:NumberReturnType): LatLngBoundsReturnType[] {

		const latAccuracy = 180 * sizeInMeters / 40075017;

		const lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

		return toLatLngBoundsFunction(
		        [this.lat - latAccuracy, this.lng - lngAccuracy],
		        [this.lat + latAccuracy, this.lng + lngAccuracy]);
	},

	clone: function ():LatLngReturnType {
		return new LatLngClass(this.lat, this.lng, this.alt);
	}
};



// @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
// Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

// @alternative
// @factory L.latLng(coords: Array): LatLng
// Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

// @alternative
// @factory L.latLng(coords: Object): LatLng
// Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

export function toLatLng(a:NumberReturnType, b:NumberReturnType, c:NumberReturnType):LatLngReturnType {
	if (a instanceof LatLngClass) {
		return a;
	}
	if (Util.isArray(a) && typeof a[0] !== 'object') {
		if (a.length === 3) {
			return LatLngFunction(a[0], a[1], a[2]);
		}
		if (a.length === 2) {
			return LatLngFunction(a[0], a[1], undefined);
		}
		return null;
	}
	if (a === undefined || a === null) {
		return a;
	}
	if (typeof a === 'object' && 'lat' in a) {
		return LatLngFunction(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
	}
	if (b === undefined) {
		return null;
	}
	return LatLngFunction(a, b, c);
}
