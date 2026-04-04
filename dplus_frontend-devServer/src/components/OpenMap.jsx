import React, { useState } from 'react';
import { Circle, LayerGroup, LayersControl, MapContainer, TileLayer } from 'react-leaflet'
// import Map from '../../components/Map';
// import MapOpenLayer from '../../components/MapOpenLayer';

const OpenMap = () => {
  const [coords, setCorrds] = useState({
    latitude: 39.7837304,
    longitude: -100.4458825
  });
  const center = [28.61083509075127, 77.20513948860082]

  const [display_name, setName] = useState("");
  return <>
    <MapContainer center={[40.505, -100.09]} className='h-full' zoom={13} >

      {/* <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}

      <TileLayer
        attribution='OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* <LayersControl.Overlay checked name="Layer group with circles">
        <LayerGroup>
          <Circle
            center={center}
            pathOptions={{ fillColor: 'blue' }}
            radius={2000}
          />
          <Circle
            center={center}
            pathOptions={{ fillColor: 'red' }}
            radius={1000}
            stroke={false}
          />
          <LayerGroup>
            <Circle
              center={[51.51, -0.08]}
              pathOptions={{ color: 'green', fillColor: 'green' }}
              radius={100}
            />
          </LayerGroup>
        </LayerGroup>
      </LayersControl.Overlay> */}


      <LayersControl position="topright">
        <LayersControl.Overlay checked name="Layer group with circles">
          <LayerGroup>
            <Circle
              center={center}
              pathOptions={{ fillColor: 'blue' }}
              radius={200}
            />
            <Circle
              center={center}
              pathOptions={{ fillColor: 'red' }}
              radius={100}
              stroke={false}
            />
            <LayerGroup>
              <Circle
                center={[51.51, -0.08]}
                pathOptions={{ color: 'green', fillColor: 'green' }}
                radius={100}
              />
            </LayerGroup>
          </LayerGroup>
        </LayersControl.Overlay>
        {/* <LayersControl.Overlay name="Feature group">
          <FeatureGroup pathOptions={{ color: 'purple' }}>
            <Popup>Popup in FeatureGroup</Popup>
            <Circle center={[51.51, -0.06]} radius={200} />
            <Rectangle bounds={rectangle} />
          </FeatureGroup>
        </LayersControl.Overlay> */}
      </LayersControl>
    </MapContainer>



    {/* <Map coords={coords} display_name={display_name} /> */}
    {/* <MapOpenLayer coords={coords} display_name={display_name} />   */}


  </>
};

export default OpenMap;
