import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { travelDetail, travelSave } from '../../utils/axios/axios-travel';
import HeaderTabs from '../../components/common/HeaderTabs';
import KakaoMap from '../../components/course/KakaoMap';
import CourseCard from '../../components/course/CourseCard';
import { useTravelCity, useTravelSave } from '../../store/useTravelStore';
import useUserInfo from '../../store/useUserStore';

import styled from 'styled-components';
import { StyledEngineProvider } from '@mui/styled-engine';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoadingComponent from '../../components/common/LoadingComponent';

//store에 저장된 여행 보내기
interface TravelInfo {
  startDate: string;
  endDate: string;
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

// 일자별로 순서대로 들어온 장소 ID를 조회 API요청하기
const BeforeConfirm = () => {
  const { setTravelCity, travelCity } = useTravelCity();
  const travelSaveStore = useTravelSave();
  const [selectedTab, setSelectedTab] = useState(1);
  const [courseInfo, setCourseInfo] = useState<any>([[]]);
  const [firstDate, setFirstDate] = useState<any>([]);
  const [secondDate, setSecondDate] = useState<any>([]);
  const [thirdDate, setThirdDate] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<any>([...firstDate]);
  const [key, setKey] = useState(0);
  const [size, setSize] = useState(courseInfo.length);
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();

  useEffect(() => {
    if (!userInfo || userInfo.userId === -1) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    getTravel({
      startDate: travelSaveStore.travel.startDate,
      endDate: travelSaveStore.travel.endDate,
      transportation: travelSaveStore.travel.transportation,
      destinationIdList: travelSaveStore.travel.courseList,
    });
    console.log(travelSaveStore.travel);
  }, []);

  useEffect(() => {
    if (selectedTab == 3) setSelectedDate([...thirdDate]);
    else if (selectedTab == 2) setSelectedDate([...secondDate]);
    else if (selectedTab == 1) setSelectedDate([...firstDate]);
  }, [selectedTab, courseInfo]);

  const getTravel = (travelInfo: TravelInfo) => {
    travelDetail(travelInfo)
      .then((response) => {
        console.log(response.data.data.travelList);
        const travelLists = response.data.data.travelList;
        if (travelLists.length >= 4) {
          const lists = travelLists.slice(0, 3);
          updateCourseInfo(lists);
        } else updateCourseInfo(travelLists);
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  };

  const updateCourseInfo = (travelList: any[][]) => {
    const updatedCourseInfo = [...courseInfo];
    const updatedFirstDate = [...firstDate];
    const updatedSecondDate = [...secondDate];
    const updatedThirdDate = [...thirdDate];
    // travelList를 순회하면서 각각의 요소를 courseInfo에 추가
    travelList.forEach((destinationGroup, index) => {
      if (!courseInfo[index]) courseInfo[index] = [];
      if (!firstDate[index]) firstDate[index] = [];
      if (!secondDate[index]) secondDate[index] = [];
      if (!thirdDate[index]) thirdDate[index] = [];
      destinationGroup.forEach((destination) => {
        courseInfo[index].push({
          destinationId: destination.point.destinationId,
          destinationType: destination.destinationType,
          destinationName: destination.destinationName,
          destinationImgUrl: destination.destinationImgUrl,
          lat: destination.point.latitude,
          lng: destination.point.longitude,
          markerImage: '',
          nextDestinationDistance: destination.nextDestinationDistance,
        });
        if (index === 0) updatedFirstDate.push(destination);
        else if (index === 1) updatedSecondDate.push(destination);
        else if (index === 2) updatedThirdDate.push(destination);
      });
    });
    setCourseInfo(updatedCourseInfo);
    markerSet();
    let lengths = travelList.length;
    setFirstDate([...courseInfo[0]]);
    if (lengths == 3) {
      setSecondDate([...courseInfo[1]]);
      setThirdDate([...courseInfo[2]]);
    } else if (lengths == 2) setSecondDate([...courseInfo[1]]);
    sizeSet(lengths);
  };

  const sizeSet = (num: number) => {
    setSize(num);
  };

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

  const editButton = () => {
    console.log('edit');
    console.log(courseInfo);
    navigate('/editcourse', {
      state: {
        firstDate: firstDate,
        secondDate: secondDate,
        thirdDate: thirdDate,
        size: size,
      },
    });
  };

  const saveButton = () => {
    let travelInfos: any = [];
    if (size == 3) {
      travelInfos = [
        [
          ...firstDate.map((el: any) => {
            return el.destinationId;
          }),
        ],
        [
          ...secondDate.map((el: any) => {
            return el.destinationId;
          }),
        ],
        [
          ...thirdDate.map((el: any) => {
            return el.destinationId;
          }),
        ],
      ];
    } else if (size == 2) {
      travelInfos = [
        [
          ...firstDate.map((el: any) => {
            return el.destinationId;
          }),
        ],
        [
          ...secondDate.map((el: any) => {
            return el.destinationId;
          }),
        ],
      ];
    } else {
      travelInfos = [
        [
          ...firstDate.map((el: any) => {
            return el.destinationId;
          }),
        ],
      ];
    }
    saveTravel(travelInfos);
  };
  const saveTravel = (travelInfos: any) => {
    const travelSaveInfo = {
      cityName: travelSaveStore.travel.cityName,
      startDate: travelSaveStore.travel.startDate,
      endDate: travelSaveStore.travel.endDate,
      friendIdList: travelSaveStore.travel.friendIdList,
      transportation: travelSaveStore.travel.transportation,
      courseList: travelInfos,
    };
    travelSave(travelSaveInfo)
      .then((response: any) => {
        if (response.status == 200) {
          alert('여행을 저장했습니다!');
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
    navigate('/mypage');
  };
  if (selectedDate.length === 0) {
    return <LoadingComponent />;
  } else {
    return (
      <StyledEngineProvider>
        <BoxContainer>
          <HeaderTabs
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
            size={size}
            letters={letters}
          />
          <CourseMap>
            <TravelHeader>
              <HeaderTitle>{travelCity.city}</HeaderTitle>
              <HeaderDate>
                {travelSaveStore.travel.startDate} ~ {travelSaveStore.travel.endDate}
              </HeaderDate>
            </TravelHeader>
            <TravelMap key={key}>
              <KakaoMap dateCourse={selectedDate} />
            </TravelMap>
          </CourseMap>
          <EditBody>
            <EditButton disableRipple onClick={() => editButton()}>
              편집
            </EditButton>
          </EditBody>
          <CourseBody>
            {selectedDate &&
              selectedDate.map((place: any, index: number) => (
                <CourseCard key={index} course={place} />
              ))}
            <ButtonBox>
              <ChooseButton onClick={() => saveButton()}>일정 저장</ChooseButton>
            </ButtonBox>
          </CourseBody>
        </BoxContainer>
      </StyledEngineProvider>
    );
  }
};

const BoxContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-width: 412px;
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

const ButtonBox = styled(Box)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const ChooseButton = styled.button`
  width: 390px;
  height: 40px;
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.subtext};
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;
export default BeforeConfirm;
