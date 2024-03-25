import React, { useEffect, useState, useRef } from 'react';

import styled from 'styled-components';

import { Map, MapMarker } from 'react-kakao-maps-sdk';

const KakaoMap = ({ dateCourse }: any) => {
  const mapRef = useRef(null);
  // 선을 구성하는 좌표 배열
  const polyline: kakao.maps.LatLng[] = [];
  useEffect(() => {
    mapscript();
  }, [dateCourse]);

  const mapscript = () => {
    // 선을 구성하는 좌표 배열 리셋해주기
    const polyline: kakao.maps.LatLng[] = [];
    const container = mapRef.current;
    if (!container) return;
    let options = {
      center: new kakao.maps.LatLng(37.503325874722, 127.04403462366),
      level: 7,
    };

    //map
    const map = new kakao.maps.Map(container, options);

    //마커가 표시 될 위치
    dateCourse.forEach((el: any) => {
      new kakao.maps.Marker({
        map: map,
        title: el.destinationName,
        position: new kakao.maps.LatLng(el.latitude, el.longitude),
        image: new kakao.maps.MarkerImage(el.markerImage, new kakao.maps.Size(30, 30)),
      });
    });

    //선 그리기
    dateCourse.forEach((el: any) => {
      polyline.push(new kakao.maps.LatLng(el.latitude, el.longitude));
    });

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
