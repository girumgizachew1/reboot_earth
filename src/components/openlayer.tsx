'use client'
import React, { useEffect } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

const MapComponent = ({ mapUrl }:any) => {
    console.log(mapUrl);

  useEffect(() => {
    if (mapUrl) {
      const map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new XYZ({
              url: mapUrl,
            }),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
    }
  }, [mapUrl]);

  return <div id="map" style={{ width: '100%', height: '1000px' }}></div>;
};

export default MapComponent;
