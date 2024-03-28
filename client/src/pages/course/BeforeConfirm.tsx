// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   travelDetail,
//   destinationDistance,
//   destinationsListDetail,
// } from '../../utils/axios/axios-travel';
// import HeaderTabs from '../../components/HeaderTabs';
// import KakaoMap from '../../components/KakaoMap';
// import CourseCard from '../../components/CourseCard';
// import { useTravelInfo, useTravelCity } from '../../store/useTravelStore';

// import styled from 'styled-components';
// import { useTheme } from '@mui/material/styles';
// import { StyledEngineProvider } from '@mui/styled-engine';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';

// //코스 정보 한번에 받아오기(아래는 예시 데이터)
// //받아올 때 마커이미지 url도 박아주자!!!
// // const courseInfo = [
// //   [
// //     {
// //       destinationId: 1,
// //       destinationType: '명소',
// //       destinationName: '수성못',
// //       destinationImgUrl: require('../../assets/image/kangwondo/강원-강릉.jpg'),
// //       latitude: 37.503325874722,
// //       longitude: 127.04403462366,
// //       markerImage: '',
// //     },
// //     {
// //       destinationId: 2,
// //       destinationType: '식당',
// //       destinationName: '맛있다',
// //       destinationImgUrl: require('../../assets/image/kangwondo/강원-속초.jpg'),
// //       latitude: 37.49676829082603,
// //       longitude: 127.0343494916394,
// //       markerImage: '',
// //     },
// //     {
// //       destinationId: 9,
// //       destinationType: '카페',
// //       destinationName: '카페다',
// //       destinationImgUrl: require('../../assets/image/kangwondo/강원-평창.jpg'),
// //       latitude: 37.48815415066257,
// //       longitude: 127.03606423768073,
// //       markerImage: '',
// //     },
// //   ],
// //   [
// //     {
// //       destinationId: 3,
// //       destinationType: '명소',
// //       destinationName: '식당이라고',
// //       destinationImgUrl: require('../../assets/image/kangwondo/강원-강릉.jpg'),
// //       latitude: 37.506513372885955,
// //       longitude: 127.07959372848626,
// //       markerImage: '',
// //     },
// //     {
// //       destinationId: 4,
// //       destinationType: '카페',
// //       destinationName: '맛있다니까',
// //       destinationImgUrl: require('../../assets/image/kangwondo/강원-삼척.jpg'),
// //       latitude: 37.501911481748635,
// //       longitude: 127.03933357219438,
// //       markerImage: '',
// //     },
// //   ],
// //   [
// //     {
// //       destinationId: 5,
// //       destinationType: '카페',
// //       destinationName: '카페카페라고',
// //       destinationImgUrl: require('../../assets/image/kangwondo/강원-영월.jpg'),
// //       latitude: 37.50082377853314,
// //       longitude: 127.03087380542581,
// //       markerImage: '',
// //     },
// //     {
// //       destinationId: 6,
// //       destinationType: '식당',
// //       destinationName: '맛있디거영',
// //       destinationImgUrl: require('../../assets/image/kangwondo/강원-인제.jpg'),
// //       latitude: 37.48877081046816,
// //       longitude: 127.01901317288296,
// //       markerImage: '',
// //     },
// //   ],
// // ];

// //장소의 정보
// interface CourseInfoType {
//   destinationId: number;
//   destinationType: string;
//   destinationName: string;
//   destinationImgUrl: string;
//   latitude: number;
//   longitude: number;
//   markerImage: string;
// }

// //날짜별 정보
// interface CourseDateInfoType {
//   courseDate: CourseInfoType[];
// }

// //여행 정보
// interface TravelInfoType {
//   travelInfo: CourseDateInfoType[];
// }

// //장소 디테일 요청 id 리스트
// interface DestinationIdList {
//   destinationsIdList: number[];
// }

// //여행 정보(id, lat, lng, distance) 받아오기
// interface Point {
//   destinationId: number;
//   latitude: number;
//   longitude: number;
// }
// interface Destination {
//   point: Point;
//   nextDestinationDistance: number;
// }

// //장소 디테일 정보 받아오기
// interface DestinationDetailResponse {
//   destinationId: number;
//   destinationType: string;
//   destinationName: string;
//   destinationImgUrl: string;
// }

// const BeforeConfirm = () => {
//   const { setTravelInfo, travelInfo } = useTravelInfo();
//   const { setTravelCity, travelCity } = useTravelCity();
//   const [selectedTab, setSelectedTab] = useState(1);
//   const [travelResponse, setTravelResponse] = useState<Destination[][]>([]);
//   const [firstDate, setFirstDate] = useState<DestinationDetailResponse[]>([]);
//   const [secondDate, setSecondDate] = useState<DestinationDetailResponse[]>([]);
//   const [thirdDate, setThirdDate] = useState<DestinationDetailResponse[]>([]);
//   const [spotToSpot, setSpotToSpot] = useState<number[][]>([]);
//   const [idList, setIdList] = useState<number[][]>([]);
//   const [lati, setLati] = useState<number[][]>([]);
//   const [longi, setLongi] = useState<number[][]>([]);
//   const [markerImage, setMarkerImage] = useState<string[][]>([]);
//   const [courseDetail, setCourseDetail] = useState<CourseInfoType>({
//     destinationId: 1,
//     destinationType: 'sights',
//     destinationName: '바다',
//     destinationImgUrl: '',
//     latitude: 0,
//     longitude: 0,
//     markerImage: '',
//   });
//   const [courseDateInfo, setCourseDateInfo] = useState<CourseDateInfoType>({
//     courseDate: [courseDetail],
//   });

//   const [courseInfo, setCourseInfo] = useState<TravelInfoType>({
//     travelInfo: [courseDateInfo],
//   });

//   useEffect(() => {
//     console.log('11');
//     getTravel(travelInfo);
//   }, []);

//   useEffect(() => {
//     console.log('22');
//     getDestination();
//   }, [travelResponse]);

//   useEffect(() => {
//     console.log('33');
//     getCourseInfo();
//   }, [firstDate, secondDate, thirdDate]);

//   const getTravel = (travelInfo: any) => {
//     travelDetail(travelInfo)
//       .then((response) => {
//         const responseList = response.data.data.travelList;
//         //코스 정보(id, lat, lng, distance) 담아주기
//         if (responseList) {
//           setTravelResponse(responseList);
//           getIdandDistance(responseList);
//         }
//       })
//       .catch((error) => {
//         console.error('Error: ', error);
//       });
//   };

//   // idList를 변경하고자 할 때 호출하는 함수
//   const updateIdListandDistance = (
//     newIdList: number[][],
//     newDistanceList: number[][],
//     newLatiList: number[][],
//     newLongiList: number[][],
//   ) => {
//     setIdList(newIdList);
//     setSpotToSpot(newDistanceList);
//     setLati(newLatiList);
//     setLongi(newLongiList);
//   };

//   const getIdandDistance = (travelList: Destination[][]) => {
//     // spottospot거리, idlist, latlist, longilist 담아주기
//     if (travelList) {
//       const idArray = [];
//       const distanceArray = [];
//       const latiArray = [];
//       const longiArray = [];
//       for (let j = 0; j < travelList.length; j++) {
//         const innerArray = [];
//         const innerArrayforId = [];
//         const innerArrayforLat = [];
//         const innerArrayforLong = [];
//         for (let i = 0; i < travelList[j].length; i++) {
//           innerArray.push(travelList[j][i].nextDestinationDistance);
//           innerArrayforId.push(travelList[j][i].point.destinationId);
//           innerArrayforLat.push(travelList[j][i].point.latitude);
//           innerArrayforLong.push(travelList[j][i].point.longitude);
//         }
//         idArray.push(innerArrayforId);
//         distanceArray.push(innerArray);
//         latiArray.push(innerArrayforLat);
//         longiArray.push(innerArrayforLong);
//       }
//       console.log(latiArray[0].length);
//       updateIdListandDistance(idArray, distanceArray, latiArray, longiArray);
//     }
//   };

//   // idDetail를 변경하고자 할 때 호출하는 함수
//   const updateIdDetail = (newIdDetail: DestinationDetailResponse[], date: number) => {
//     if (date == 0) {
//       setFirstDate(newIdDetail);
//       console.log(firstDate);
//     } else if (date == 1) setSecondDate(newIdDetail);
//     else if (date == 2) setThirdDate(newIdDetail);
//     console.log(firstDate);
//     console.log(travelResponse);
//   };

//   const getDestination = () => {
//     console.log(idList.length);
//     for (let i = 0; i < idList.length; i++) {
//       //날짜별로 담아와야함
//       const destinations = destinationsListDetail(idList[i]);
//       console.log(destinations);
//       if (destinations) {
//         destinations
//           .then((response) => {
//             const newArray: any = [];
//             newArray.push(response.data.data);
//             console.log(newArray);
//             updateIdDetail(newArray, i);
//           })
//           .catch((err) => {
//             console.error(err);
//           });
//       }
//     }
//   };

//   const [newMarker, setNewMarker] = useState<string[]>([]);
//   const getCourseInfo = () => {
//     let number = 1;
//     for (let i = 0; i < firstDate.length; i++) {
//       let color: string = '';
//       if (firstDate[i].destinationType == 'sights') color = 'orange';
//       else if (firstDate[i].destinationType == 'food') color = 'pink';
//       else color = 'red';
//       newMarker.push(require(`../../assets/image/marker/${color}marker${number}.png`));
//       number++;
//     }
//     markerImage.push(newMarker);
//     setNewMarker([]);
//     number = 1;
//     for (let i = 0; i < secondDate.length; i++) {
//       let color: string = '';
//       if (secondDate[i].destinationType == 'sights') color = 'orange';
//       else if (secondDate[i].destinationType == 'food') color = 'pink';
//       else color = 'red';
//       newMarker.push(require(`../../assets/image/marker/${color}marker${number}.png`));
//       number++;
//     }
//     markerImage.push(newMarker);
//     setNewMarker([]);
//     number = 1;
//     for (let i = 0; i < thirdDate.length; i++) {
//       let color: string = '';
//       if (thirdDate[i].destinationType == 'sights') color = 'orange';
//       else if (thirdDate[i].destinationType == 'food') color = 'pink';
//       else color = 'red';
//       newMarker.push(require(`../../assets/image/marker/${color}marker${number}.png`));
//       number++;
//     }
//     markerImage.push(newMarker);
//   };

//   const handleTabChange = (tabNumber: number) => {
//     setSelectedTab(tabNumber);
//   };
//   const letters = ['1일차', '2일차', '3일차'];

//   return (
//     <StyledEngineProvider>
//       <BoxContainer>
//         <HeaderTabs
//           selectedTab={selectedTab}
//           onTabChange={handleTabChange}
//           size={3}
//           letters={letters}
//         />
//         <CourseMap>
//           <TravelHeader>
//             <HeaderTitle>{travelCity.city}</HeaderTitle>
//             <HeaderDate>
//               {travelInfo.startDate} ~ {travelInfo.endDate}
//             </HeaderDate>
//           </TravelHeader>
//           <TravelMap id="map">
//             <KakaoMap
//               lat={lati[selectedTab - 1]}
//               lng={longi[selectedTab - 1]}
//               image={markerImage[selectedTab - 1]}
//             />
//           </TravelMap>
//         </CourseMap>
//         <EditBody>
//           <EditButton disableRipple>편집</EditButton>
//         </EditBody>
//         {/* <CourseBody>
//           {courseInfo[selectedTab - 1].map((place: any, index: number) => (
//             <CourseCard
//               key={index}
//               course={courseInfo[`${selectedTab - 1}`][index]}
//               spotToSpot={spotToSpot[`${selectedTab - 1}`][index - 1]}
//             />
//           ))}
//         </CourseBody> */}
//       </BoxContainer>
//     </StyledEngineProvider>
//   );
// };

// const BoxContainer = styled(Box)`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: flex-start;
// `;

// const CourseMap = styled.div`
//   max-width: 400px;
//   width: 95%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   margin: auto;
// `;

// const TravelHeader = styled.div`
//   width: 90%;
//   height: 50px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   margin: 5px;
//   padding: 5px;
//   font-family: 'Pretendard';
// `;

// const HeaderTitle = styled.div`
//   width: 100%;
//   font-size: 20px;
//   font-weight: bold;
//   padding: 2px;
// `;

// const HeaderDate = styled.div`
//   width: 100%;
//   font-size: 16px;
//   font-weight: bold;
//   padding: 2px;
// `;

// const TravelMap = styled.div`
//   width: 100%;
// `;

// const EditBody = styled.div`
//   width: 90%;
//   display: flex;
//   justify-content: flex-end;
// `;

// const EditButton = styled(Button)`
//   && {
//     border: none;
//     font-family: 'Pretendard';
//     font-size: 16px;
//     font-weight: bold;
//     color: black;
//   }
// `;
// const CourseBody = styled.div`
//   width: 95%;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;

// export default BeforeConfirm;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { travelDetail, destinationDistance } from '../../utils/axios/axios-travel';
import HeaderTabs from '../../components/HeaderTabs';
import KakaoMap from '../../components/KakaoMap';
import CourseCard from '../../components/CourseCard';
import { useTravelInfo, useTravelCity } from '../../store/useTravelStore';

import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/styled-engine';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

//store에 저장된 여행 보내기
interface TravelInfo {
  startDate: string;
  endDate: string;
  friendTag: number[];
  transportation: string;
  destinationIdList: number[];
}

interface Point {
  destinationId: number;
  latitude: number;
  longitude: number;
}
//store에 저장된 여행 보내고 받는 리스폰스
interface TravelInfoType {
  point: Point;
  nextDestinationDistance: number;
  destinationName: string;
  destinationType: string;
  destinationUrl: string;
}
interface TravelResponseType {
  travelResponse: TravelInfoType[];
}
//코스 정보 한번에 받아오기(아래는 예시 데이터)
//받아올 때 마커이미지 url도 박아주자!!!
// const courseInfo = [
//   [
//     {
//       destinationId: 1,
//       destinationType: '명소',
//       destinationName: '수성못',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-강릉.jpg'),
//       lat: 37.503325874722,
//       lng: 127.04403462366,
//       markerImage: '',
//     },
//     {
//       destinationId: 2,
//       destinationType: '식당',
//       destinationName: '맛있다',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-속초.jpg'),
//       lat: 37.49676829082603,
//       lng: 127.0343494916394,
//       markerImage: '',
//     },
//     {
//       destinationId: 9,
//       destinationType: '카페',
//       destinationName: '카페다',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-평창.jpg'),
//       lat: 37.48815415066257,
//       lng: 127.03606423768073,
//       markerImage: '',
//     },
//   ],
//   [
//     {
//       destinationId: 3,
//       destinationType: '명소',
//       destinationName: '식당이라고',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-강릉.jpg'),
//       lat: 37.506513372885955,
//       lng: 127.07959372848626,
//       markerImage: '',
//     },
//     {
//       destinationId: 4,
//       destinationType: '카페',
//       destinationName: '맛있다니까',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-삼척.jpg'),
//       lat: 37.501911481748635,
//       lng: 127.03933357219438,
//       markerImage: '',
//     },
//   ],
//   [
//     {
//       destinationId: 5,
//       destinationType: '카페',
//       destinationName: '카페카페라고',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-영월.jpg'),
//       lat: 37.50082377853314,
//       lng: 127.03087380542581,
//       markerImage: '',
//     },
//     {
//       destinationId: 6,
//       destinationType: '식당',
//       destinationName: '맛있디거영',
//       destinationImgUrl: require('../../assets/image/kangwondo/강원-인제.jpg'),
//       lat: 37.48877081046816,
//       lng: 127.01901317288296,
//       markerImage: '',
//     },
//   ],
// ];

// //1일차 정보
// const firstDate = [...courseInfo[0]];

// //2일차 정보
// const secondDate = courseInfo.length >= 2 ? [...courseInfo[1]] : null;

// //3일차 정보
// const thirdDate = courseInfo.length >= 3 ? [...courseInfo[2]] : null;

// 일자별로 순서대로 들어온 장소 ID를 조회 API요청하기
const BeforeConfirm = () => {
  const { setTravelInfo, travelInfo } = useTravelInfo();
  const { setTravelCity, travelCity } = useTravelCity();
  const [selectedTab, setSelectedTab] = useState(1);
  const [travelResponse, setTravelResponse] = useState<any>();
  const [markerList, setMarkerList] = useState<any>();
  const [courseInfo, setCourseInfo] = useState<any>([[]]);
  const [firstDate, setFirstInfo] = useState<any>([]);
  const [key, setKey] = useState(0); // 새로운 key 상태 추가
  // 스팟별 거리 (대중교통에 따라 계산해서 표시해 주어야합니다.)
  const spotToSpot = [[14, 23], [30], [42]];

  useEffect(() => {
    getTravel(travelInfo);
  }, []);
  useEffect(() => {
    // courseInfo가 변경될 때마다 key를 업데이트
    setKey((prevKey) => prevKey + 1);
    console.log('코스인포 바뀜');
  }, [courseInfo]);
  const getTravel = (travelInfo: TravelInfo) => {
    travelDetail(travelInfo)
      .then((response) => {
        console.log(response.data.data);
        const travelLists = response.data.data.travelList;
        updateCourseInfo(travelLists);
        markerSet();
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  };
  const updateCourseInfo = (travelList: any[][]) => {
    const updatedCourseInfo = [...courseInfo];
    // travelList를 순회하면서 각각의 요소를 courseInfo에 추가합니다.
    travelList.forEach((destinationGroup, index) => {
      // destinationGroup은 여행 목적지 그룹입니다.
      if (!courseInfo[index]) {
        courseInfo[index] = []; // index에 해당하는 요소가 없다면 빈 배열을 추가합니다.
      }
      destinationGroup.forEach((destination) => {
        console.log(courseInfo);
        // destination은 각 목적지 정보입니다.
        // courseInfo의 해당 그룹에 목적지 정보를 추가합니다.
        courseInfo[index].push({
          destinationId: destination.point.destinationId,
          destinationType: destination.destinationType,
          destinationName: destination.destinationName,
          destinationImgUrl: destination.destinationImgUrl,
          lat: destination.point.latitude,
          lng: destination.point.longitude,
          markerImage: '', // 이 부분은 추가적인 작업이 필요하다면 수정하세요.
        });
      });
    });
    setCourseInfo(updatedCourseInfo);
  };

  const updateMarker = (travelList: any) => {
    const newArr: any[][] = [];
    for (let i = 0; i < travelList.length; i++) {
      for (let j = 0; j < travelList[i].length; j++) {
        const lat = travelList[i][j].point.latitude;
        const lng = travelList[i][j].point.longitude;
        newArr[i][j] = { lat, lng };
      }
    }
    setMarkerList(newArr);
  };
  useEffect(() => {
    console.log('marker');
    markerSet();
  }, [markerList]);
  // 데이터에 따라 마커 이미지 설정해주는 함수
  const markerSet = () => {
    courseInfo.forEach((el: any) => {
      let number = 1;
      el.forEach((ele: any) => {
        if (number >= 7) return;
        let color = '';
        if (ele.destinationType == 'sights') color = 'orange';
        else if (ele.destinationType == 'food') color = 'pink';
        else color = 'red';
        ele.markerImage = require(`../../assets/image/marker/${color}marker${number}.png`);
        number++;
      });
    });
  };

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
        <CourseMap key={key}>
          <TravelHeader>
            <HeaderTitle>{travelCity.city}</HeaderTitle>
            <HeaderDate>
              {travelInfo.startDate} ~ {travelInfo.endDate}
            </HeaderDate>
          </TravelHeader>
          <TravelMap id="map">
            <KakaoMap key={key} dateCourse={courseInfo[selectedTab - 1]} />
          </TravelMap>
        </CourseMap>
        <EditBody>
          <EditButton disableRipple>편집</EditButton>
        </EditBody>
        <CourseBody>
          {courseInfo[selectedTab - 1].map(
            (place: any, index: number) =>
              index <= 5 && (
                <CourseCard
                  key={index}
                  course={courseInfo[`${selectedTab - 1}`][index]}
                  spotToSpot={spotToSpot[`${selectedTab - 1}`][index - 1]}
                />
              ),
          )}
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
