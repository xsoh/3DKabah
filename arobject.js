"use strict";

define(["lib/three.min", "OBJLoader"], function() {

    THREE.Matrix4.prototype.setFromArray = function(m) {
        return this.set(
          m[0], m[4], m[8], m[12],
          m[1], m[5], m[9], m[13],
          m[2], m[6], m[10], m[14],
          m[3], m[7], m[11], m[15]
        );
    }

    THREE.Object3D.prototype.transformFromArray = function(m) {
        this.matrix.setFromArray(m);
        this.matrixWorldNeedsUpdate = true;
    }

    function createContainer() {
        var model = new THREE.Object3D();
        model.matrixAutoUpdate = false;
        return model;
    }

    function createMarkerMesh(color, onLoad) {
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );

    };

    var texture = new THREE.Texture();
    var loader = new THREE.ImageLoader( manager );
                loader.load( 'assets/kabahUVMeshMap.png', function ( image ) {

                    texture.image = image;
                    texture.needsUpdate = true;

                } );

    var loader = new THREE.OBJLoader( manager );
    loader.load( 'assets/kabah.obj', function ( object ) {
        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                child.material.map = texture;

            }

        } );
        object.scale.x= 60;
        object.scale.y= 60;
        object.scale.z= 60;
        object.rotation.x = -1.58;
        object.position.y = 1;
        object.position.x = 5;
        onLoad(object);
    } );
    }

/*        function createMarkerMesh(color) {
        var geometry = new THREE.CubeGeometry( 100,100,100 );
        var material = new THREE.MeshPhongMaterial( {color:color, side:THREE.DoubleSide } );

        var mesh = new THREE.Mesh( geometry, material );                      
        mesh.position.z = -50;

        return mesh;
    }*/

    function createMarkerObject(params) {
        var modelContainer = createContainer();

        var modelMesh = createMarkerMesh(params.color,function ( object ) {
            modelContainer.add( object );
        });
        

        function transform(matrix) {
            modelContainer.transformFromArray( matrix );
        }

        return {
            transform: transform,
            model: modelContainer
        }
    }

    return {
        createMarkerObject:createMarkerObject
    }
});
