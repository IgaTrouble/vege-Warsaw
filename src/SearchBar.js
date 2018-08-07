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
        const {handleQuery} = this.props;
		const { locationsGoogle } = this.props;
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
                                placeholder="Filter" 
                                onChange={this.search}
                                onFocus={() => this.showList()}
                                />
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

export default SearchBar;		