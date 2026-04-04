import React, { useState } from 'react';
import { Circle, LayerGroup, LayersControl, MapContainer, TileLayer } from 'react-leaflet'
import LeafletMap from '../../components/MapComponents/LeafletMap';

const MapView = () => {
  const [coords, setCorrds] = useState({
    latitude: 39.7837304,
    longitude: -100.4458825
  });
  const center = [28.61083509075127, 77.20513948860082]

  const [display_name, setName] = useState("");
  return <>
  <LeafletMap center={center} zoom={13} >



  </LeafletMap>


  </>

};

export default MapView;
