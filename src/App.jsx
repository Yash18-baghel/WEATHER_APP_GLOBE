import React, { Component } from 'react'
import './App.css';
import location from "./location.jpg"
import { Room, Star, StarBorder } from "@material-ui/icons";
import Geocoder from './Geocoder';
import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';
import Map, { Marker, Popup, FullscreenControl, GeolocateControl, NavigationControl } from 'react-map-gl';
import axios from 'axios';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ViewState: {
        latitude: '',
        longitude: '',
        zoom: 10
      },
      CurrentViewState: {
        latitude: '',
        longitude: '',
      },
      NewViewState: {},
      NewPlaceWeather: {},
      ShowNewState: true,
      ShowCurrentState: true,
      currentPlaceWeather: {}
    };

  }

  componentDidMount() {
    let lat, lon
    navigator.geolocation.getCurrentPosition((loc) => {
      lat = loc.coords.latitude
      lon = loc.coords.longitude
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_ACCESS_TOKEN}`)
        .then((res) => this.setState({
          ViewState: {
            ...this.state.ViewState,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
          },
          CurrentViewState: {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
          },
          currentPlaceWeather: res.data
        }))
        .catch((er) => console.log(er))

    })

  }
  showNewState = () =>{
    this.setState({ShowNewState:!this.state.ShowNewState})
  }

  showCurrentState = () =>{
    this.setState({ShowCurrentState:!this.state.ShowCurrentState})
  }

  hanleSearch = (data) => {

    let long = data.result.geometry.coordinates[0]
    let lat = data.result.geometry.coordinates[1]
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_ACCESS_TOKEN}`)
      .then((res) => this.setState({
        ViewState: {
          ...this.state.ViewState,
          latitude: lat,
          longitude: long
        },
        NewViewState: {
          latitude: lat,
          longitude: long
        },
        NewPlaceWeather: res.data,
        ShowNewState:true
      }))
      .catch((er) => console.log(er))

  }
  handlClick = (e) => {
    let lat = e.lngLat.lat
    let lon = e.lngLat.lng

    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_ACCESS_TOKEN}`)
      .then((res) => this.setState({
        ViewState: {
          ...this.state.ViewState,
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng
        },
        NewViewState: {
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng
        },
        NewPlaceWeather: res.data,
        ShowNewState:true
      }))
      .catch((er) => console.log(er))

  }
  render() {
   
    return (
      <div className="App">

        {this.state.ViewState.latitude && (
          <>
            <Map
              {...this.state.ViewState}
              crossSourceCollisions={true}
              className="map"
              initialViewState={{
                longitude: this.state.ViewState.longitude,
                latitude: this.state.ViewState.latitude,
                zoom: this.state.ViewState.zoom
              }}
              onDblClick={this.handlClick}
              doubleClickZoom={false}
              onMove={(e) => { this.setState({ ViewState: e.viewState }) }}
              mapboxAccessToken={process.env.NODE_ENV.REACT_APP_MAP_TOKEN}
              style={{ width: "100vw", height: "100vh" }}
              mapStyle="mapbox://styles/mapbox/streets-v9"

            >
              <Geocoder onResult={this.hanleSearch}  />
              <GeolocateControl />
              <FullscreenControl />
              <NavigationControl position={'bottom-right'} />
              <Marker onClick={this.showCurrentState} style={{cursor:'pointer'}}  longitude={this.state.CurrentViewState.longitude} latitude={this.state.CurrentViewState.latitude} color="tomato" anchor="top" ></Marker>
              {this.state.ShowCurrentState && ( <Popup longitude={this.state.CurrentViewState.longitude} latitude={this.state.CurrentViewState.latitude}
                anchor="left"
                closeButton={false}
                closeOnClick={false}
                style={{ borderRadius: "5%" }}
              >
                <div className="popup px-2 w-100">
                  <h2 className='mt-2'>{this.state.currentPlaceWeather.name}</h2>
                  <h1 className=' '>{this.state.currentPlaceWeather.main.temp}°C</h1>
                  <p><span className='font-weight-bold'>Humidity</span>  : {this.state.currentPlaceWeather.main.humidity}% </p>
                  <p><span className='font-weight-bold'>Wind Speed</span> : <span>{this.state.currentPlaceWeather.wind.speed}</span> m/s (<span id='direction'>{this.state.currentPlaceWeather.wind.deg} °N</span>)</p>
                  <p><span className='font-weight-bold'>Pressure</span> : {this.state.currentPlaceWeather.main.pressure} ATMs</p>
                </div>
              </Popup>)}
              {this.state.NewViewState.longitude &&
                (
                  <>
                    <Marker style={{cursor:'pointer'}} onClick={this.showNewState} longitude={this.state.NewViewState.longitude} latitude={this.state.NewViewState.latitude} anchor="top"></Marker>
                    {this.state.ShowNewState && (
                      <Popup longitude={this.state.NewViewState.longitude} latitude={this.state.NewViewState.latitude}
                      anchor="right"
                      closeButton={false}
                      closeOnClick={false}
                    >
                      <div className="popup px-2 w-100">
                        <h2 className='mt-2'>{this.state.NewPlaceWeather.name}</h2>
                        <h1 className=''>{this.state.NewPlaceWeather.main.temp}°C</h1>
                        <p><span className='font-weight-bold'>Humidity</span>  : {this.state.NewPlaceWeather.main.humidity}% </p>
                        <p><span className='font-weight-bold'>Wind Speed</span> : <span>{this.state.NewPlaceWeather.wind.speed}</span> m/s (<span id='direction'>{this.state.NewPlaceWeather.wind.deg} °N</span>)</p>
                        <p><span className='font-weight-bold'>Pressure</span> : {this.state.NewPlaceWeather.main.pressure} ATMs</p>
                      </div>
                    </Popup>
                    )}
                  </>
                )
              }
            </Map>

          </>

        )}

      </div>
    )
  }
}
