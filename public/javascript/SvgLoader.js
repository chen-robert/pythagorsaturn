/**
 * @author mrdoob / http://mrdoob.com/
 * @author zz85 / http://joshuakoo.com/
 */

THREE.SVGObject = function ( node ) {

    THREE.Object3D.call( this );

    this.node = node;

};

THREE.SVGObject.prototype = Object.create( THREE.Object3D.prototype );
THREE.SVGObject.prototype.constructor = THREE.SVGObject;

THREE.SVGLoader = function ( manager ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.SVGLoader.prototype = {

    constructor: THREE.SVGLoader,

    load: function ( url, onLoad, onProgress, onError ) {

        var scope = this;

        var parser = new DOMParser();

        var loader = new THREE.XHRLoader( scope.manager );
        loader.load( url, function ( svgString ) {

            var doc = parser.parseFromString( svgString, 'image/svg+xml' );  // application/xml

            onLoad( doc.documentElement );

        }, onProgress, onError );

    }

};