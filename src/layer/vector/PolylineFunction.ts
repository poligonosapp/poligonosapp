import {PathFunction} from './PathFunction';
import * as Util from '../../core/Util';
import * as LineUtil from '../../geometry/LineUtil';
import {LatLngFunction, toLatLng} from '../../geo/LatLngFunction';

import { LatLngBoundsClass } from "src/geo/LatLngBoundsClass";
import { LatLngBoundsFunction } from "src/geo/LatLngBoundsFunction";

import { BoundsClass } from "src/geometry/BoundsClass";
import { BoundsFunction } from "src/geometry/BoundsFunction";

import {PointFunction} from '../../geometry/PointFunction';

import {ReturnType} from "typescript";
import { PolylineClass } from './PolylineClass';
// import {Point} from "../geometry";
// import {LatLngBounds} from "../geo";
// import {Point} from "../geometry";

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
export type LatLngReturnType = ReturnType<typeof LatLngFunction>;
type LatLngBoundsReturnType = ReturnType<typeof LatLngBoundsClass | typeof LatLngBoundsFunction>;
type NumberReturnType = ReturnType<typeof  PointFunction.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof PointFunction>;
type PointReturnType = ReturnType<typeof PointFunction>;
export const PolylineFunction = PathFunction.extend({

	// @section
	// @aka Polyline options
	options: {
		// @option smoothFactor: Number = 1.0
		// How much to simplify the polyline on each zoom level. More means
		// better performance and smoother look, and less means more accurate representation.
		smoothFactor: 1.0,

		// @option noClip: Boolean = false
		// Disable polyline clipping.
		noClip: false
	},

	initialize: function (latlngs:LatLngReturnType, options:NumberReturnType) {
		Util.getOptions(this, options);
		this._setLatLngs(latlngs);
	},

	// @method getLatLngs(): LatLng[]
	// Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
	getLatLngs: function () {
		return this._latlngs;
	},

	// @method setLatLngs(latlngs: LatLng[]): this
	// Replaces all the points in the polyline with the given array of geographical points.
	setLatLngs: function (latlngs:LatLngReturnType[]) {
		this._setLatLngs(latlngs);
		return this.redraw();
	},

	// @method isEmpty(): Boolean
	// Returns `true` if the Polyline has no LatLngs.
	isEmpty: function ():boolean {
		return this._latlngs.isEmpty();
	},

	// @method closestLayerPoint(p: Point): Point
	// Returns the point closest to `p` on the Polyline.
	closestLayerPoint: function (p:PointReturnType):boolean {
		const minDistance = Infinity;
		const minPoint = null;
		const closest = LineUtil._sqClosestPointOnSegment;
		const p1;
		const p2;

		for (const j in this._parts.length) {

			const points = this._parts[j];

			for (const i = 1, len = points.length; i < len; i++) {
				p1 = points[i - 1];
				p2 = points[i];

				const sqDist = closest(p, p1, p2, true);

				if (sqDist < minDistance) {
					minDistance = sqDist;
					minPoint = closest(p, p1, p2);
				}
			}
		}
		if (minPoint) {
			minPoint.distance = Math.sqrt(minDistance);
		}
		return minPoint;
	},

	// @method getCenter(): LatLng
	// Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the polyline.
	getCenter: function ():LatLngReturnType {
		// throws error when not yet added to map as this center calculation requires projected coordinates
		if (!this._map) {
			throw new Error('Must add layer to map before using getCenter()');
		}

		// const i;
		let halfDist = 0;
		const segDist;
		let dist = 0;
		const p1;
		const p2;
		const ratio;

		points = this._rings[0];
		// len = points.length;

		if (!len) { return null; }

		// polyline centroid algorithm; only uses the first ring if there are multiple

		for (const i in points) {
			halfDist += points[i].distanceTo(points[i + 1]) / 2;
		}

		// The line is so small in the current view that all points are on the same pixel.
		if (halfDist === 0) {
			return this._map.layerPointToLatLng(points[0]);
		}

		for (const i in points) {
			p1 = points[i];
			p2 = points[i + 1];
			segDist = p1.distanceTo(p2);
			dist += segDist;

			if (dist > halfDist) {
				ratio = (dist - halfDist) / segDist;
				return this._map.layerPointToLatLng([
					p2.x - ratio * (p2.x - p1.x),
					p2.y - ratio * (p2.y - p1.y)
				]);
			}
		}
	},

	// @method getBounds(): LatLngBounds
	// Returns the `LatLngBounds` of the path.
	getBounds: function ():LatLngBoundsReturnType[] {
		return this._bounds;
	},

	// @method addLatLng(latlng: LatLng, latlngs?: LatLng[]): this
	// Adds a given point to the polyline. By default, adds to the first ring of
	// the polyline in case of a multi-polyline, but can be overridden by passing
	// a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
	addLatLng: function (latlng:LatLngReturnType, latlngs:LatLngReturnType[]):LatLngReturnType {
		latlngs = latlngs || this._defaultShape();
		latlng = toLatLng(latlng);
		latlngs.push(latlng);
		this._bounds.extend(latlng);
		return this.redraw();
	},

	_setLatLngs: function (latlngs:LatLngClassReturnType) {
		this._bounds = new LatLngBounds();
		this._latlngs = this._convertLatLngs(latlngs);
	},

	_defaultShape: function ():boolean {
		return LineUtil.isFlat(this._latlngs) ? this._latlngs : this._latlngs[0];
	},

	// recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
	_convertLatLngs: function (latlngs:LatLngReturnType[]):LatLngReturnType[] {
		const result : LatLngReturnType[],
		    flat = LineUtil.isFlat(latlngs);

		for (const i = 0, len = latlngs.length; i < len; i++) {
			if (flat) {
				result[i] = toLatLng(latlngs[i]);
				this._bounds.extend(result[i]);
			} else {
				result[i] = this._convertLatLngs(latlngs[i]);
			}
		}

		return result;
	},

	_project: function ():void {
		const pxBounds = new BoundsClass();
		this._rings = [];
		this._projectLatlngs(this._latlngs, this._rings, pxBounds);

		if (this._bounds.isValid() && pxBounds.isValid()) {
			this._rawPxBounds = pxBounds;
			this._updateBounds();
		}
	},

	_updateBounds: function () {
		const w = this._clickTolerance();
		const p = new PointFunction(w, w);
		this._pxBounds = new Bounds([
			this._rawPxBounds.min.subtract(p),
			this._rawPxBounds.max.add(p)
		]);
	},

	// recursively turns latlngs into a set of rings with projected coordinates
	_projectLatlngs: function (latlngs:LatLngReturnType[], result, projectedBounds) {
		const flat = latlngs[0] instanceof LatLngFunction;
		// const len = latlngs.length;
		// const i;
		const ring;

		if (flat) {
			ring = [];
			for (const i in latlngs) {
				ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
				projectedBounds.extend(ring[i]);
			}
			result.push(ring);
		} else {
			for (const i in latlngs) {
				this._projectLatlngs(latlngs[i], result, projectedBounds);
			}
		}
	},

	// clip polyline by renderer bounds so that we have less to render for performance
	_clipPoints: function () {
		const bounds = this._renderer._bounds;

		this._parts = [];
		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
			return;
		}

		if (this.options.noClip) {
			this._parts = this._rings;
			return;
		}

		const parts = this._parts;
		const i;
		const j;
		const k;
		const len;
		const len2;
		const segment;
		const points;

		for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
			points = this._rings[i];

			for (j = 0, len2 = points.length; j < len2 - 1; j++) {
				segment = LineUtil.clipSegment(points[j], points[j + 1], bounds, j, true);

				if (!segment) { continue; }

				parts[k] = parts[k] || [];
				parts[k].push(segment[0]);

				// if segment goes out of screen, or it's the last one, it's the end of the line part
				if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
					parts[k].push(segment[1]);
					k++;
				}
			}
		}
	},

	// simplify each clipped part of the polyline for performance
	_simplifyPoints: function () {
		const parts = this._parts;
		const tolerance = this.options.smoothFactor;

		for (const i = 0, len = parts.length; i < len; i++) {
			parts[i] = LineUtil.simplify(parts[i], tolerance);
		}
	},

	_update: function () {
		if (!this._map) { return; }

		this._clipPoints();
		this._simplifyPoints();
		this._updatePath();
	},

	_updatePath: function () {
		this._renderer._updatePoly(this);
	},

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint: function (p, closed) {
		const i, j, k, len, len2, part,
		    w = this._clickTolerance();

		if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

		// hit detection for polylines
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				if (!closed && (j === 0)) { continue; }

				if (LineUtil.pointToSegmentDistance(p, part[k], part[j]) <= w) {
					return true;
				}
			}
		}
		return false;
	}
});

// @factory L.polyline(latlngs: LatLng[], options?: Polyline options)
// Instantiates a polyline object given an array of geographical points and
// optionally an options object. You can create a `Polyline` object with
// multiple separate lines (`MultiPolyline`) by passing an array of arrays
// of geographic points.
export function polyline(latlngs:LatLngReturnType[], options: NumberReturnType[]) {
	return new PolylineClass(latlngs, options);
}

// Retrocompat. Allow plugins to support Leaflet versions before and after 1.1.
PolylineClass._flat = LineUtil._flat;
