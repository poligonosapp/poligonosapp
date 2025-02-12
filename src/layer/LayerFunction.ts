/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {Evented} from '../core/Events';
import {Map} from '../map/Map';
// import {LayerGroup} from './LayerGroup';
import * as Util from '../core/Util';



import {Object, ReturnType, HTMLElement} from 'typescript';
// @ts-ignore
import {$ , Event} from 'jquery';
import {Point} from "../geometry";
import {FeatureGroup} from "./FeatureGroup";
import {LatLngBoundsClass} from "src/geo/LatLngBoundsClass";
import {LatLngBoundsFunction} from "src/geo/LatLngBoundsFunction";

import {LayerGroup} from "./LayerGroup";

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type ObjectReturnType = ReturnType<typeof Object>;
type LayerGroupReturnType = ReturnType<typeof  LayerGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
export type LayerOptionsReturnType = ReturnType<typeof String|typeof Boolean>;
type FunctionReturnType = ReturnType<typeof Function>;
type MapReturnType = ReturnType<typeof Map>;
// type LayerGroupReturnType = ReturnType<typeof LayerGroup>;
type EventReturnType= ReturnType<typeof Event>;
type LatLngBoundsReturnType= ReturnType<typeof LatLngBoundsClass | typeof LatLngBoundsFunction>;
type HTMLElementReturnType = ReturnType<typeof HTMLElement>;
// type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type pointReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

type GridLayerReturnType = ReturnType<typeof  FeatureGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type LayerReturnType = ReturnType<typeof  FeatureGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
// type LayerGroupReturnType = ReturnType<typeof  LayerGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

// type PointReturnType = ReturnType<typeof Point>;
type StringReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof Object.String>;
// type _roundReturnType = ReturnType<typeof  Point.prototype._round> | number | ReturnType<typeof Object.Number>;
// type roundReturnType = ReturnType<typeof  Point.prototype.round> | number | ReturnType<typeof Object.Number>;
// type floorReturnType = ReturnType<typeof  Point.prototype.floor> | number | ReturnType<typeof Object.Number>;

// type numberAuxX = ReturnType<typeof Object.Number>;

// type numberAuxY = ReturnType<typeof Object.Number>;

/*
 * @class Layer
 * @inherits Evented
 * @aka L.Layer
 * @aka ILayer
 *
 * A set of methods from the Layer base class that all Leaflet layers use.
 * Inherits all methods, options and events from `L.Evented`.
 *
 * @example
 *
 * ```tsc
 * const layer = L.marker(latlng).addTo(map);
 * layer.addTo(map);
 * layer.remove();
 * ```
 *
 * @event add: Event
 * Fired after the layer is added to a map
 *
 * @event remove: Event
 * Fired after the layer is removed from a map
 */


export const LayerFunction = Evented.extend({

	// Classes extending `L.Layer` will inherit the following options:
	options: {
		// @option pane: String = 'overlayPane'
		// By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
		pane: 'overlayPane',

		// @option attribution: String = null
		// String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
		attribution: null,

		bubblingMouseEvents: true
	},

	/* @section
	 * Classes extending `L.Layer` will inherit the following methods:
	 *
	 * @method addTo(map: Map|LayerGroup): this
	 * Adds the layer to the given map or layer group.
	 */
	addTo: function (map:MapReturnType|LayerGroupReturnType):MapReturnType|LayerGroupReturnType {
		map.addLayer(this);
		return this;
	},

	// @method remove: this
	// Removes the layer from the map it is currently active on.
	remove: function ():EventReturnType {
		return this.removeFrom(this._map || this._mapToAdd);
	},

	// @method removeFrom(map: Map): this
	// Removes the layer from the given map
	//
	// @alternative
	// @method removeFrom(group: LayerGroup): this
	// Removes the layer from the given `LayerGroup`
	removeFrom: function (obj: MapReturnType | LayerGroupReturnType): MapReturnType | LayerGroupReturnType {
		if (obj) {
			obj.removeLayer(this);
		}
		return this;
	},

	// @method getPane(name? : String): HTMLElement
	// Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
	getPane: function (name: StringReturnType):HTMLElementReturnType {
		return this._map.getPane(name ? (this.options[name] || name) : this.options.pane);
	},

	addInteractiveTarget: function (targetEl:HTMLElementReturnType) {
		this._map._targets[Util.stamp(targetEl)] = this;
		return this;
	},

	removeInteractiveTarget: function (targetEl:HTMLElementReturnType) {
		delete this._map._targets[Util.stamp(targetEl)];
		return this;
	},

	// @method getAttribution: String
	// Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
	getAttribution: function ():StringReturnType {
		return this.options.attribution;
	},

	_layerAdd: function (e:EventReturnType) {
		const map = e.target;

		// check in case layer gets added and then removed before the map is ready
		if (!map.hasLayer(this)) { return; }

		this._map = map;
		this._zoomAnimated = map._zoomAnimated;

		if (this.getEvents) {
			const events = this.getEvents();
			map.on(events, this);
			this.once('remove',  ():EventReturnType => {
				map.off(events, this);
			}, this);
		}

		this.onAdd(map);

		if (this.getAttribution && map.attributionControl) {
			map.attributionControl.addAttribution(this.getAttribution());
		}

		this.fire('add');
		map.fire('layeradd', {layer: this});
	}
});

/* @section Extension methods
 * @uninheritable
 *
 * Every layer should extend from `L.Layer` and (re-)implement the following methods.
 *
 * @method onAdd(map: Map): this
 * Should contain code that creates DOM elements for the layer, adds them to `map panes` where they should belong and puts listeners on relevant map events. Called on [`map.addLayer(layer)`](#map-addlayer).
 *
 * @method onRemove(map: Map): this
 * Should contain all clean up code that removes the layer's elements from the DOM and removes listeners previously added in [`onAdd`](#layer-onadd). Called on [`map.removeLayer(layer)`](#map-removelayer).
 *
 * @method getEvents(): Object
 * This optional method should return an object like `{ viewreset: this._reset }` for [`addEventListener`](#evented-addeventlistener). The event handlers in this object will be automatically added and removed from the map with your layer.
 *
 * @method getAttribution(): String
 * This optional method should return a string containing HTML to be shown on the `Attribution control` whenever the layer is visible.
 *
 * @method beforeAdd(map: Map): this
 * Optional method. Called on [`map.addLayer(layer)`](#map-addlayer), before the layer is added to the map, before events are initialized, without waiting until the map is in a usable state. Use for early initialization only.
 */


/* @namespace Map
 * @section Layer events
 *
 * @event layeradd: LayerEvent
 * Fired when a new layer is added to the map.
 *
 * @event layerremove: LayerEvent
 * Fired when some layer is removed from the map
 *
 * @section Methods for Layers and Controls
 */
Map.include({
	// @method addLayer(layer: Layer): this
	// Adds the given layer to the map
	addLayer: function (layer: LayerReturnType):LayerReturnType {
		if (!layer._layerAdd) {
			throw new Error('The provided object is not a Layer.');
		}

		const id = Util.stamp(layer);
		if (this._layers[id]) { return this; }
		this._layers[id] = layer;

		layer._mapToAdd = this;

		if (layer.beforeAdd) {
			layer.beforeAdd(this);
		}

		this.whenReady(layer._layerAdd, layer);

		return this;
	},

	// @method removeLayer(layer: Layer): this
	// Removes the given layer from the map.
	removeLayer: function (layer:LayerReturnType):LayerReturnType {
		const id = Util.stamp(layer);

		if (!this._layers[id]) { return this; }

		if (this._loaded) {
			layer.onRemove(this);
		}

		if (layer.getAttribution && this.attributionControl) {
			this.attributionControl.removeAttribution(layer.getAttribution());
		}

		delete this._layers[id];

		if (this._loaded) {
			this.fire('layerremove', {layer: layer});
			layer.fire('remove');
		}

		layer._map = layer._mapToAdd = null;

		return this;
	},

	// @method hasLayer(layer: Layer): Boolean
	// Returns `true` if the given layer is currently added to the map
	hasLayer: function (layer:LayerReturnType):boolean {
		return !!layer && (Util.stamp(layer) in this._layers);
	},

	/* @method eachLayer(fn: Function, context?: Object): this
	 * Iterates over the layers of the map, optionally specifying context of the iterator function.
	 * ```
	 * map.eachLayer(function(layer){
	 *     layer.bindPopup('Hello');
	 * });
	 * ```
	 */
	eachLayer: function (method:FunctionReturnType, context:ObjectReturnType) {
		for (const i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	_addLayers: function (layers:LayerReturnType[]) {
		layers = layers ? (Util.isArray(layers) ? layers : [layers]) : [];

		for (const i = 0, len = layers.length; i < len; i++) {
			this.addLayer(layers[i]);
		}
	},

	_addZoomLimit: function (layer:LayerReturnType) {
		if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
			this._zoomBoundLayers[Util.stamp(layer)] = layer;
			this._updateZoomLevels();
		}
	},

	_removeZoomLimit: function (layer:LayerReturnType) {
		const id = Util.stamp(layer);

		if (this._zoomBoundLayers[id]) {
			delete this._zoomBoundLayers[id];
			this._updateZoomLevels();
		}
	},

	_updateZoomLevels: function () {let minZoom = Infinity;let maxZoom = -Infinity;
		const oldZoomSpan = this._getZoomSpan();

		for (const i in this._zoomBoundLayers) {
			const options = this._zoomBoundLayers[i].options;

			minZoom = options.minZoom === undefined ? minZoom : Math.min(minZoom, options.minZoom);
			maxZoom = options.maxZoom === undefined ? maxZoom : Math.max(maxZoom, options.maxZoom);
		}

		this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
		this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;

		// @section Map state change events
		// @event zoomlevelschange: Event
		// Fired when the number of zoomlevels on the map is changed due
		// to adding or removing a layer.
		if (oldZoomSpan !== this._getZoomSpan()) {
			this.fire('zoomlevelschange');
		}

		if (this.options.maxZoom === undefined && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom) {
			this.setZoom(this._layersMaxZoom);
		}
		if (this.options.minZoom === undefined && this._layersMinZoom && this.getZoom() < this._layersMinZoom) {
			this.setZoom(this._layersMinZoom);
		}
	}
});
