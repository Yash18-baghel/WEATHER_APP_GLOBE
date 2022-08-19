import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useControl } from "react-map-gl";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

const Geocoder = (props) => {
    // console.log(process.env.REACT_APP_MAPBOX_ACCESS_TOKEN)
    const ctrl = new MapboxGeocoder({
        accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
        marker: false,
        collapsed: true,
        types: 'country,region,place,postcode,locality,neighborhood',
        setLimit: 5,


    })
    useControl(() => ctrl);
    // ctrl.on('results', (e) => {
    //     console.log(e)
    // })
    ctrl.on('result', (e) => {
        // console.log(e)
        props.onResult(e)
    })
    return null;
};

export default Geocoder