import React, { useState } from 'react';
import styled from 'styled-components';
import HeaderTabs from '../../components/HeaderTabs';
import KakaoMap from '../../components/KakaoMap';
import CourseCard from '../../components/CourseCard';

import { useTheme } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/styled-engine';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// 시 이름, 날짜는 선택한거 기반으로 가져다 쓰기
const travelInfo = {
  city: '대구',
  startDate: '2024.02.15',
  endDate: '2024.02.18',
};

// 스팟별 거리 (대중교통에 따라 계산해서 표시해 주어야합니다.)
const spotToSpot = [[14, 23], [30], [42]];

//코스 정보 한번에 받아오기(아래는 예시 데이터)
//받아올 때 마커이미지 url도 박아주자!!!
const courseInfo = [
  [
    {
      destinationId: 1,
      destinationCategory: '명소',
      destinationName: '수성못',
      destinationContent: '하이루',
      destinationPath: require('../../assets/image/kangwondo/강원-강릉.jpg'),
      lat: 37.503325874722,
      lng: 127.04403462366,
      markerImage: '',
    },
    {
      destinationId: 2,
      destinationCategory: '식당',
      destinationName: '맛있다',
      destinationContent: '하이루',
      destinationPath: require('../../assets/image/kangwondo/강원-속초.jpg'),
      lat: 37.49676829082603,
      lng: 127.0343494916394,
      markerImage: '',
    },
    {
      destinationId: 9,
      destinationCategory: '카페',
      destinationName: '카페다',
      destinationContent: '하이루',
      destinationPath: require('../../assets/image/kangwondo/강원-평창.jpg'),
      lat: 37.48815415066257,
      lng: 127.03606423768073,
      markerImage: '',
    },
  ],
  [
    {
      destinationId: 3,
      destinationCategory: '명소',
      destinationName: '식당이라고',
      destinationContent: '하이루',
      destinationPath: require('../../assets/image/kangwondo/강원-강릉.jpg'),
      lat: 37.506513372885955,
      lng: 127.07959372848626,
      markerImage: '',
    },
    {
      destinationId: 4,
      destinationCategory: '카페',
      destinationName: '맛있다니까',
      destinationContent: '하이루',
      destinationPath: require('../../assets/image/kangwondo/강원-삼척.jpg'),
      lat: 37.501911481748635,
      lng: 127.03933357219438,
      markerImage: '',
    },
  ],
  [
    {
      destinationId: 5,
      destinationCategory: '카페',
      destinationName: '카페카페라고',
      destinationContent: '하이루',
      destinationPath: require('../../assets/image/kangwondo/강원-영월.jpg'),
      lat: 37.50082377853314,
      lng: 127.03087380542581,
      markerImage: '',
    },
    {
      destinationId: 6,
      destinationCategory: '식당',
      destinationName: '맛있디거영',
      destinationContent: '하이루',
      destinationPath: require('../../assets/image/kangwondo/강원-인제.jpg'),
      lat: 37.48877081046816,
      lng: 127.01901317288296,
      markerImage: '',
    },
  ],
];

//데이터에 따라 마커 이미지 설정해주는 함수
const markerSet = courseInfo.forEach((el: any) => {
  let number = 1;
  el.forEach((ele: any) => {
    let color = '';
    if (ele.destinationCategory == '명소') color = 'orange';
    else if (ele.destinationCategory == '식당') color = 'pink';
    else color = 'red';
    ele.markerImage = require(`../../assets/image/marker/${color}marker${number}.png`);
    number++;
  });
});

//1일차 정보
const firstDate = [...courseInfo[0]];

//2일차 정보
const secondDate = courseInfo.length >= 2 ? [...courseInfo[1]] : null;

//3일차 정보
const thirdDate = courseInfo.length >= 3 ? [...courseInfo[2]] : null;

// 일자별로 순서대로 들어온 장소 ID를 조회 API요청하기
const BeforeConfirm = () => {
  const [selectedTab, setSelectedTab] = useState(1);

  const handleTabChange = (tabNumber: number) => {
    setSelectedTab(tabNumber);
  };
  const letters = ['1일차', '2일차', '3일차'];

  return (
    <StyledEngineProvider>
      <BoxContainer>
        <HeaderTabs
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          size={courseInfo.length}
          letters={letters}
        />
        <CourseMap>
          <TravelHeader>
            <HeaderTitle>{travelInfo.city}</HeaderTitle>
            <HeaderDate>
              {travelInfo.startDate} ~ {travelInfo.endDate}
            </HeaderDate>
          </TravelHeader>
          <TravelMap id="map">
            <KakaoMap dateCourse={courseInfo[selectedTab - 1]} />
          </TravelMap>
        </CourseMap>
        <EditBody>
          <EditButton disableRipple>편집</EditButton>
        </EditBody>
        <CourseBody>
          {courseInfo[selectedTab - 1].map((place: any, index: number) => (
            <CourseCard
              key={index}
              course={courseInfo[`${selectedTab - 1}`][index]}
              spotToSpot={spotToSpot[`${selectedTab - 1}`][index - 1]}
            />
          ))}
        </CourseBody>
      </BoxContainer>
    </StyledEngineProvider>
  );
};

const BoxContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 100px;
`;

const CourseMap = styled.div`
  max-width: 400px;
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
`;

const TravelHeader = styled.div`
  width: 90%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 5px;
  padding: 5px;
  font-family: 'Pretendard';
`;

const HeaderTitle = styled.div`
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  padding: 2px;
`;

const HeaderDate = styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  padding: 2px;
`;

const TravelMap = styled.div`
  width: 100%;
`;

const EditBody = styled.div`
  width: 90%;
  display: flex;
  justify-content: flex-end;
`;

const EditButton = styled(Button)`
  && {
    border: none;
    font-family: 'Pretendard';
    font-size: 16px;
    font-weight: bold;
    color: black;
  }
`;
const CourseBody = styled.div`
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default BeforeConfirm;
