import * as React from 'react';
import styled from 'styled-components';

import { Map, MapMarker } from 'react-kakao-maps-sdk';

const KakaoMap = () => {
  return (
    <div>
      <Map
        center={{ lat: 37.503325874722, lng: 127.04403462366 }}
        style={{
          width: '100%',
          height: '250px',
        }}
      >
        <MapMarker
          position={{ lat: 37.503325874722, lng: 127.04403462366 }}
          image={{
            src: require('../assets/image/orangemarker.png'),
            size: {
              width: 30,
              height: 30,
            },
          }}
        ></MapMarker>
        <MapMarker
          position={{ lat: 37.54699, lng: 127.09598 }}
          image={{
            src: require('../assets/image/pinkmarker.png'),
            size: {
              width: 30,
              height: 30,
            },
          }}
        ></MapMarker>
        <MapMarker
          position={{ lat: 37.13312321, lng: 127.2342412 }}
          image={{
            src: require('../assets/image/redmarker.png'),
            size: {
              width: 30,
              height: 30,
            },
          }}
        ></MapMarker>
      </Map>
    </div>
  );
};

export default KakaoMap;
