/*
Presenter demonstration using Canvas element and JavaScript on
http://presenter.github.com/demo.html
Copyright (c) 2012 Sam Saint-Pettersen.

NOTE:

Requires jQuery 1.2+ (used: 1.7.2) for calculating offsets
in mouse X and Y positions over the canvases.
*/

// Globals.
var gDemoUI, gContextUI, gDemoOverlay, gContextOverlay;
var gIndex = 1;
var gSticky = false;

// Define a Caption 'class'.
function Caption(message, color, x, y) {

    // Properties.
    this.message = message;
    this.color = color;
    this.x = x;
    this.y = y;

    // Methods.
    this.draw = function() { 
        // Draw the caption, using the parameters provided.
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

        /*console.log(gContextOverlay + " Drew caption: "  + "\'" + this.message + "\' in " 
        + this.color + " at " + x + "," + this.y + ".");*/
    };
    this.remove = function() {
        // This actually clears the entire overlay canvas,
        // but this is invoked with {button}.remove() in showCaption(event).
        gContextOverlay.clearRect(0, 0, gDemoOverlay.width, gDemoOverlay.height);
    };
}

// Define a user interface (UI) component 'class'.
function UIComponent(message, x, y) {

    // Properties.
    this.message = message;
    this.x = x;
    this.y = y;

    // Methods.
    this.draw = function() {
        // Draw the UI component, using the parameters provided.
        gContextUI.font = "8pt Verdana";
        gContextUI.fillStyle = "#FFFFFF";
        gContextUI.fillText(this.message, this.x, this.y);
    };
    this.update = function(message) {
        // Remove and then set text.
        this.remove();
        this.message = message;
        gContextUI.font = "8pt Verdana";
        gContextUI.fillStyle = "#FFFFFF";
        gContextUI.fillText(this.message, this.x, this.y);
    };
    this.fadeout = function() {
        window.setTimeout(this.remove, 3000);
    }
    this.remove = function() {
        // This actually clears the entire UI canvas,
        // but this is invoked with {component}.remove() in controlBehavior(event).
        gContextUI.clearRect(0, 0, gDemoUI.width, gDemoUI.height);
    };
}

// Show a caption; linked to event listener for 'mousemove'.
function showCaption(event) {

    // Define captions objects.
    var y = new Caption("Y button - Show caption", "#FFFF66", 270, 90);
    var x = new Caption("X button - Pause video", "#3399FF", 128, 155);
    var a = new Caption("A button - Play video", "#99CC66", 265, 225);
    var b = new Caption("B button - Exit player", "#FF3333", 402, 155);
    var rb = new Caption("RB - Increase volume", "#A8A8A8", 270, 70);
    var lb = new Caption("LB - Decrease volume", "#A8A8A8", 25, 70);
    var ls = new Caption("LS [Up] - Next video", "#A8A8A8", 20, 110);
    /*
    var lsm = new Caption("LS [Click] - Unsticky info.", "#A8A8A8", 8, 150);
    var rs = new Caption("RS [Click] - Sticky info.", "#A8A8A8", 320, 235);
    */

    // Use event or window.event object.
    var e  = event || window.event;

    // Calculate X and Y from offsets (uses jQuery).
    var offset = $("#demo-overlay").offset();
    var mouseX = e.pageX - offset.left;
    var mouseY = e.pageY - offset.top;

    y.remove();

    // Show Y button caption.
    if(mouseX > 339 && mouseX < 370 && mouseY > 130 && mouseY < 161)  {
        y.draw();
    }
    // Show X button caption.
    else if(mouseX > 307 && mouseX < 337 && mouseY > 161 && mouseY < 193) {;
        x.draw();
    }
    // Show A button caption.
    else if(mouseX > 336 && mouseX < 369 && mouseY > 196 && mouseY < 228) {
        a.draw();
    }
    // Show B button caption.
    else if(mouseX > 372 && mouseX < 403 && mouseY > 160 && mouseY < 194) {
        b.draw();
    }
    // Show RB caption.
    else if(mouseX > 317 && mouseX < 377 && mouseY > 99 && mouseY < 109) {
        rb.draw();
    }
    // Show LB caption.
    else if(mouseX > 94 && mouseX < 139 && mouseY > 99 && mouseY < 109) {
        lb.draw();
    }
    // Show LS (top) caption.
    else if(mouseX > 80 && mouseX < 126 && mouseY > 147 && mouseY < 164) {
        ls.draw();
    }
    /*// Show LS (middle) caption.
    else if(mouseY > 80 && mouseX < 126 && mouseY > 169 && mouseY < 206) {
        lsm.draw();
    }*/
    /*// Show RS caption.
    else if(mouseX > 259 && mouseX < 321 && mouseY > 224 && mouseY < 280) {
        rs.draw();
    }*/

    /*console.log("%i, %i", mouseX, mouseY);*/
}

// Control behavior of preview monitor; linked to event listener for 'click'.
function controlBehavior(event)
{
    // Define video titles, authors and index.
    var videoTitles = [ "Autumn Day", "JavaScript Uncovered", "Max Payne 3 trailer" ];
    var videoAuthors = [ "A.B Peabody", "Karl Schultz", "Rockstar Games" ];

    // Define initial video title and author.
    var title = new UIComponent(videoTitles[gIndex-1], 470, 39);
    var author = new UIComponent(videoAuthors[gIndex-1], 470, 50);

    // Use event or window.event object.
    var e  = event || window.event;

    // Calculate X and Y from offsets (uses jQuery).
    var offset = $("#demo-ui").offset();
    var mouseX = e.pageX - offset.left;
    var mouseY = e.pageY - offset.top;

    if(!gSticky) title.remove();

    // Show video title and author (Y button action).
    if(mouseX > 339 && mouseX < 370 && mouseY > 130 && mouseY < 161)  {
        if(!gSticky) {
            title.draw();
            author.draw();
        }
    }
    // Pause video (X button action).
    else if(mouseX > 307 && mouseX < 337 && mouseY > 161 && mouseY < 193) {
        if(!gSticky) title.update("Paused.");
    }
    // Play video (A button action).
    else if(mouseX > 336 && mouseX < 369 && mouseY > 196 && mouseY < 228) {
        if(!gSticky) title.update("Playing.");
    }
    // Exit player (B button).
    else if(mouseX > 372 && mouseX < 403 && mouseY > 160 && mouseY < 194) {
        window.location.href = "./";
    }
    // Increase volume (RB action).
    else if(mouseX > 317 && mouseX < 377 && mouseY > 99 && mouseY < 109) {
        if(!gSticky) title.update("Volume+");
    }
    // Decrease volume (LB action).
    else if(mouseX > 94 && mouseX < 139 && mouseY > 99 && mouseY < 109) {
        if(!gSticky) title.update("Volume-");
    }
    // Next video (LS up action).
    else if(mouseX > 80 && mouseX < 126 && mouseY > 147 && mouseY < 164) {
        if(gIndex < videoTitles.length) gIndex++;
        else gIndex = 1;
        drawBackground(gIndex);
        /*console.log("Video: %i of %i", gIndex, videoTitles.length);*/
    }
    /*// Unsticky video information. (LS click action).
    else if(mouseY > 80 && mouseX < 126 && mouseY > 169 && mouseY < 206) {
        gStick = false;
    }
    // Show sticky video information. (RS click action).
    else if(mouseX > 259 && mouseX < 321 && mouseY > 224 && mouseY < 280) {
            gSticky = true;
            title.draw();
            author.draw();
    }*/

    if(!gSticky) title.fadeout();

    /*console.log("Sticky: %b", gSticky);*/
}

// Draw background (gamepad, preview monitor, etc.) to base canvas.
function drawBackground(vidIndex) {

    // Demo base layer.
    var demoBase = document.getElementById("demo-base");
    var contextBase = demoBase.getContext("2d");

    // Images.
    var xbgp = new Image();
    var preview = new Image();

    // First clear the base canvas.
    contextBase.clearRect(0, 0, demoBase.width, demoBase.height);

    // Load Xbox 360 gamepad image.
    xbgp.onload = function() {
        contextBase.drawImage(xbgp, 20, 100);
    };
    xbgp.src = "images/demo/xbgp.jpg";

    // Load preview monitor image.
    preview.onload = function() {
        contextBase.drawImage(preview, 465, 10);
    };
    preview.src = "images/demo/vid" + vidIndex + ".png";

    // Load "Demonstration" permanent caption.
    contextBase.font = "italic 12pt Verdana";
    contextBase.fillText("Demonstration", 5, 20);
}

// Entry function, called when page loads.
window.onload = function() {

    // Demo UI layer.
    gDemoUI = document.getElementById("demo-ui");
    gContextUI = gDemoUI.getContext("2d");

	// Demo overlay layer.
	gDemoOverlay = document.getElementById("demo-overlay");
	gContextOverlay = gDemoOverlay.getContext("2d");

    // Draw background to base layer.
    drawBackground(1);

    // Add event handlers for 'mousemove' and 'click', respectively.
    gDemoOverlay.addEventListener("mousemove", showCaption, false);
    gDemoOverlay.addEventListener("click", controlBehavior, false);
};
