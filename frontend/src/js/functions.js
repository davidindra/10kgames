// Custom functions to manipulate DOM etc

/**
 * Return element by ID
 * @param id: string; ID of element to be returned
 * @return object: element
 */
function id(id) {
    return document.getElementById(id);
}



/**
 * Show element
 */
Element.prototype.show = function() {
    this.style.display = "initial";
};



/**
 * Hide element
 */
Element.prototype.hide = function() {
    this.style.display = "none";
};



/**
 * Periodically change dots' number on loading screen
 */
 var dotNum = 0,
     maxDots = 5;
 setInterval(() => {
     let x = dotNum,
        max = maxDots-1;
     var dotnum = (x % (max*2) > (max - 1) ? (max - 1) - x % max : x % max + 1) + 1;
     id("loading-header").innerHTML = "Waiting for opponent<br>" + ".".repeat(dotnum);
     dotNum++;
 }, 300);
