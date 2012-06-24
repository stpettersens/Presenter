/*
Presenter demonstration using Canvas and JavaScript on
http://presenter.github.com/demo.html
Copyright (c) 2012 Sam Saint-Pettersen.
*/

window.onload = function() {

	// Demo base layer.
	var demo_base = document.getElementById("demo-base");
	var context_base = demo_base.getContext("2d");

	// Demo overlay layer.
	var demo_overlay = document.getElementById("demo-overlay");
	var context_overlay = demo_overlay.getContext("2d");

    var xbgp = new Image();
    var preview = new Image();

    xbgp.onload = function() {
   		context_base.drawImage(xbgp, 20, 100);
    };
    xbgp.src = "images/demo/xbgp.jpg";

    preview.onload = function() {
    	context_base.drawImage(preview, 465, 10);
    };
    preview.src = "images/demo/vid1.png";

    context_overlay.font = "italic 12pt Verdana";
    context_overlay.fillText("Demonstration", 5, 20);
};
