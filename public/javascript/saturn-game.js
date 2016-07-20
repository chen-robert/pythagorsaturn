/**
 * Created by finnb on 7/18/16.
 */

var Game = {fps:5, width:1080, height:720};

var frames = 0;

var jsonToMaze = function(json, material)
{
    var maze = new THREE.Object3D();        //Maze for the game
    var lineCount = json.Lines.length;      //Lines of the maze
    for (var i = 0; i < lineCount; i ++)
    {
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(json.Lines[i].A.x * 15, 0, json.Lines[i].A.y * 15));       //Create random lines
        lineGeometry.vertices.push(new THREE.Vector3(json.Lines[i].B.x * 15, 0, json.Lines[i].B.y * 15));
        maze.add(new THREE.Line(lineGeometry, material));       //Add liens to maze
    }
    return maze;
};

//This is a loop
Game.run = (function() {
    var once = true;          //If FPS does not fluctuate
    var skipTicks = 1000 / Game.fps;
    //maxFrameSkip = 10,
    var nextGameTick = (new Date).getTime();
    //lastGameTick;

    return function() {
        while ((new Date).getTime() > nextGameTick) {
            Game.update();
            nextGameTick += skipTicks;
            once = false;       //Looped more than once
        }

        if (once) {       //No fluctuations
            Game.draw((nextGameTick - (new Date).getTime()) / skipTicks); //Pass in elapsed time to be used later.
        } else {
            Game.draw(0);
        }

    };
})();

Game.init = function() {
    // SCENE
    this.scene = new THREE.Scene();
    // CAMERA
    //var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45;
    var ASPECT = this.width / this.height;
    var NEAR = 0.1;
    var FAR = 20000;
    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
    this.camera.position.set(0,500,0);
    this.camera.lookAt(this.scene.position);

    // RENDERER
    /*
    if ( Detector.webgl ) {
        this.renderer = new THREE.WebGLRenderer({antialias: true});
    }
    else {
        alert("Using Canvas Renderer");
        this.renderer = new THREE.CanvasRenderer();
    }
    */
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.width, this.height);
    this.container = document.getElementById( 'game' );
    this.container.appendChild(this.renderer.domElement);

    // EVENTS
    //THREEx.WindowResize(renderer, camera);
    //THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
    // CONTROLS
    //controls = new THREE.OrbitControls( camera, renderer.domElement );
    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,0);
    this.scene.add(light);

    // FLOOR
    var floorTexture = new THREE.ImageUtils.loadTexture( "../public/images/saturn-background.png" );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 2, 2 );
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    this.scene.add(floor);

    //Model Test
    var manager = new THREE.LoadingManager();

    /*
    // Detect if the audio context is supported by either vendor, else return null
    window.AudioContext = (window.AudioContext || window.webkitAudioContext || null);

    if (!AudioContext) {
        alert("AudioContext not supported! Continue without audio?");
    }
    else
    {
        // Create a new audio context.
        var audioContext = new AudioContext();

        // Create a AudioGainNode to control the main volume.
        var mainVolume = audioContext.createGain();
        // Connect the main volume node to the context destination.
        mainVolume.connect(audioContext.destination);

        loadAudio(audioContext, mainVolume, "../public/audio/test_mp3.mp3");
    }


    /* This would work if THREE.JS "AudioLoader.js" worked.
     manager.onProgress = function ( item, loaded, total ) {
     console.log( item, loaded, total );
     };


    loadObj(manager, "../public/models/test_obj.obj", function(object) {
        object.scale.x = 10;
        object.scale.y = 10;
        object.scale.z = 10;

        Game.scene.add(object);
        Game.person = object; //Test
    });
    */

    // SKYBOX/FOG
    var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
    var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    // scene.add(skyBox);
    this.scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

    // Using wireframe materials to illustrate shape details.
    //var darkMaterial = new THREE.MeshBasicMaterial( { color: 0xffffcc } );
    var testMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff });
    var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } );
    var multiMaterial = [ testMaterial, wireframeMaterial ];

    //Load map
    $.getJSON('../../saturnbackend/' + randomInt(0,9999) + '/?' + (new Date).getTime(), function(json) {
        Game.maze = jsonToMaze(json, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
        Game.scene.add(Game.maze);
    });

    // cube
    this.player = THREE.SceneUtils.createMultiMaterialObject(
        new THREE.CubeGeometry(10, 10, 10, 1, 1, 1),
        multiMaterial );
    this.player.position.set(0, 0, 0);
    this.player.castShadow = true;
    this.scene.add( this.player );
};

Game.update = function() {
    if (Math.random() > 0.5)
    {
        this.player.position.x += 15;
    }
    else
    {
        this.player.position.x -= 15;
    }
    if (Math.random() > 0.5)
    {
        this.player.position.z += 15;
    }
    else
    {
        this.player.position.z -= 15;
    }
};

Game.draw = function (time) {
    //Implement skipped ticks
    this.renderer.render( this.scene, this.camera );
};
