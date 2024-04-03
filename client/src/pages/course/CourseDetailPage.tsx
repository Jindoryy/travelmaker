import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTravelDetail } from '../../utils/axios/axios-travel';
import HeaderTabs from '../../components/common/HeaderTabs';
import KakaoMap from '../../components/course/KakaoMap';
import CourseCard from '../../components/course/CourseCard';
import { useTravelCity, useTravelSave } from '../../store/useTravelStore';
import useUserInfo from '../../store/useUserStore';

import styled from 'styled-components';
import Box from '@mui/material/Box';

const CourseDetailPage = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [courseInfo, setCourseInfo] = useState<any>([[]]);
  const [firstDate, setFirstDate] = useState<any>([]);
  const [secondDate, setSecondDate] = useState<any>([]);
  const [thirdDate, setThirdDate] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<any>([...firstDate]);
  const [key, setKey] = useState(0);
  const [size, setSize] = useState(courseInfo.length);
  const travelCity = useTravelCity();
  const travelSave = useTravelSave();
  const { userInfo } = useUserInfo();
  const navigate = useNavigate();
  const location = useLocation();

  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [cityName, setCityName] = useState<string>();
  const [transportation, setTransportation] = useState<string>();
  const [travelList, setTravelList] = useState<any>([[]]);

  useEffect(() => {
    if (!userInfo || userInfo.userId === -1) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const travelId = location.state;
        const response = await getTravelDetail(travelId);
        const data = response.data.data;
        setCityName(data.cityName);
        setEndDate(data.endDate);
        setStartDate(data.startDate);
        setTransportation(data.transportation);
        setTravelList(data.travelList);
        updateCourseInfo(data.travelList);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const settingData = (data: any) => {
    setCityName(data.cityName);
    setEndDate(data.endDate);
    setStartDate(data.startDate);
    setTransportation(data.transportation);
    setTravelList(data.travelList);
    updateCourseInfo(travelList);
  };

  useEffect(() => {}, [travelList]);

  const handleTabChange = (tabNumber: number) => {
    setSelectedTab(tabNumber);
  };
  const letters = ['1일차', '2일차', '3일차'];

  useEffect(() => {
    if (selectedTab == 3) setSelectedDate([...thirdDate]);
    else if (selectedTab == 2) setSelectedDate([...secondDate]);
    else if (selectedTab == 1) setSelectedDate([...firstDate]);
  }, [selectedTab, courseInfo]);

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
        if (number >= 9) return;
        let color = '';
        if (ele.destinationType == 'sights') color = 'orange';
        else if (ele.destinationType == 'food') color = 'pink';
        else color = 'red';
        ele.markerImage = require(`../../assets/image/marker/${color}marker${number}.png`);
        number++;
      });
    });
  };

  return (
    <BoxContainer>
      <HeaderTabs
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        size={size}
        letters={letters}
      />
      <CourseMap>
        <TravelHeader>
          <HeaderTitle>{cityName}</HeaderTitle>
          <HeaderDate>
            {startDate} ~ {endDate}
          </HeaderDate>
        </TravelHeader>
        <TravelMap key={key}>
          <KakaoMap dateCourse={selectedDate} />
        </TravelMap>
      </CourseMap>
      <CourseBody>
        {selectedDate &&
          selectedDate.map((place: any, index: number) => (
            <CourseCard key={index} course={place} />
          ))}
      </CourseBody>
    </BoxContainer>
  );
};

const BoxContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const CourseMap = styled.div`
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

const CourseBody = styled.div`
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;

export default CourseDetailPage;
