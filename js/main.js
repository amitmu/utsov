'use scrict';

jQuery(window).load(function () {
    jQuery("#loader").fadeOut("slow");
})

/* affix the navbar after scroll below header */
/*$('#nav').affix({
      offset: {
        top: $('header').height()
      }
});	*/

jQuery(document).ready(function () {

    // create a LatLng object containing the coordinate for the center of the map
    var latlng = new google.maps.LatLng(40.566373, -74.382668);

    // prepare the map properties
    var options = {
        zoom: 15,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        navigationControl: true,
        mapTypeControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true
    };

    // initialize the map object
    var map = new google.maps.Map(document.getElementById('map_canvas'), options);

    // add Marker
    var marker1 = new google.maps.Marker({
        position: latlng,
        map: map
    });

    // add listener for a click on the pin
    google.maps.event.addListener(marker1, 'click', function () {
        infowindow.open(map, marker1);
    });

    // add information window
    var infowindow = new google.maps.InfoWindow({
        content: '<div class="info"><strong>Our Registered Office</strong><br/><br/>31 RICHARD ROAD,<br/> EDISON, NJ 08820.</div>'
    });

    jQuery('#nav-main [href^=#]').click(function (e) {
      e.preventDefault();
      var div = jQuery(this).attr('href');
      jQuery("html, body").animate({
        scrollTop: $(div).position().top
      }, "slow");
    });


});




