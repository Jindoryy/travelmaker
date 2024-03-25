import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  travelDetail,
  destinationDistance,
  destinationDetail,
} from '../../utils/axios/axios-travel';
import HeaderTabs from '../../components/HeaderTabs';
import KakaoMap from '../../components/KakaoMap';
import CourseCard from '../../components/CourseCard';
import useTravelInfo from '../../store/useTravelStore';

import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/styled-engine';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

//코스 정보 한번에 받아오기(아래는 예시 데이터)
//받아올 때 마커이미지 url도 박아주자!!!
// const courseInfo = [
//   [
//     {
//       destinationId: 1,
//       destinationType: '명소',
//       destinationName: '수성못',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-강릉.jpg'),
//       latitude: 37.503325874722,
//       longitude: 127.04403462366,
//       markerImage: '',
//     },
//     {
//       destinationId: 2,
//       destinationType: '식당',
//       destinationName: '맛있다',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-속초.jpg'),
//       latitude: 37.49676829082603,
//       longitude: 127.0343494916394,
//       markerImage: '',
//     },
//     {
//       destinationId: 9,
//       destinationType: '카페',
//       destinationName: '카페다',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-평창.jpg'),
//       latitude: 37.48815415066257,
//       longitude: 127.03606423768073,
//       markerImage: '',
//     },
//   ],
//   [
//     {
//       destinationId: 3,
//       destinationType: '명소',
//       destinationName: '식당이라고',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-강릉.jpg'),
//       latitude: 37.506513372885955,
//       longitude: 127.07959372848626,
//       markerImage: '',
//     },
//     {
//       destinationId: 4,
//       destinationType: '카페',
//       destinationName: '맛있다니까',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-삼척.jpg'),
//       latitude: 37.501911481748635,
//       longitude: 127.03933357219438,
//       markerImage: '',
//     },
//   ],
//   [
//     {
//       destinationId: 5,
//       destinationType: '카페',
//       destinationName: '카페카페라고',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-영월.jpg'),
//       latitude: 37.50082377853314,
//       longitude: 127.03087380542581,
//       markerImage: '',
//     },
//     {
//       destinationId: 6,
//       destinationType: '식당',
//       destinationName: '맛있디거영',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-인제.jpg'),
//       latitude: 37.48877081046816,
//       longitude: 127.01901317288296,
//       markerImage: '',
//     },
//   ],
// ];

//장소의 정보
interface CourseInfoType {
  destinationId: number;
  destinationType: string;
  destinationName: string;
  destinationImgUrl: string;
  latitude: number;
  longitude: number;
  markerImage: string;
}

//날짜별 정보
interface CourseDateInfo {
  courseDate: CourseInfoType[];
}

//여행 정보
interface TravelInfoType {
  travelInfo: CourseDateInfo[];
}

//장소 디테일 요청 id 리스트
interface DestinationIdList {
  destinationsIdList: number[];
}

//여행 정보(id, lat, lng, distance) 받아오기
interface Point {
  destinationId: number;
  latitude: number;
  longitude: number;
}
interface Destination {
  point: Point;
  nextDestinationDistance: number;
}

//장소 디테일 정보 받아오기
interface DestinationDetailResponse {
  destinationId: number;
  destinationType: string;
  destinationName: string;
  destinationImgUrl: string;
}

const BeforeConfirm = () => {
  const { setTravelInfo, travelInfo } = useTravelInfo();
  const [selectedTab, setSelectedTab] = useState(1);
  const [travelResponse, setTravelResponse] = useState<Destination[][]>();
  const [courseInfo, setCourseInfo] = useState<CourseInfoType[][]>([]);
  const [firstDate, setFirstDate] = useState<CourseDateInfo>();
  const [secondDate, setSecondDate] = useState<CourseDateInfo>();
  const [thirdDate, setThirdDate] = useState<CourseDateInfo>();
  const [destinationsIdList, setDestinationsIdList] = useState<DestinationIdList>();
  // const [destinationDetail, SetDestinationDetail] = useState<Destination>();
  const [spotToSpot, setSpotToSpot] = useState<number[][]>([]);
  const [idList, setIdList] = useState<number[][]>([]);
  const [idDetail, setIdDetail] = useState<DestinationDetailResponse[]>([]);

  const response = {
    status: 0,
    data: {
      travelList: [
        [
          {
            point: {
              destinationId: 0,
              latitude: 0,
              longitude: 0,
            },
            nextDestinationDistance: 0,
          },
        ],
      ],
    },
  };
  useEffect(() => {
    getTravel(travelInfo);
  }, []);

  const getTravel = (travelInfo: any) => {
    travelDetail(travelInfo)
      .then((response) => {
        const responseList = response.data.data.travelList;
        //코스 정보 담아주기
        if (responseList) {
          setTravelResponse(responseList);
          getDistance(responseList);
          console.log(travelResponse);
        }
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  };

  const getDistance = (travelList: Destination[][]) => {
    // spottospot거리 담아주기
    if (travelList) {
      for (let j = 0; j < travelList.length; j++) {
        const innerArray = [];
        const innerArrayforId = [];
        for (let i = 0; i < travelList[j].length; i++) {
          innerArray.push(travelList[j][i].nextDestinationDistance); // 내부 배열에 값을 추가합니다.
          innerArrayforId.push(travelList[j][i].point.destinationId);
        }
        spotToSpot.push(innerArray); // 완성된 내부 배열을 spotToSpot 배열에 추가합니다.
        idList.push(innerArrayforId);
      }
      setSpotToSpot(spotToSpot);
      console.log(spotToSpot);
      setIdList(idList);
      console.log(idList);
    }
  };

  useEffect(() => {
    getDestination();
  }, [travelResponse]);

  const getDestination = () => {
    for (let i = 0; i < idList.length; i++) {
      const destinationData = destinationDetail(idList[i]);

      if (destinationData) {
        const newArray: any = [];
        destinationData
          .then((response) => {
            newArray.push(response.data.data);
            idDetail.push(newArray);
            setIdDetail(idDetail);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };
const courseDetail: TravelInfoType = {
  travelInfo: [
    {
      courseDate: [
        {
          ...idDetail[0][0]
          latitude: 0,
          longitude: 0,
          markerImage: '...'
        },
        // 다른 장소들도 추가할 수 있습니다.
      ]
    },
    // 다른 날짜의 여행 정보도 추가할 수 있습니다.
  ]
};
  // useEffect(() => {
  //   if (courseInfo.length > 0) {
  //     setFirstDate([...courseInfo[0]]);
  //     if (courseInfo.length >= 2) setSecondDate([...courseInfo[1]]);
  //     if (courseInfo.length >= 3) setThirdDate([...courseInfo[2]]);
  //   }
  //   console.log(courseInfo);
  //   const markerSet = () => {
  //     let number = 1;
  //     const updatedCourseInfo = { ...courseInfo };
  //     for (const key in updatedCourseInfo) {
  //       if (Object.prototype.hasOwnProperty.call(updatedCourseInfo, key)) {
  //         updatedCourseInfo[key].forEach((element: any) => {
  //           let color = '';
  //           if (element.destinationType === '명소') color = 'orange';
  //           else if (element.destinationType === '식당') color = 'pink';
  //           else color = 'red';
  //           element.markerImage = require(`../../assets/image/marker/${color}marker${number}.png`);
  //           number++;
  //         });
  //       }
  //     }
  //     setCourseInfo(updatedCourseInfo);
  //   };
  // }, [courseInfo, firstDate, secondDate, thirdDate]);

  const handleTabChange = (tabNumber: number) => {
    setSelectedTab(tabNumber);
  };
  const letters = ['1일차', '2일차', '3일차'];

  return (
    <StyledEngineProvider>
      <BoxContainer>
        {/* <HeaderTabs
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          size={3}
          letters={letters}
        />
        <CourseMap>
          <TravelHeader>
            <HeaderTitle>{travelInfo.city}</HeaderTitle>
            <HeaderDate>
              {travelInfo.startDate} ~ {travelInfo.endDate}
            </HeaderDate>
          </TravelHeader> */}
        {/* <TravelMap id="map">
            <KakaoMap dateCourse={courseInfo[selectedTab - 1]} />
          </TravelMap> */}
        {/* </CourseMap> */}
        {/* <EditBody>
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
        </CourseBody> */}
      </BoxContainer>
    </StyledEngineProvider>
  );
};

const BoxContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
