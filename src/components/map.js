import React, { Component } from 'react';
import _ from "lodash";

import { withGoogleMap, GoogleMap, Marker, Polyline } from "react-google-maps";



const GettingStartedGoogleMap = withGoogleMap(props => (

    <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={16}
        defaultCenter={props.markers[0][0].finalData[0].position}
        onClick={props.onMapClick}
        center={props.markers[0][0].finalData[0].position}
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
                    position={index === 0 ? marker[0].finalData[0].position : null}
                    key={index}
                    onRightClick={() => props.onMarkerRightClick(index)}
                />
            )
        )
        }

        {props.markers.map((marker, index) =>

            (
                <Marker
                    position={index === props.markers.length - 1 ? marker[0].finalData[(marker[0].finalData.length - 1)].position : null}
                    key={index}
                    onRightClick={() => props.onMarkerRightClick(index)}
                />
            )
        )
        }
        

        {
            props.markers.map((marker, index) =>

                 (
                    
                    <Polyline
                        path={marker[0].finalData.map((finalData, index) => {

                            return finalData.position
                        })}
                        geodesic={true}
                        options={{strokeColor:"#ff0000",strokeWeight:"5",strokeOpacity:"0.6"}}
                        key = {index}
                    />
                    
                 )   
        )
        }

        {
            props.markers.map((marker, index) =>

                 (
                    
                    <Polyline
                        path={marker[1].finalData.map((finalData, index) => {

                            return finalData.position
                        })}
                        geodesic={true}
                        options={{strokeColor:"#416ef4",strokeWeight:"5",strokeOpacity:"0.8"}}
                        key = {index}
                    />
                 )   
        )
        }



    </GoogleMap>
));

//var google = require('https://maps.googleapis.com/maps/api/js?key=AIzaSyAJ_3l2yAUYw9_QFvMIskjUbzF5GQ_eBQA');
export default class GoogleMap2 extends Component {




    render() {
        var finalData = [];
        var finalDataObject = {};
        var last_location = null;

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
            // finalData = _.concat(finalData,_.map(state.location_array, combineBatch));
            finalData = _.map(state.location_array, combineBatch);
            var paused_data = [];
            var paused_data_object = {};
            finalDataObject = {finalData:_.reverse(finalData)};
            // console.log('paused_data',paused_data);
            // console.log("Final Data",finalData.length,finalDataObject);
            if (last_location){
                if(_.first(finalData)){
                    paused_data = [last_location, _.first(finalData)]
                } else {
                    paused_data = [last_location,last_location]
                }
                paused_data_object = {finalData:paused_data};
                console.log('paused_data',paused_data,paused_data_object);
            } else {
                paused_data = [ _.first(finalData), _.first(finalData)]
                paused_data_object = {finalData:paused_data};
            }
            last_location = _.last(finalData);
            finalDataObject = _.concat(finalDataObject,paused_data_object);
            //  concat paused_data
            return finalDataObject;

        }

        var state = this.props.location.results;
        console.log("DATA", this.props);
        finalData = _.map(state, getLocation);

        finalData = _.remove(finalData, function(n) {
              return n[0].finalData.length > 0;
            });
        console.log("Final Data",finalData);
        if (this.props.location != null && this.props.location != "" && this.props.location.count > 0 && finalData.length >0) {
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

                        // markers={_.last(finalData)}
                        markers={finalData}

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

