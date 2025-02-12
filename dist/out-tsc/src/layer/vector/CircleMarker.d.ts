import { LatLng } from '../../geo/LatLng';
import { Object, ReturnType } from "typescript";
import { Point } from "../geometry";
import * as L from './Leaflet';
declare type NumberReturnType = ReturnType<typeof Point.prototype.clone> | number | ReturnType<typeof Object.Number> | ReturnType<typeof Point>;
declare type LatLngReturnType = ReturnType<typeof LatLng>;
export declare type MapReturnType = ReturnType<typeof L.Map>;
export declare const CircleMarker: any;
export declare function circleMarker(latlng: LatLngReturnType, options: NumberReturnType): any;
export {};
