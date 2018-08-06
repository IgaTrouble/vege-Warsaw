import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import SearchBar from './SearchBar';

class App extends Component {
	
	 constructor(props) {
        super(props);

        this.state = {
            map: '',
            info: '',
			markers: [
                {location: {
					lat: 52.237392,
					lng: 21.050441},
                    name: 'Vegan Ramen Shop'
                },
                {
					location:{
						lat: 52.245249,
						lng: 20.992986},
                    name: 'Falafel Bejrut'
                },
                {
					location:{
						lat: 52.239139,
						lng: 21.020089},
                    name: 'Falla'
                },
                {
					location:{
						lat: 52.226448,
						lng: 21.014997},
                    name: 'Krowarzywa'
                },
                {
					location:{
						lat: 52.225717,
						lng: 21.020050},
                    name: 'Edamame Vegan Sushi'
                },
                {
					location:{
						lat: 52.219006,
						lng: 21.018797},
                    name: 'Wegeguru'
                },
            ],
            virtualMarkers: []
        };
		this.initMap = this.initMap.bind(this);
        this.generateMarkers = this.generateMarkers.bind(this);
        this.openMarker = this.openMarker.bind(this);
    }

	 componentDidMount() {
        window.initMap = this.initMap;
        createMapLink('https://maps.googleapis.com/maps/api/js?key=AIzaSyDzR_AztRoEZxnlGC_GX_n0Yv8ReEgsA6A&callback=initMap');
    }
	
	var styles = [
    {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#444444"
            }
        ]
    },
    {
        featureType: "landscape",
        elementType: "all",
        stylers: [
            {
                color: "#fbeff0"
            }
        ]
    },
    {
        featureType: "poi",
        elementType: "all",
        stylers: [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "road",
        elementType: "all",
        stylers: [
            {
                saturation: -100
            },
            {
                lightness: 45
            }
        ]
    },
    {
        featureType: "road.highway",
        elementType: "all",
        stylers: [
            {
                visibility: "simplified"
            }
        ]
    },
    {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "transit",
        elementType: "all",
        stylers: [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "water",
        elementType: "all",
        stylers: [
            {
                color: "#f0dde3"
            },
            {
                visibility: "on"
            }
        ]
    }
]
	
	initMap() {
		let map;
		 // Constructor creates a new map - only center and zoom are required.
        map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: 52.237049, lng: 21.017532},
          zoom: 13,
		  styles: styles,
          mapTypeControl: false
        });
		
		var infowindow = new window.google.maps.InfoWindow({});

        this.setState({map: map, info: infowindow});
        this.generateMarkers(map);
    }
	
	
	
	
	generateMarkers(map) {
        let self = this;

        this.state.markers.forEach(marker => {
            let mark = new window.google.maps.Marker({
                position: marker.location,
                map: map,
                title: marker.name,
            });


            mark.addListener('click', function () {
                self.openMarker(mark);
            });

            let virtMarker = this.state.virtualMarkers;
            virtMarker.push(mark);

            this.setState({virtualMarkers: virtMarker});
	});
    
	}

    openMarker(marker = '') {
        const clientId = "VVPEFJC40SJDVH1YFRJS4IBNQ0GGZJY5X1XLHEA23H1LTVOQ\n";
        const clientSecret = "MEAM2N42L434P1MB1AJZFUHM5XAGMCDNGETUH5XNZIYEHOKI\n";
        const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";


        if (this.state.info.marker != marker) {
            this.state.info.marker = marker;
            this.state.info.open(this.state.map, marker);
            marker.setAnimation(window.google.maps.Animation.DROP);


            this.state.info.addListener('closeClick', function () {
                this.state.info.setMarker(null);
            });

            this.markerInfo(url);
        }
    } 
	
	

    markerInfo(url) {
        let self = this.state.info;
        let place;
        fetch(url)
            .then(function (resp) {
                if (resp.status !== 200) {
                    const err = "Can't load data.";
                 this.state.info.setContent(err);
                }
                resp.json().then(function (data) {
                    var place = data.response.venues[0];
                    let phone = '';

                    if (place.contact.formattedPhone) {
                        phone = "<p><b>Phone:</b> "+ place.contact.formattedPhone +"</p>";
                    }

                    let twitter = '';

                    if (place.contact.twitter) {
                        twitter = "<p><b>Phone:</b> "+ place.contact.twitter +"</p>";
                    }

                    var info =
                        "<div id='marker'>" +
                            "<h2>" + self.marker.title + "</h2>" +
                            phone +
                            twitter +
                            "<p><b>Address:</b> " + place.location.address + ", " + place.location.city + "</p>" +
                        "</div>";
                    self.setContent(info);
                });

                console.log(place);
            })
            .catch(function (err) {
                const error = "Can't load data.";
                self.setContent(error);
            });

    }	
	

    render() {
        return (
            <div>
                <header>
						<SearchBar handleQuery={this.handleQuery} />
                </header>
                <Map markers={this.state.markers}></Map>
            </div>
        );
    }
}
	
	
	function createMapLink(url) {
		let tag = window.document.getElementsByTagName('script')[0];
		let script = window.document.createElement('script');

		script.src = url;
		script.async = true;
		script.onerror = function () {
			document.write("Google Maps can't be loaded");
		};
		tag.parentNode.insertBefore(script, tag);
}	





export default App;
/*source map style https://snazzymaps.com/style/210762/pale-pink*/
