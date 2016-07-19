/**
 * Created by finnb on 7/2/16.
 */

var frameTask;
if (window.requestAnimationFrame) {
    frameTask = function(cb) {
        var _cb = function() { cb(); requestAnimationFrame(_cb); }
        _cb();
    };
} else if (window.webkitRequestAnimationFrame) {
    frameTask = function(cb) {
        var _cb = function() { cb(); webkitRequestAnimationFrame(_cb); }
        _cb();
    };
} else if (window.mozRequestAnimationFrame) {
    frameTask = function(cb) {
        var _cb = function() { cb(); mozRequestAnimationFrame(_cb); }
        _cb();
    };
} else {
    frameTask = function(cb) {
        setInterval(cb, 1000 / 60);
    }
}
window.frameTask = frameTask;

var initDone = false;
window.onload = function() {
    if (!initDone) {
        initDone = true;
        Game.init(); //Whatever game is loaded in the DOM will be initialized
        window.frameTask(Game.run); //Whatever game is loaded in the DOM will be ran
    }
}
