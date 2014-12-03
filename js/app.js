$(document).ready(function () {

function initialize () {
	var mapOptions = {
		zoom: 4,
		center: new google.maps.LatLng(37, -96) //geographic center of USA
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

	setMarkers(map, nationalParks);

}

var nationalParks = [
	['Shenandoah National Park', 38.29275579999999, -78.6795836, 1],
	['Great Smoky Mountains National Park', 35.61193129999999, -83.54965659999999, 2],
	['Grand Canyon National Park', 36.1069652, -112.1129972, 3],
	['Yosemite National Park', 37.8651011, -119.5383294, 4],
	['Mount Rainier National Park', 46.8799663, -121.7269094, 5],
	['Arches National Park', 38.733081, -109.59251389999997, 6],
	['Zion National Park', 37.322817, -113.0457164, 7],
	['Yellowstone National Park', 44.4620852, -110.64244109999998, 8],
	['Death Valley National Park', 36.4643308, -116.86906640000001, 9],
	['Glacier National Park', 48.7596128, -113.78702250000003, 10],
	['Redwood National Park', 41.213181, -124.004631, 11],
	['Hot Springs National Park', 34.516271, -93.04722, 12],
	['Badlands National Park', 43.783431, -102.369298, 13],
	['Mesa Verde National Park', 37.230873, -108.461834, 14],
	['Carlsbad Caverns National Park', 32.1753, -104.4439, 15],
	['Joshua Tree National Park', 33.7884, -115.8982, 16],
	['Crater Lake National Park', 42.9118, -122.1481, 17],
	['Rocky Mountain National Park', 40.3333, -105.7089, 18],
	['Channel Islands National Park', 34.0083, -119.4167, 19],
	['Big Bend National Park', 29.2500, -103.2500, 20],
	['Everglades National Park', 25.3167, -80.9333, 21],
	['Acadia National Park', 44.3500, -68.2167, 22],
	['Olympic National Park', 47.9694, -123.4986, 23],
	['Sequoia National Park', 36.5647, -118.7734, 24]
];



function setMarkers(map, locations) { 

	var icon = {
    		url: 'images/tree-icon.png',
    		scaledSize: new google.maps.Size(24, 36),
    		origin: new google.maps.Point(0, 0),
    		anchor: new google.maps.Point(12, 36)
    };

    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  	};

	for (var i = 0; i < locations.length; i++) { 
		var park = locations[i];
    	var myLatLng = new google.maps.LatLng(park[1], park[2]);
    	var marker = new google.maps.Marker({
        	position: myLatLng,
        	map: map,
        	icon: icon,
        	shape: shape,
        	title: park[0],
        	zIndex: park[3]
    	});
    	
    	var noSpaces = park[0].replace(/\s+/g, '');

    	bindEvent(marker, park, i);

	}	

}


function bindEvent (marker, park, i) {
	google.maps.event.addListener(marker, 'click', function () {
			$('#map-canvas').hide();
			$('#map-wrapper').hide();
			$('#results').show();
			var noSpaces = park[0].replace(/\s+/g, '');
			taggedPics(noSpaces, 0, 19);
			$('#head').html('#' + noSpaces).css({'font-size':'40px','text-align':'center',
	'margin-bottom':'15px'});
	});
}


google.maps.event.addDomListener(window, 'load', initialize);


$("#footer").on('click', function () {
	location.reload();
});

/* start Instagram API section below */
var taggedPics = function (tagname, start, limit) {
	$.ajax({
		type: 'GET',
		url: 'https://api.instagram.com/v1/tags/' + tagname + '/media/recent?client_id=138b8c2930b34bb997878b1d2b081f92',
		tag: tagname,
		dataType: "jsonp"
	})
	.done(function(taggedPics) {
		for (j = start; j <= limit; j++) {
			var photo = document.createElement("div");
			var img = document.createElement("img");
			var imgData = document.createElement("div");
			var caption = document.createElement("div");
			console.log(taggedPics);

			photo.className = "photo";
			imgData.className = "imgData";
			caption.className = "caption";

			if (taggedPics.data.length <= j) {
				$("#results").html("#" + tagname);
				$('#results').append(photo);
				$('#results .photo').last().append(img);
				$('#results .photo').last().append(imgData);
				$('#results .photo').last().append(caption);
			} else {
				var date = new Date(taggedPics.data[j].created_time*1000);	
					var formatted = "Posted on " +date.toString();

					img.src = taggedPics.data[j].images.low_resolution.url;
					//if statement to handle if caption is blank
					if(taggedPics.data[j].caption != null) { 
					  	caption.innerHTML = taggedPics.data[j].caption.text;
					} else {
					  caption.innerHTML = "<br><br>";
					}
					imgData.innerHTML = formatted;

					//create photo frame with picture, caption, and time posted inside
					$('#results').append(photo);
					$('#results .photo').last().append(img);
					$('#results .photo').last().append(caption);
					$('#results .photo').last().append(imgData);
			}
		};
	});
};


});