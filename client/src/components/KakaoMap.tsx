import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const KakaoMap = ({ lat, lng, image }: any) => {
  const mapRef = useRef(null);
  // 선을 구성하는 좌표 배열
  const polyline: kakao.maps.LatLng[] = [];

  useEffect(() => {
    if (lat && lng && lat.length > 0 && lng.length > 0) {
      mapscript();
    }
  }, [lat, lng, image]);

  const mapscript = () => {
    const container = mapRef.current;
    if (!container) return;

    // 선을 구성하는 좌표 배열 리셋해주기
    const polyline: kakao.maps.LatLng[] = [];

    let options = {
      center: new kakao.maps.LatLng(lat[0], lng[0]),
      level: 7,
    };

    const map = new kakao.maps.Map(container, options);

    for (let i = 0; i < lat.length; i++) {
      new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(lat[i], lng[i]),
        image: new kakao.maps.MarkerImage(image[i], new kakao.maps.Size(30, 30)),
      });
    }

    //선 그리기
    for (let i = 0; i < lat.length; i++) {
      polyline.push(new kakao.maps.LatLng(lat[i], lng[i]));
    }

    const linePath = new kakao.maps.Polyline({
      path: polyline, // 선을 구성하는 좌표배열
      strokeWeight: 3, // 선의 두께
      strokeColor: '#F93053', // 선의 색깔
      strokeOpacity: 0.7, // 선의 불투명도. 1에서 0 사이의 값이며 0에 가까울수록 투명
      strokeStyle: 'solid', // 선의 스타일
    });
    linePath.setMap(map);
  };

  return <div ref={mapRef} style={{ width: '100%', height: '250px' }}></div>;
};

export default KakaoMap;
// import React, { useEffect, useState, useRef } from 'react';

// import styled from 'styled-components';

// import { Map, MapMarker } from 'react-kakao-maps-sdk';

// const KakaoMap = ({ lat, lng }: any) => {
//   useEffect(() => {
//     mapscript();
//   });
//   const mapRef = useRef(null);
//   // 선을 구성하는 좌표 배열
//   const polyline: kakao.maps.LatLng[] = [];
//   useEffect(() => {
//     mapscript();
//   }, [lat, lng]);

//   const mapscript = () => {
//     // 선을 구성하는 좌표 배열 리셋해주기
//     const polyline: kakao.maps.LatLng[] = [];
//     const container = mapRef.current;
//     if (!container) return;
//     let options = {
//       center: new kakao.maps.LatLng(37.503325874722, 127.04403462366),
//       level: 7,
//     };

//     //map
//     const map = new kakao.maps.Map(container, options);

//     //마커가 표시 될 위치
//     for (let i = 0; i < lat.length; i++) {
//       new kakao.maps.Marker({
//         map: map,
//         position: new kakao.maps.LatLng(lat[i], lng[i]),
//         // image: new kakao.maps.MarkerImage(el.markerImage, new kakao.maps.Size(30, 30)),
//       });
//     }

//     //선 그리기
//     for (let i = 0; i < lat.length; i++) {
//       polyline.push(new kakao.maps.LatLng(lat[i], lng[i]));
//     }

//     const linePath = new kakao.maps.Polyline({
//       path: polyline, // 선을 구성하는 좌표배열
//       strokeWeight: 3, // 선의 두께
//       strokeColor: '#F93053', // 선의 색깔
//       strokeOpacity: 0.7, // 선의 불투명도. 1에서 0 사이의 값이며 0에 가까울수록 투명
//       strokeStyle: 'solid', // 선의 스타일
//     });
//     linePath.setMap(map);
//   };

//   return <div ref={mapRef} style={{ width: '100%', height: '250px' }}></div>;
// };

// export default KakaoMap;
