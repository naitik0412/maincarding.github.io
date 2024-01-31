/*
 * AIT WordPress Theme
 *
 * Copyright (c) 2012, Affinity Information Technology, s.r.o. (http://ait-themes.com)
 */
/* Main Initialization Hook */
jQuery(document).ready(function() {
    gm_authFailure = function() {
        var apiBanner = document.createElement('div');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Read more");
        a.appendChild(linkText);
        a.title = "Read more";
        a.href = "https://www.ait-themes.club/knowledge-base/google-maps-api-error/";
        a.target = "_blank";

        apiBanner.className = "alert alert-info";
        var bannerText = document.createTextNode("Please check Google API key settings");
        apiBanner.appendChild(bannerText);
        apiBanner.appendChild(document.createElement('br'));
        apiBanner.appendChild(a);

        jQuery(".google-map-container").html(apiBanner);
    };

    /* menu.js initialization */
    desktopMenu();
    responsiveMenu();
    /* menu.js initialization */

    /* portfolio-item.js initialization */
    portfolioSingleToggles();
    /* portfolio-item.js initialization */

    /* custom.js initialization */
    renameUiClasses();
    removeUnwantedClasses();

    initWPGallery();
    initColorbox();
    initRatings();
    //initInfieldLabels();
    initSelectBox();

    notificationClose();
    /* custom.js initialization */

    /* Theme Dependent FIX Functions */
    searchEfect();
    /* Theme Dependent FIX Functions */
});
/* Main Initialization Hook */

jQuery(window).load(function() {

    addMapControls();

});

// Langwitch | Language Dropdown
function fixLanguageMenu() {
    if (isResponsive(640)) {
        // only run at 640px-
        jQuery('.language-icons a.current-lang').bind('touchstart MSPointerDown', function() {
            if (jQuery('.language-icons').hasClass('menu-opened')) {
                jQuery('.language-icons .language-icons__list').hide();
            } else {
                jQuery('.language-icons .language-icons__list').show();
            }
            jQuery('.language-icons').toggleClass('menu-opened');

            return false;
        });
    }
}


function searchEfect() {
    var pageTitle = jQuery('.page-title'),
        searchDiv = pageTitle.find('.site-search'),
        input = pageTitle.find('.search-field');

    input.on('focusin', function() {
        searchDiv.addClass('focused');
    });
    input.on('focusout', function() {
        searchDiv.removeClass('focused');
    });
}


/* Theme Dependenent Fix Function */



//todo: ak sa resizne okno a potom switchne mapa
function switchSingleTourMap(map) {
    var mapContainer = jQuery(".single-ait-tour .page-title #title-map-container");
    var width, width, top, right;

    if (mapContainer.hasClass('big')) {
        // width = mapContainer.attr("data-currentWidth");
        // height = mapContainer.attr("data-currentHeight");
        // top = mapContainer.attr("data-currentTop");
        // right = mapContainer.attr("data-currentRight");
        mapContainer.removeClass('big');

        // mapContainer.attr("width", width + "px");
        // mapContainer.attr("height", height + "px");
        // mapContainer.attr("top", top + "px");
        // mapContainer.attr("right", right + "px");

    } else {
        // width = mapContainer.attr("data-newWidth");
        // height = mapContainer.attr("data-newHeight");
        mapContainer.addClass('big');

        // mapContainer.attr("width", width + "px");
        // mapContainer.attr("height", height + "px");
        // mapContainer.attr("top", "0px");
        // mapContainer.attr("right", "0px");
    };
    var center = mapContainer.attr("data-currentCenter").replace('(', '').replace(')', '');

    center = center.split(",", 2);
    var lat = parseFloat(center[0].trim());
    var lng = parseFloat(center[1].trim());

    setInterval(function() {
        fixCenterMap(map, new google.maps.LatLng(lat, lng))
    }, 300);
    // fixCenterMap(map, new google.maps.LatLng(lat, lng));

    // mapContainer.animate(
    // {
    // 	width: width+'px',
    // 	height: height+'px',
    // 	top: top,
    // 	right: right
    // }, function(){
    // 		var center = mapContainer.attr("data-currentCenter").replace('(','').replace(')','');

    // 		center = center.split(",",2);
    // 		var lat = parseFloat(center[0].trim());
    // 		var lng = parseFloat(center[1].trim());
    // 		fixCenterMap(map, new google.maps.LatLng(lat, lng));
    //    	}
    // );
}


function addMapControls() {
    if (!jQuery('body').hasClass('single-ait-tour')) {
        return;
    }
    if (isResponsive(640)) {
        return;
    }
    var $titleMapContainer = jQuery('body.single-ait-tour #title-map-container');
    if ($titleMapContainer.hasClass('on-request')) {
        $titleMapContainer.find('.ait-sc-button').on('click', function(e) {
            e.preventDefault();
            createMapControls();
        });
    } else {
        createMapControls();
    }

}

function createMapControls() {
    var map = window.globalMaps['tour-title-map'].map;
    prepareSwitchMapData(map);
    // Create the DIV to hold the control and
    // call the ToggleControl() constructor passing
    // in this DIV.
    var toggleControlDiv = document.createElement('div');
    var toggleControl = new ToggleControl(toggleControlDiv, window.globalMaps['tour-title-cbox-map'].map);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(toggleControlDiv);
}

/**
 * The ToggleControl adds a control to the map.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function ToggleControl(controlDiv, map) {
    var containerID = jQuery(".single-ait-tour .page-title .google-map-container").attr('id');

    var switchButton = document.createElement('a');
    switchButton.href = "#";
    switchButton.className = "switch-map";
    jQuery(switchButton).append("<i class='fa fa-random'></i>");
    controlDiv.appendChild(switchButton);

    var cboxButton = document.createElement('a');
    cboxButton.href = "#colorbox-title-map-container";
    cboxButton.className = "inline fullsize-map-toggle";
    jQuery(cboxButton).append("<i class='fa fa-search-plus'></i>");
    controlDiv.appendChild(cboxButton);

    google.maps.event.addListenerOnce(map, 'idle', function() {
        var mapContainer = jQuery(".single-ait-tour .page-title #title-map-container");
        var center = mapContainer.attr("data-currentCenter").replace('(', '').replace(')', '');
        var zoom = parseInt(mapContainer.attr("data-currentZoom"));

        center = center.split(",", 2);
        var lat = parseFloat(center[0].trim());
        var lng = parseFloat(center[1].trim());
        jQuery(cboxButton).colorbox({
            inline: true,
            width: "90%",
            height: "90%",
            className: "colorbox-content-title-map",
            onComplete: function() {
                map.setOptions({
                    scrollwheel: true
                });
                map.setOptions({
                    disableDoubleClickZoom: true
                });
                map.setOptions({
                    zoom: zoom
                });
                fixCenterMap(map, new google.maps.LatLng(lat, lng));
            },
        });
    });


    google.maps.event.addDomListener(switchButton, 'click', function(e) {
        e.preventDefault();
        switchSingleTourMap(window.globalMaps['tour-title-map'].map);
    });
}



function prepareSwitchMapData(map) {
    // var thumbnailWrap = jQuery('.entry-thumbnail-wrap');
    var mapContainer = jQuery(".single-ait-tour .page-title #title-map-container");

    // mapContainer.attr("data-currentWidth", mapContainer.width());
    // mapContainer.attr("data-currentHeight", mapContainer.height());
    // mapContainer.attr("data-currentTop", mapContainer.css('top'));
    // mapContainer.attr("data-currentRight", mapContainer.css('right'));

    // mapContainer.attr("data-newWidth", thumbnailWrap.width());
    // mapContainer.attr("data-newHeight", thumbnailWrap.height());



    google.maps.event.addListenerOnce(map, 'idle', function() {
        mapContainer.attr("data-currentCenter", map.getCenter());
        mapContainer.attr("data-currentZoom", map.getZoom());

    });

    // jQuery(window).resize(function(){
    // 	mapContainer.attr("data-newWidth", thumbnailWrap.width());
    // 	mapContainer.attr("data-newHeight", thumbnailWrap.height());

    // 	// mapContainer.attr("data-currentWidth", mapContainer.width());
    // 	mapContainer.attr("data-currentHeight", mapContainer.height());
    // 	mapContainer.attr("data-currentTop", mapContainer.css('top'));
    // 	mapContainer.attr("data-currentRight", mapContainer.css('right'));
    // });
}



function fixCenterMap(map, center) {
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center);
}