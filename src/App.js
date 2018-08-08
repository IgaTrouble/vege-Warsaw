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
					lat: 52.237228,
					lng: 21.050329},
                    name: 'Vegan Ramen Shop'
                },
                {
					location:{
						lat: 52.245190,
						lng: 20.993429},
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
	 //info from Foursquare API
    openMarker(marker = '') {
		const clientId = "PWQYRTG2TEHWEYCHSSDWQLLDWQL0SFZ04NSKFHZWX4JW1AY1";
		const clientSecret = "ZXY4TK2L0CUMFQ40NM0QWGILKIXAKLZNQW4WZO21K0TGO3MV";
		const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        if (this.state.info.marker != marker) {
            this.state.info.marker = marker;
		//	this.state.info.setContent('<div>' + marker.title + '</div>');
			this.state.info.open(this.state.map, marker);
            marker.setAnimation(window.google.maps.Animation.DROP);


            this.state.info.addListener('closeClick', function () {
                this.state.info.setMarker(null);
            });
			this.addInfo(url);
        }
    } 
	
	addInfo(url) {
		const clientId = "PWQYRTG2TEHWEYCHSSDWQLLDWQL0SFZ04NSKFHZWX4JW1AY1";
		const clientSecret = "ZXY4TK2L0CUMFQ40NM0QWGILKIXAKLZNQW4WZO21K0TGO3MV";
		let self = this.state.info;
		let placeId;
		let place;
		let address;
		let tipsList = null;
		fetch(url)
			.then(function (resp) {
				if (resp.status !== 200) {
                    const err = ("Can't load more data.");
                 self.setContent(err);
                }
				resp.json().then(function (data) {
                    placeId = data.response.venues[0].id;
					place = data.response.venues[0];
					address = 
						"<h2 tabindex=1>" + self.marker.title + "</h2>" + "<p tabindex=1><b>Address:</b> " + place.location.address + ", " + place.location.city + "</p>";
					console.log(address);	
				return fetch('https://api.foursquare.com/v2/venues/' + placeId +'/tips?v=20180518&limit=4&client_id=' + clientId + "&client_secret=" + clientSecret);
				})
				.then(response => response.json())
				.then(dataTips => {
					tipsList = dataTips;
					return fetch("https://api.foursquare.com/v2/venues/" + placeId + "/photos?v=20180518&limit=2&client_id=" + clientId + "&client_secret=" + clientSecret);
				})
				.then(response => response.json())
				.then(dataPhotos => addPhotos(tipsList, dataPhotos))
				.catch(err => requestError(err, 'Foursquare'))
			});
			
	 function addPhotos(tipsList, dataPhotos, addressP) {
              let htmlResult = '';
			  if(tipsList && tipsList.response.tips.items){
				const tipsData = tipsList.response.tips.items;
				const photosData = dataPhotos.response.photos.items;
					htmlResult += address;
					console.log(htmlResult);
                  for(let i = 0; i < photosData.length; i++) {
                    const photo = photosData[i];
                    htmlResult += `<img alt="photo ${i + 1} by a visitor" style="width: 50%; margin-right: 5px;" src="${photo.prefix}150x150${photo.suffix}" />`;
                  }
			self.setContent(htmlResult);
            }
	}
	
	 function requestError(err, part) {
              console.log(err);
              self.setContent(`<p>Oh no! There was an error making a request for the ${part}.</p>`);
            } 
	
	
	
	}
    render() {
        return (
            <div role="main">
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
