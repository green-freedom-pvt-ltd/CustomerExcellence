import React, { Component } from 'react';
import _ from "lodash";
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import { withGoogleMap, GoogleMap, Marker, Polyline } from "react-google-maps";



const GettingStartedGoogleMap = withGoogleMap(props => (

    <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={16}
        defaultCenter={props.markers[0].position}
        onClick={props.onMapClick}
        center={props.markers[0].position}
    >

        {/* {props.markers.map((marker, index) => 
    (
      <Marker
      {...marker}
      onRightClick={() => props.onMarkerRightClick(index)}
    />
  ))} */}



        {props.markers.map((marker, index) =>

            (
                <Marker
                    position={index === 0 || index === props.markers.length - 1 ? marker.position : null}
                    key={index}
                    onRightClick={() => props.onMarkerRightClick(index)}
                />
            )
        )
        }



        <Polyline
            path={props.markers.map((marker, index) => {

                return marker.position
            })}
            geodesic={true}
            options={{strokeColor:"#ff0000",strokeWeight:"5",strokeOpacity:"0.6"}}
            
          

        />


    </GoogleMap>
));

//var google = require('https://maps.googleapis.com/maps/api/js?key=AIzaSyAJ_3l2yAUYw9_QFvMIskjUbzF5GQ_eBQA');
export default class GoogleMap2 extends Component {




    render() {
        var finalData = [];
        function getLocation(state) {
            
            function combineBatch(n) {
                var location = {
                    position: {
                        lat: n.lat,
                        lng: n.lon
                    }

                }
                return location;
            }
            finalData = _.concat(finalData, _.reverse(_.map(state.location_array, combineBatch)));
            console.log("Final Data",finalData.length);
            return finalData;

        }

        if (this.props.location != null && this.props.location != "" && this.props.location.count > 0) {
            var state = this.props.location.results;
            console.log("DATA", this.props.location.results);
            var finalData = _.map(state, getLocation);
            console.log("Final Data",finalData);
            return (
                <div style={{ height: `100%` }}>

                    <GettingStartedGoogleMap
                        containerElement={
                            <div style={{ height: `100%` }} />
                        }
                        mapElement={
                            <div style={{ height: `100%` }} />
                        }
                        onMapLoad={_.noop}
                        onMapClick={_.noop}

                        onMarkerRightClick={_.noop}

                        markers={_.last(finalData)}

                    />
                </div>
            );
        }
        else {
            return (
                <div style={{ height: `100%` }}>

                    <h4>Location not available</h4>
                </div>
            );
        }
    }
}

