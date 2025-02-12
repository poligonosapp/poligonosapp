/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-mixed-spaces-and-tabs */
// import {Server} from './Server';

// import {GeoJSON} from './layer';

import { LayerReturnType, Polygon } from "Leaflet";
import { PolygonClass } from "./layer/vector/PolygonClass";
import {Map} from "src/map/Map";
export public type MapReturnType = ReturnType<typeof Map>;

// declare module '@babel/preset-react';
// import("@babel/preset-react").then(
//	require => {
//		return require("@babel/preset-react");
//	}
// );

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html
function makeUnique<T>(
	collection: Set<T> | T[],
	comparer: (x: T, y: T) => string | Polygon
  ): Set<T> | T[] {
	// Early bail-out if we have a Set.
	// We assume the elements are already unique.
	if (collection instanceof Set) {
	  return collection;
	}
	// Sort the array, then remove consecutive duplicates.
	collection.sort(comparer);
	for (let i = 0; i < collection.length; i++) {
	  let j = i;
	  while (
		j < collection.length &&
		comparer(collection[i], collection[j + 1]) === 0
	  ) {
		j++;
	  }
	  collection.splice(i + 1, j - i);
	}
	return collection;
  }

const indexPolygonsArray = require('./polygons.geojson').split("},{", 3);

export const polygonsArray = require('./polygons.geojson');

// PoligonosApp(polygonsArray);

// for (let index in polygonsArray) {
//	const element = polygonsArray[index];
// }

export public const PoligonosApp = L.Class.extend({

	// A property with initial value = 42
	PoligonosAppProperty: makeUnique(polygonsArray),

	addInitHook : function(){
		const $ = require('jquery');
		$('div').addEventListener();
	},

	// A method
	myDemoMethod: function() {

		// const s = new Server();

		// ui

		return this.myDemoProperty;
	}

});

const PoligonosAppDemoInstance = PoligonosApp();

console.log( PoligonosAppDemoInstance.addEventListener() );

// This will output "42" to the development console
console.log( PoligonosAppDemoInstance.myDemoMethod() );

// include

PoligonosApp.include({

	// Adding a new property to the class
	_myPrivateProperty: 78,

	// Redefining a method
	PoligonosAppMethod: function() { return this._myPrivateProperty; }

});

const poligonosAppSecondDemoInstance = new PoligonosApp();

// This will output "78"
console.log( poligonosAppSecondDemoInstance.myDemoMethod() );

// However, properties and methods from before still exist
// This will output "42"
console.log( poligonosAppSecondDemoInstance.myDemoProperty );

// initialize
const MyBoxClass = L.Class.extend({

	options: {
		width: 1,
		height: 1
	},

	initialize: function(name:string, options:[]) {
		this.name = name;
		L.setOptions(this, options);
	}

});

function instanceRed(){
	const instance = new MyBoxClass('Red', {width: 10});

	console.log(instance.name); // Outputs "Red"
	console.log(instance.options.width); // Outputs "10"
	console.log(instance.options.height); // Outputs "1", the default
}

// initialize cube
const MyCubeClass = MyBoxClass.extend({
	options: {
		depth: 1
	}
});

function instanceBlue(){
	const instance = new MyCubeClass('Blue');

	console.log(instance.options.width); // Outputs "1", parent class default
	console.log(instance.options.height); // Outputs "1", parent class default
	console.log(instance.options.depth); // Outputs "1"
}

// initialize hook
MyBoxClass.addInitHook(function(){
	this._area = this.options.width * this.options.length;
});

// initialize include
MyCubeClass.include({
	_calculateVolume: function(arg1, arg2) {
		this._volume = this.options.width * this.options.length * this.options.depth;
	}
});

MyCubeClass.addInitHook('_calculateVolume', argValue1, argValue2);

// initialize parent class
L.FeatureGroup = L.LayerGroup.extend({

	addLayer: function (layer:LayerReturnType) {
        L.LayerGroup.prototype.addLayer.call(this, layer);
	},

	removeLayer: function (layer:LayerReturnType) {
        L.LayerGroup.prototype.removeLayer.call(this, layer);
	},
});

// initialize factories
function myBoxClass(name:string, options:[]) {
	return new MyBoxClass(name, options);
}

export type PoligonosAppReturnType = ReturnType<typeof PoligonosApp>;
export default PoligonosApp ;