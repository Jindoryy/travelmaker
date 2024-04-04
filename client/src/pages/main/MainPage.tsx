import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Profile from '../../components/common/MainProfile';
import ServiceInfo from '../../components/common/ServiceInfo';
import Weather from '../../components/common/Weather';
import SitePictures from '../../components/common/SitePictures';
import MyCourseListDiv from '../../features/course/GoToMyCourseListDiv';
import MyMemoButton from '../../features/user/MyMemoButton';
import DDayDiv from '../../features/course/DDayDiv';
import OnCourseCard from '../../features/course/OnCourseCard';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserStatus, UserStatusResponse } from '../../utils/axios/axios-user';
import ExtraInfoModal from '../../components/common/ExtraInfoModal';
import DiaryAlert from '../../components/common/DiaryAlert';
import useUserInfo from '../../store/useUserStore';

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
  const navigate = useNavigate();

  // 위치 가져오기
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

  const { userInfo } = useUserInfo();

  const handleDisplayModal = useCallback(() => {
    setIsOpenModal((prev) => !prev);
  }, []);

  const handleDisplayAlert = useCallback(() => {
    setIsOpenAlert((prev) => !prev);
  }, []);

  useEffect(() => {
    // getUserStatus 함수를 이용하여 사용자 상태를 가져옴
    if (userInfo.userId !== -1) {
      getUserStatus()
        .then((response) => {
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
    }
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행됨

  return (
    // 고정
    <MainPageContainer>
      {isOpenAlert && <DiaryAlert handleDisplayAlert={handleDisplayAlert} />}
      {isOpenModal && <ExtraInfoModal handleDisplayModal={handleDisplayModal} />}
      {/* 헤더로고 */}
      <LogoLargeContainer>
        <LogoContainer>
          <Logo src="/img/horizontallogo.png" alt="Logo" />
        </LogoContainer>
      </LogoLargeContainer>
      {/* 프로필 */}
      <StyledProfile
        onClick={() => {
          navigate('/course/datetrans');
        }}
      >
        <Profile userState={userStatus?.data.status || ''} />
      </StyledProfile>
      {(userInfo.userId === -1 || userStatus?.data.status === 'BEFORE_COURSE') && (
        <BeforeCourse>
          <ServiceInfo></ServiceInfo>
          <SitePicturesContainer>
            <SitePicturesStyle>
              <SitePictures />
            </SitePicturesStyle>
          </SitePicturesContainer>
        </BeforeCourse>
      )}
      {userStatus?.data.status === 'AFTER_COURSE' && (
        <AfterCourse>
          <Container className="container">{weather && <Weather weather={weather} />}</Container>
          {/* d-day */}
          <StyledDDAY>
            <DDayDiv></DDayDiv>
          </StyledDDAY>
          {/* 내 코스보기 페이지로 이동 div */}
          <StyledMyCourseListDiv>
            <MyCourseListDiv />
          </StyledMyCourseListDiv>
          {/* memo */}
          <ButtonBox>
            <MyMemoButton travelId={userStatus?.data.afterCourseResponse.travelId}></MyMemoButton>
          </ButtonBox>
        </AfterCourse>
      )}

      {userStatus?.data.status === 'ON_COURSE' && (
        <>
          <Container className="container">{weather && <Weather weather={weather} />}</Container>
          {/* 내 코스보기 페이지로 이동 div */}
          <StyledMyCourseListDiv>
            <MyCourseListDiv />
          </StyledMyCourseListDiv>
          {/* course info */}
          <StyledCourseCard>
            <OnCourseCard></OnCourseCard>
          </StyledCourseCard>
        </>
      )}
    </MainPageContainer>
  );
};

const MainPageContainer = styled.div`
  width: 95%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #dde2fc;
  padding-bottom: 50px;
`;
// 로고헤더
const LogoLargeContainer = styled.div`
  background-color: white;
  width: 100%;
  z-index: 2;
`;
const LogoContainer = styled.div`
  position: relative;
  padding-top: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  top: 0;
  height: 40px;
  background-color: #dde2fc;
  margin-bottom: 5px;
`;
const Logo = styled.img`
  width: 150px; /* 로고 이미지의 적절한 크기로 조정하세요 */
  height: auto;
  max-width: 100%;
  padding-left: 10px;
`;
// 프로필
const StyledProfile = styled.div`
  padding-left: 3px;
  width: 100%;
`;

const BeforeCourse = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const AfterCourse = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
// 장소 리스트(좋아요가능)
const SitePicturesStyle = styled.div`
  margin: 10px;
  background-color: white;
  border-radius: 15px;
  z-index: 0;
`;
const SitePicturesContainer = styled.div`
  /* Profile  컴포넌트의 높이만큼 상단 여백 추가 */
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #dde2fc;
  z-index: 0;
  margin-bottom: 5px;
`;
//날씨
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #dde2fc;
`;
//코스짜기 페이지로 이동
const StyledMyCourseListDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #dde2fc;
  z-index: 0;
`;
//디데이
const StyledDDAY = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #dde2fc;
  z-index: 0;
`;
//여행중 코스 정보 카드
const StyledCourseCard = styled.div`
  width: 100%;
  height: auto;
  text-align: center;
  padding-top: 10px;
  background-color: #dde2fc;
  padding-bottom: 5px;
  display: flex;
  justify-content: center;
  padding-left: 1px;
`;
const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export default MainPage;
