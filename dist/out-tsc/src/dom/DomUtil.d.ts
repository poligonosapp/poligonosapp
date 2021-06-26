export declare const TRANSFORM: any;
export declare const TRANSITION: any;
export declare const TRANSITION_END: string;
export declare function get(id: any): any;
export declare function getStyle(el: any, style: any): any;
export declare function create(tagName: any, className: any, container: any): any;
export declare function remove(el: any): void;
export declare function empty(el: any): void;
export declare function toFront(el: any): void;
export declare function toBack(el: any): void;
export declare function hasClass(el: any, name: any): any;
export declare function addClass(el: any, name: any): void;
export declare function removeClass(el: any, name: any): void;
export declare function setClass(el: any, name: any): void;
export declare function getClass(el: any): any;
export declare function setOpacity(el: any, value: any): void;
export declare function testProp(props: any): any;
export declare function setTransform(el: any, offset: any, scale: any): void;
export declare function setPosition(el: any, point: any): void;
export declare function getPosition(el: any): any;
export declare const disableTextSelection: any;
export declare const enableTextSelection: any;
export declare function disableImageDrag(): void;
export declare function enableImageDrag(): void;
export declare function preventOutline(element: any): void;
export declare function restoreOutline(): void;
export declare function getSizedParentNode(element: any): any;
export declare function getScale(element: any): {
    x: number;
    y: number;
    boundingClientRect: any;
};