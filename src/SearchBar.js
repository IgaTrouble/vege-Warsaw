import React, { Component } from 'react';

class SearchBar extends Component {
	
	constructor() {
        super();

        this.state = {
            info: '',
            markers: [],
            query: ''
        };
    }

    componentDidMount() {
        this.setState({markers: this.props.virtualMarker});
    }

	  search = (event) => {
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
  
  
	
	//function show list of places
    showList() {
        let listFilter = document.getElementsByTagName('aside');
        if(listFilter[0]) {
            listFilter[0].classList.add('open')
        }
        
    }

	//function close list of places
	closeList() {
        let listFilter = document.getElementsByTagName('aside');
        listFilter[0].classList.remove('open')
    }

	
	
    render() {
        return (
            <nav className="searchBar">
                <div className="navbar-header">
                    <h1 tabIndex="0" className="site-name">My little vegan Warsaw</h1>
                    <div className="navbar-form navbar-left" role="search">
                        <div className="form-group">
                            <input 
                                aria-label="Input filter places:"
                                className="form-control" 
                                id="search-input" 
                                type="search"  
                                placeholder="Search" 
                                onChange={this.search}
                                onFocus={() => this.showList()}
                                />
                        </div>
                    </div>
					<aside className="list-box" >
						<h4 className="offscreen">List of favorites vegan places in Warsaw</h4>
						<button aria-label="Close button of the list"  id="close-btn" className="close-list-box-btn" onClick={() => this.closeList()}>
							X
						</button>
						<div className="list-box-content">
							   <ul tabIndex="0" role="tablist" aria-label="List of favorites vegan places in Warsaw" id="list-of-places">
								{this.state.markers && this.state.markers.length && this.state.markers.map((marker, i) =>
									<li key={i}>
										<a href="#" onKeyPress={this.props.openInfo.bind(this, marker)}
										   onClick={this.props.openInfo.bind(this, marker)}
										tabIndex="0" role="button">{marker.title}</a>
									</li>
								)}
							</ul>
						</div>
					</aside>
                </div>
            </nav>
			
        )
    }
}

export default SearchBar;		