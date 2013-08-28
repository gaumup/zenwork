//class OverlaysManager
OverlaysManager = new function () { //Singleton
    //private member
    var overlays = jQuery("<div id='overlays'></div>");

    this.show_overlays = function (/*jQuery*/obj) {
        if ( jQuery("#overlays").length > 0 && !jQuery("#overlays").hasClass("Hidden") ) { return false; }
        if ( jQuery("#overlays").length == 0 ) { //init conditions
            overlays.addClass("Hidden").appendTo(obj == undefined ? "body" : obj);
            overlays.css({
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 999999,
                width: "100%"
            });
            overlays.bind("click mousedown mouseup mousemove", function (e) { 
                return false;
            });
        }
        overlays.removeClass("Hidden").css({
            height: jQuery(document).height()
        });
    }
    this.hide_overlays = function () {
        overlays.addClass("Hidden");
    }
    this.get_overlays = function () { return overlays; }
    
    //constructor
    return function () {
    }()
}