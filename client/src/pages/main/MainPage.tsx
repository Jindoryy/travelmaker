import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Profile from '../../components/common/MainProfile';
import Weather from '../../components/common/Weather';
import SitePictures from '../../components/common/SitePictures';
import MyCourseListDiv from '../../features/course/GoToMyCourseListDiv';
import DDayDiv from '../../features/course/DDayDiv';
import OnCourseCard from '../../features/course/OnCourseCard';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserStatus, UserStatusResponse } from '../../utils/axios/axios-user';
import ExtraInfoModal from '../../components/common/ExtraInfoModal';
import DiaryAlert from '../../components/common/DiaryAlert';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    id: number;
    description: string;
    icon: string;
  }[];
}

const MainPage = () => {
  const [userStatus, setUserStatus] = useState<UserStatusResponse | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  //위치 가져오기
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      getWeatherByCurrentLocation(lat, lon);
    });
  };

  const getWeatherByCurrentLocation = async (lat: number, lon: number) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=07c8f80150954d942a79882827366bc7&units=metric`;
    let response = await fetch(url);
    let data: WeatherData = await response.json();
    setWeather(data);
  };
  useEffect(() => {
    getCurrentLocation();
  }, []);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const handleDisplayModal = useCallback(() => {
    setIsOpenModal((prev) => (prev = !prev));
  }, []);
  const handleDisplayAlert = useCallback(() => {
    setIsOpenAlert((prev) => (prev = !prev));
  }, []);

  useEffect(() => {
    // getUserStatus 함수를 이용하여 사용자 상태를 가져옴
    getUserStatus()
      .then((response) => {
        // console.log(response.data.data.birthCheck);
        // console.log(response.data.data.genderCheck);
        // console.log(response.data.data.diaryCheck);
        console.log(response.data.data.status);
        setUserStatus(response.data); // 상태를 업데이트
        if (response.data.data.genderCheck === false || response.data.data.birthCheck === false) {
          setIsOpenModal(true);
        } else if (response.data.data.diaryCheck === true) {
          setIsOpenAlert(true);
        } else {
          setIsOpenModal(false);
          setIsOpenAlert(false);
        }
      })
      .catch((error) => {
        console.error(error.message); // 오류 메시지 설정
      });
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행됨

  return (
    //고정
    <MainPageContainer>
      {isOpenAlert && <DiaryAlert handleDisplayAlert={handleDisplayAlert} />}
      {isOpenModal && <ExtraInfoModal handleDisplayModal={handleDisplayModal} />}
      <LogoLargeContainer>
        <LogoContainer>
          <Logo src="/img/horizontallogo.png" alt="Logo" />
        </LogoContainer>
      </LogoLargeContainer>
      <StyledProfile>
        <Profile userState={userStatus?.data.status || ''} />
      </StyledProfile>
      {/* 상태에 따라서 컴포넌트 렌더링 */}
      {/* {userStatus?.data.status === 'BEFORE_COURSE'&& (
        <SitePicturesContainer>
          <SitePicturesStyle>
            <SitePictures />
          </SitePicturesStyle>
        </SitePicturesContainer>
      )} */}
      {/* {userStatus?.data.status === 'AFTER_COURSE' && ( */}
      {/* <div>
        <Container className="container">{weather && <Weather weather={weather} />}</Container>
      </div> */}
      {/* d-day */}
      {/* <StyledDDAY>
        <DDayDiv></DDayDiv>
      </StyledDDAY> */}
      {/* 내 코스보기 페이지로 이동 div */}
      {/* <StyledMyCourseListDiv>
        <MyCourseListDiv />
      </StyledMyCourseListDiv> */}
      {/* memo */}
      {/* )} */}
      {/* {userStatus?.data.status === 'ON_COURSE' && (
        <div> */}
      {/* 내 코스보기 페이지로 이동 div */}
      <StyledMyCourseListDiv>
        <MyCourseListDiv />
      </StyledMyCourseListDiv>
      {/* course info */}
      <StyledCourseCard>
        <OnCourseCard></OnCourseCard>
      </StyledCourseCard>
      {/* </div>
      )} */}
    </MainPageContainer>
  );
};

const MainPageContainer = styled.div`
  max-width: 412px;
  position: relative;
  justify-content: center;
  background-color: #dde2fc;
`;

const StyledProfile = styled.div`
  padding-top: 35px;
  position: fixed;
  top: 0;
  max-width: 412px;
  width: 100%;
  z-index: 4;
`;

const SitePicturesStyle = styled.div`
  margin: 10px;
  background-color: white;
  border-radius: 15px;
  z-index: 0;
`;

const SitePicturesContainer = styled.div`
  padding-top: 380px; /* Profile  컴포넌트의 높이만큼 상단 여백 추가 */
  background-color: #dde2fc;
  z-index: 0;
`;

const LogoLargeContainer = styled.div`
  background-color: white;
  max-width: 412px;
  width: 100%;
  z-index: 2;
`;

const LogoContainer = styled.div`
  position: fixed;
  top: 0;

  /* transform: translateX(-50%); */
  z-index: 2;
  width: 100%;
  max-width: 412px;

  background-color: #dde2fc;
`;

const Logo = styled.img`
  width: 150px; /* 로고 이미지의 너비 조정 */
  height: auto; /* 비율 유지 */
  padding-left: 10px;
  max-width: 412px;
`;

const Container = styled.div`
  // 스타일링을 여기에 추가하세요
  max-width: 412px;
  width: 412px;
  text-align: center;
  padding-top: 380px; /* Profile  컴포넌트의 높이만큼 상단 여백 추가 */
  background-color: #dde2fc;
  z-index: 0;
  padding-bottom: 5px;
`;
const StyledMyCourseListDiv = styled.div`
  max-width: 412px;
  width: 412px;
  text-align: center;
  padding-top: 380px;
  background-color: #dde2fc;
  z-index: 0;
  padding-bottom: 5px;
`;

const StyledDDAY = styled.div`
  max-width: 412px;
  width: 412px;
  text-align: center;
  /* padding-top: 380px; */
  background-color: #dde2fc;
  z-index: 0;
  padding-bottom: 5px;
`;

const StyledCourseCard = styled.div`
  max-width: 412px;
  width: 412px;
  text-align: center;
  /* padding-top: 380px; */
  background-color: #dde2fc;
  z-index: 0;
  padding-bottom: 5px;
`;

export default MainPage;
