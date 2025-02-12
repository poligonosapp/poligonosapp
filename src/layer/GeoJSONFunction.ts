/* eslint-disable prefer-spread */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {LayerGroup} from './LayerGroup';
import {FeatureGroup} from './FeatureGroup';
import * as Util from '../core/Util';
import {Marker} from './marker/Marker';
import {Circle} from './vector/Circle';
import {CircleMarker} from './vector/CircleMarker';
import { PolylineClass } from "./vector/PolylineClass";
import { PolygonClass } from "./vector/PolygonClass";
import {LatLngFunction} from '../geo/LatLngFunction';
import * as LineUtil from '../geometry/LineUtil';
import {Object, ReturnType} from "typescript";
import {Point} from "../geometry";
import {layers} from "../control/Control.Layers";

// import * as L from './Leaflet';

import {Map} from "src/map/Map";

import { GeoJSONClass } from './GeoJSONClass';

import {Function} from 'typescript';
import { LatLngClass } from 'src/geo/LatLngClass';

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type GeoJSONOptionsReturnType = ReturnType<typeof String | typeof Number | typeof Boolean | typeof Array>;
export type GeoJSONFunctionOptions = ReturnType<typeof String>;
type FunctionReturnType = ReturnType<typeof Function>;
type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type LatLngReturnType = ReturnType<typeof LatLngFunction>;
type GeoJSONReturnType = ReturnType<typeof GeoJSONFunction|GeoJSONClass>;
export type MapReturnType = ReturnType<typeof Map>;
type GridLayerReturnType = ReturnType<typeof  FeatureGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type LayerReturnType = ReturnType<typeof  FeatureGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

/*
 * @class GeoJSON
 * @aka L.GeoJSON
 * @inherits FeatureGroup
 *
 * Represents a GeoJSON object or an array of GeoJSON objects. Allows you to parse
 * GeoJSON data and display it on the map. Extends `FeatureGroup`.
 *
 * @example
 *
 * ```tsc
 * L.geoJSON(data, {
 * 	style: function (feature) {
 * 		return {color: feature.properties.color};
 * 	}
 * }).bindPopup(function (layer) {
 * 	return layer.feature.properties.description;
 * }).addTo(map);
 * ```
 */

export interface Props{
	geojson:GeoJSONReturnType;
	options:GeoJSONOptionsReturnType[];
}

export const GeoJSONFunction:FunctionReturnType = FeatureGroup.extend({

	/* @section
	 * @aka GeoJSON options
	 *
	 * @option pointToLayer: Function = *
	 * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
	 * called when data is added, passing the GeoJSON point feature and its `LatLng`.
	 * The default is to spawn a default `Marker`:
	 * ```tsc
	 * function(geoJsonPoint, latlng) {
	 * 	return L.marker(latlng);
	 * }
	 * ```
	 *
	 * @option style: Function = *
	 * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
	 * called internally when data is added.
	 * The default value is to not override any defaults:
	 * ```tsc
	 * function (geoJsonFeature) {
	 * 	return {}
	 * }
	 * ```
	 *
	 * @option onEachFeature: Function = *
	 * A `Function` that will be called once for each created `Feature`, after it has
	 * been created and styled. Useful for attaching events and popups to features.
	 * The default is to do nothing with the newly created layers:
	 * ```tsc
	 * function (feature, layer) {}
	 * ```
	 *
	 * @option filter: Function = *
	 * A `Function` that will be used to decide whether to include a feature or not.
	 * The default is to include all features:
	 * ```tsc
	 * function (geoJsonFeature) {
	 * 	return true;
	 * }
	 * ```
	 * Note: dynamically changing the `filter` option will have effect only on newly
	 * added data. It will _not_ re-evaluate already included features.
	 *
	 * @option coordsToLatLng: Function = *
	 * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
	 * The default is the `coordsToLatLng` static method.
	 *
	 * @option markersInheritOptions: Boolean = false
	 * Whether default Markers for "Point" type Features inherit from group options.
	 */

	initialize: function (geojson:GeoJSONReturnType, options:GeoJSONOptionsReturnType[]):GeoJSONReturnType {
		Util.getOptions(this, options);

		this._layers = {};

		if (geojson) {
			this.addData(geojson);
		}
	},

	

	// @method addData( <GeoJSON> data ): this
	// Adds a GeoJSON object to the layer.
	addData: function (geojson:GeoJSONReturnType):GeoJSONReturnType {
		const features:GeoJSONReturnType[] = Util.isArray(geojson) ? geojson : geojson.features;
		// const i;
		// const len;
		// const features:boolean;

		if (features) {
			for (const i in features) {
				// only add this if geometry or geometries are set and not null
				const feature = features[i];
				if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
					this.addData(feature);
				}
			}
			return this;
		}

		const options = this.options;

		if (options.filter && !options.filter(geojson)) { return this; }

		const layer = geometryToLayer(geojson, options);
		if (!layer) {
			return this;
		}
		layer.feature = asFeature(geojson);

		layer.defaultOptions = layer.options;
		this.resetStyle(layer);

		if (options.onEachFeature) {
			options.onEachFeature(geojson, layer);
		}

		return this.addLayer(layer);
	},

	// @method resetStyle( <Path> layer? ): this
	// Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
	// If `layer` is omitted, the style of all features in the current layer is reset.
	resetStyle: function (layer:LayerReturnType):LayerReturnType {
		if (layer === undefined) {
			return this.eachLayer(this.resetStyle, this);
		}
		// reset any custom styles
		layer.options = Util.extend({}, layer.defaultOptions);
		this._setLayerStyle(layer, this.options.style);
		return this;
	},

	// @method setStyle( <Function> style ): this
	// Changes styles of GeoJSON vector layers with the given style function.
	setStyle: function (style:CSSStyleSheet):CSSStyleSheet {
		return this.eachLayer( (layer:LayerReturnType) => {
			this._setLayerStyle(layer, style);
		}, this);
	},

	_setLayerStyle: function (layer:LayerReturnType, style:CSSStyleSheet) {
		if (layer.setStyle) {
			if (typeof style === 'function') {

				style = style(layer.feature);
			}
			layer.setStyle(style);
		}
	}
});

// @section
// There are several static functions which can be called without instantiating L.GeoJSON:

// @function geometryToLayer(featureData: Object, options?: GeoJSON options): Layer
// Creates a `Layer` from a given GeoJSON feature. Can use a custom
// [`pointToLayer`](#geojson-pointtolayer) and/or [`coordsToLatLng`](#geojson-coordstolatlng)
// functions if provided as options.
export function geometryToLayer(geojson:GeoJSONReturnType, options:GeoJSONOptionsReturnType[]):LayerReturnType {

	const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson;

	const coords = geometry ? geometry.coordinates : null;
	const layers = [];
	// const pointToLayer:GeoJSONOptionsReturnType[] = options && options.pointToLayer;
	const pointToLayer:GeoJSONOptionsReturnType[] = options;
	const _coordsToLatLng = options && coordsToLatLng;
	// const latlng;
	let latlngs: LatLngReturnType[] = [];
	// const i;
	// const len;

	if (!coords && !geometry) {
		return null;
	}

	switch (geometry.type) {
	case 'Point':
		const latlng = _coordsToLatLng(coords);
		return _pointToLayer(pointToLayer, geojson, latlng, options);

	case 'MultiPoint':
		for (const i in coords) {
			const latlng = _coordsToLatLng(coords[i]);
			layers.push(_pointToLayer(pointToLayer, geojson, latlng, options));
		}
		return new FeatureGroup(layers);

	case 'LineString':
	case 'MultiLineString':
		latlngs = coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
		return new PolylineClass(latlngs, options);

	case 'Polygon':
	case 'MultiPolygon':
		latlngs = coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
		return new PolygonClass(latlngs, options);

	case 'GeometryCollection':
		for (const i in geometry.geometries) {
			const layer:LayerReturnType = geometryToLayer({
				geometry: geometry.geometries[i],
				type: 'Feature',
				properties: geojson.properties
			}, options);

			if (layer) {
				layers.push(layer);
			}
		}
		return new FeatureGroup(layers);

	default:
		throw new Error('Invalid GeoJSON object.');
	}
}

function _pointToLayer(pointToLayerFn:FunctionReturnType, geojson:GeoJSONReturnType, latlng:LatLngReturnType, options:NumberReturnType) {
	return pointToLayerFn ?
		pointToLayerFn(geojson, latlng) :
		new Marker(latlng, options && options.markersInheritOptions && options);
}

// @function coordsToLatLng(coords: Array): LatLng
// Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
// or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
export function coordsToLatLng(coords:NumberReturnType[]): LatLngReturnType {
	return LatLngFunction(coords[1], coords[0], coords[2]).toLatLng(coords[1], coords[0], coords[2]);
}

// @function coordsToLatLngs(coords: Array, levelsDeep?: Number, coordsToLatLng?: Function): Array
// Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array.
// `levelsDeep` specifies the nesting level (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by default).
// Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
export function coordsToLatLngs(coords:[], levelsDeep:NumberReturnType, _coordsToLatLng:FunctionReturnType): LatLngReturnType[] {
	
	let latlngs : LatLngReturnType[] = [];

	for (const i in coords) {
		latlngs = levelsDeep ?
			coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) :
			(_coordsToLatLng || coordsToLatLng)(coords[i]);

		latlngs.push(latlngs);
	}

	return latlngs;
}

// @function latLngToCoords(latlng: LatLng, precision?: Number): Array
// Reverse of [`coordsToLatLng`](#geojson-coordstolatlng)
export function latLngToCoords(latlng:LatLngReturnType, precision:NumberReturnType):LatLngReturnType[] {

	precision = typeof precision === 'number' ? precision : 6;
	
	return latlng.alt !== undefined ?
		[Util.formatNum(latlng.lng, precision), Util.formatNum(latlng.lat, precision), Util.formatNum(latlng.alt, precision)] :
		[Util.formatNum(latlng.lng, precision), Util.formatNum(latlng.lat, precision)];
}

// @function latLngsToCoords(latlngs: Array, levelsDeep?: Number, closed?: Boolean): Array
// Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs)
// `closed` determines whether the first point should be appended to the end of the array to close the feature, only used when `levelsDeep` is 0. False by default.
export function latLngsToCoords(latlngs:LatLngReturnType[], levelsDeep:NumberReturnType, closed:boolean, precision:NumberReturnType):LatLngReturnType[] {
	const coords :LatLngReturnType[] = [];

	for (const i in latlngs) {
		coords.push(levelsDeep ?
			latLngsToCoords(latlngs[i], levelsDeep - 1, closed, precision) :
			latLngToCoords(latlngs[i], precision));
	}

	if (!levelsDeep && closed) {
		coords.push(coords[0]);
	}

	return coords;
}

export function getFeature(layer:LayerReturnType, newGeometry:GeoJSONReturnType):GeoJSONReturnType[] {
	
	let geojsonArray:GeoJSONReturnType[];
	
	const newLocal = Util.extend({}, layer.feature["geometry"] );
	
	geojsonArray = layer.feature ? newLocal : asFeature(newGeometry);

	return geojsonArray;

}

// @function asFeature(geojson: Object): Object
// Normalize GeoJSON geometries/features into GeoJSON features.
export function asFeature(geojson:GeoJSONReturnType):GeoJSONReturnType {
	if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
		return geojson;
	}

	return {
		type: 'Feature',
		properties: {},
		geometry: geojson
	};
}

const PointToGeoJSON = {
	toGeoJSON: function (precision:NumberReturnType):GeoJSONReturnType {
		return getFeature(this, {
			type: 'Point',
			coordinates: latLngToCoords(this.getLatLng(), precision)
		});
	}
};

// @namespace Marker
// @section Other methods
// @method toGeoJSON(precision?: Number): Object
// `precision` is the number of decimal places for coordinates.
// The default value is 6 places.
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the marker (as a GeoJSON `Point` Feature).
Marker.include(PointToGeoJSON);

// @namespace CircleMarker
// @method toGeoJSON(precision?: Number): Object
// `precision` is the number of decimal places for coordinates.
// The default value is 6 places.
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the circle marker (as a GeoJSON `Point` Feature).
Circle.include(PointToGeoJSON);
CircleMarker.include(PointToGeoJSON);


// @namespace Polyline
// @method toGeoJSON(precision?: Number): Object
// `precision` is the number of decimal places for coordinates.
// The default value is 6 places.
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polyline (as a GeoJSON `LineString` or `MultiLineString` Feature).
PolylineClass.include({
	toGeoJSON: function (precision:NumberReturnType): GeoJSONReturnType {
		const multi = !LineUtil.isFlat(this._latlngs);

		const coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);

		return getFeature(this, {
			type: (multi ? 'Multi' : '') + 'LineString',
			coordinates: coords
		});
	}
});

// @namespace Polygon
// @method toGeoJSON(precision?: Number): Object
// `precision` is the number of decimal places for coordinates.
// The default value is 6 places.
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polygon (as a GeoJSON `Polygon` or `MultiPolygon` Feature).
PolygonClass.include({
	toGeoJSON: function (precision:NumberReturnType): GeoJSONReturnType {
		const holes = !LineUtil.isFlat(this._latlngs);
		const multi = holes && !LineUtil.isFlat(this._latlngs[0]);

		let coords:LatLngReturnType[] = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);

		if (!holes) {
			coords = [coords];
		}

		return getFeature(this, {
			type: (multi ? 'Multi' : '') + 'Polygon',
			coordinates: coords
		});
	}
});


// @namespace LayerGroup
LayerGroup.include({
	toMultiPoint: function (precision:NumberReturnType):GeoJSONReturnType {
		
		let coords:LatLngReturnType[];

		this.eachLayer(function (layer:LayerReturnType):LatLngReturnType[] {
			coords.push(layer.toGeoJSON(precision).geometry.coordinates);

			return coords;
		});

		return getFeature(this, {
			type: 'MultiPoint',
			coordinates: coords
		});
	},

	// @method toGeoJSON(precision?: Number): Object
	// `precision` is the number of decimal places for coordinates.
	// The default value is 6 places.
	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
	toGeoJSON: function (precision:NumberReturnType):GeoJSONReturnType {

		const type = this.feature && this.feature.geometry && this.feature.geometry.type;

		if (type === 'MultiPoint') {
			return this.toMultiPoint(precision);
		}

		const isGeometryCollection = type === 'GeometryCollection';
		let jsons:GeoJSONReturnType[] = [];

		this.eachLayer(function (layer:LayerReturnType):GeoJSONReturnType[] {
			if (layer.toGeoJSON) {
				const json = layer.toGeoJSON(precision);
				if (isGeometryCollection) {
					jsons.push(json.geometry);
				} else {
					const feature = asFeature(json);
					// Squash nested feature collections
					if (feature.type === 'FeatureCollection') {
						jsons.push.apply(jsons, feature.features);
					} else {
						jsons.push(feature);
					}
				}
			}
		});

		if (isGeometryCollection) {
			return getFeature(this, {
				geometries: jsons,
				type: 'GeometryCollection'
			});
		}

		return {
			type: 'FeatureCollection',
			features: jsons
		};
	}
});

// @namespace GeoJSON
// @factory L.geoJSON(geojson?: Object, options?: GeoJSON options)
// Creates a GeoJSON layer. Optionally accepts an object in
// [GeoJSON format](https://tools.ietf.org/html/rfc7946) to display on the map
// (you can alternatively add it later with `addData` method) and an `options` object.
export function geoJSON(geojson:GeoJSONReturnType, options:GeoJSONOptionsReturnType[]):GeoJSONReturnType {
	// options = null;// 12 IANA CONSIDERATIONS Optional parameters:  n/a
	return GeoJSONFunction(geojson, options);
}

// Backward compatibility.
export const geoJson = geoJSON;
