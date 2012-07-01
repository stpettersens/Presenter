/*
Presenter demonstration using Canvas and JavaScript on
http://presenter.github.com/demo.html
Copyright (c) 2012 Sam Saint-Pettersen.

NOTE:

Requires jQuery 1.2+ (used 1.7.2) for calculating offsets
in mouse X and Y positions over the canvas overlay.
*/

// Globals
var gDemoOverlay;
var gContextOverlay;

// Define a Caption 'class'.
function Caption(message, color, x, y) {

    // Properties
    this.message = message;
    this.color = color;
    this.x = x;
    this.y = y;

    // Methods
    this.draw = function() { 

        gContextOverlay.beginPath();
        gContextOverlay.rect(this.x, this.y, 180, 40);
        gContextOverlay.fillStyle = this.color;
        gContextOverlay.fill();
        gContextOverlay.lineWidth = 0.5;
        gContextOverlay.strokeStyle = "#505050";
        gContextOverlay.stroke();

        gContextOverlay.font = "10pt Verdana";
        gContextOverlay.fillStyle = "#000000";
        gContextOverlay.fillText(this.message, this.x + 10, this.y + 25);

        console.log(gContextOverlay + " Drew caption: "  + "\'" + this.message + "\' in " 
        + this.color + " at " + x + "," + this.y + ".");
    };
    this.remove = function() {
        // This actually clears the entire overlay canvas,
        // but this is invoked with {button}.remove() in showCaption(event).
        var width = gDemoOverlay.width;
        gDemoOverlay.width = width + 1;
        width = gDemoOverlay.width;
        gDemoOverlay.width = width - 1;
    };
}

// Show a caption; linked to event listener for 'mousemove'.
function showCaption(event) {

    var y = new Caption("Y button - Show caption", "#FFFF66", 270, 90);
    var x = new Caption("X button - Pause video", "#3399FF", 128, 155);
    var a = new Caption("A button - Play video", "#99CC66", 265, 225);
    var b = new Caption("B button - Exit player", "#FF3333", 402, 155);
    var rb = new Caption("RB - Increase volume", "#A8A8A8", 270, 70);
    var lb = new Caption("LB - Decrease volume", "#A8A8A8", 40, 70);
    var rs = new Caption("RS [Click] - Sticky capt.", "#A8A8A8", 265, 240);
    var ls = new Caption("LS [Up] - Next video", "#A8A8A8", 40, 130);

    // Use event or window.event object.
    var e  = event || window.event;

    // Calculate X and Y from offsets (uses jQuery).
    var offset = $("#demo-overlay").offset();
    var mouseX = e.pageX - offset.left;
    var mouseY = e.pageY - offset.top;

    // Show Y button caption.
    if(mouseX > 339 && mouseX < 370 && mouseY > 130 && mouseY < 161)  {
        y.remove();
        y.draw();
    }
    // Show X button caption.
    else if(mouseX > 307 && mouseX < 337 && mouseY > 161 && mouseY < 193) {
        x.remove();
        x.draw();
    }
    // Show A button caption.
    else if(mouseX > 336 && mouseX < 369 && mouseY > 138 && mouseY < 228) {
        a.remove();
        a.draw();
    }
    // Show B button caption.
    else if(mouseX > 372 && mouseX < 403 && mouseY > 160 && mouseY < 194) {
        b.remove();
        b.draw();
    }
    // Remove caption on hover away.
    else y.remove();

    console.log(mouseX + ", " + mouseY);
}

// Entry function, called when page loads.
window.onload = function() {

	// Demo base layer.
	var demoBase = document.getElementById("demo-base");
	var contextBase = demoBase.getContext("2d");

	// Demo overlay layer.
	gDemoOverlay = document.getElementById("demo-overlay");
	gContextOverlay = gDemoOverlay.getContext("2d");

    var xbgp = new Image();
    var preview = new Image();

    // Load Xbox 360 gamepad image.
    xbgp.onload = function() {
   		contextBase.drawImage(xbgp, 20, 100);
    };
    xbgp.src = "images/demo/xbgp.jpg";

    // Load preview monitor image.
    preview.onload = function() {
    	contextBase.drawImage(preview, 465, 10);
    };
    preview.src = "images/demo/vid1.png";

    // Load "Demonstration" permanent caption.
    contextBase.font = "italic 12pt Verdana";
    contextBase.fillText("Demonstration", 5, 20);

    gDemoOverlay.addEventListener("mousemove", showCaption, false);
};
