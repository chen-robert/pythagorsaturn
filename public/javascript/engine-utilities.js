/**
 * Created by finnb on 7/2/16.
 */

var randomInt = function(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var objLoader;

var loadObj = function(manager, path, callback)
{
    if (objLoader == null) {
        objLoader = new THREE.OBJLoader(manager);
    }
    objLoader.load(path, function ( object ) {
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                //child.material.map = texture;
            }
        } );
        callback(object);
    } );
};

var svgLoader;

var loadSvg = function(manager, path, callback) {
    if (svgLoader == null)
    {
        var svgLoader = new THREE.SVGLoader(manager);
    }
    svgLoader.load(path,
        callback,
        function () {
            console.log("Loading SVG...");
        },
        function () {
            console.log("Error loading SVG!");
        });
}

var audioContext;
var loadedSounds = {};

var loadAudio = function(audioContext, mainVolume, path, name)
{
    this.audioContext = audioContext;

    // Create an object with a sound source and a volume control.
    var sound = {};
    sound.source = audioContext.createBufferSource();
    sound.volume = audioContext.createGain();

    // Connect the sound source to the volume control.
    sound.source.connect(sound.volume);
    // Hook up the sound volume control to the main volume.
    sound.volume.connect(mainVolume);

    // Make the sound source loop.
    sound.source.loop = true;

    // Load a sound file using an ArrayBuffer XMLHttpRequest.
    var request = new XMLHttpRequest();
    request.open("GET", path, true);
    request.responseType = "arraybuffer";
    request.onload = function(e) {

        // Create a buffer from the response ArrayBuffer.
        audioContext.decodeAudioData(this.response, function onSuccess(buffer) {
            sound.buffer = buffer;

            // Make the sound source use the buffer and start playing it.
            sound.source.buffer = sound.buffer;

            sound.source.start(audioContext.currentTime); //TEST

            loadedSounds[name] = sound; //Add the loaded sound to the array.
            //alert("Successfully loaded " + path);
        }, function onFailure() {
            alert("Decoding the audio buffer failed");
            loadedSounds[name] = null; //Add null to the array to signify failing to decode sound file.
        });
    };
    request.send();

    /* This would work if THREE.JS "AudioLoader.js" worked.
    if (audioLoader == null)
    {
        audioLoader = new THREE.OBJLoader(manager);
    }
    audioLoader.load(
        // resource URL
        path,
        // Function when resource is loaded
        function ( buffer ) {
            callback(buffer);
        },
        // Function called when download progresses
        function ( xhr ) {
            console.log( "Audio Resource: " + path + " " + Math.round(xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        // Function called when download errors
        function ( xhr ) {
            console.log( 'An error happened' );
            callback(null);
        }
    );
    */
};

/* Not needed because manually implemented
var audioListener;

var addAudioListener = function()
{
    if (audioListener == null) {
        audioListener = THREE.AudioListener();
        if (audioListener == null)
        {
            alert("Audio Listener still null after initialization");
        }
    }
    Game.camera.add(audioListener);
};
*/
