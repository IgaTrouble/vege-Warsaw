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
						lat: 52.245289,
						lng: 20.992933},
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
		this.handleQuery = this.handleQuery.bind(this);
    }
	
	 handleQuery = (event) => {
        const query = event.target.value.toLowerCase();
        const markers = this.props.virtualMarker;
        const newMarkers = [];

        markers.forEach(function (marker) {
            if (marker.title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                marker.setVisible(true);
                newMarkers.push(marker);
            } else {
                marker.setVisible(false);
            }
        });

        this.setState({markers: newMarkers});
    }


	 componentDidMount() {
        window.initMap = this.initMap;
        createMapLink('https://maps.googleapis.com/maps/api/js?key=AIzaSyDzR_AztRoEZxnlGC_GX_n0Yv8ReEgsA6A&callback=initMap');
    }
	
	
	
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
        if (this.state.info.marker != marker) {
            this.state.info.marker = marker;
			this.state.info.setContent('<div>' + marker.title + '</div>');
            this.state.info.open(this.state.map, marker);
            marker.setAnimation(window.google.maps.Animation.DROP);


            this.state.info.addListener('closeClick', function () {
                this.state.info.setMarker(null);
            });
        }
    } 
	


    render() {
        return (
            <div>
                <header>
						<SearchBar 
						infoWindow={this.state.info}
                        openInfo={this.openMarker}
                        virtualMarker={this.state.virtualMarkers} />
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



export default App;
/*source map style https://snazzymaps.com/style/210762/pale-pink*/
