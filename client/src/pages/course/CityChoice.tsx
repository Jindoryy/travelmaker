import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cityDetail } from '../../utils/axios/axios-travel';
import useUserInfo from '../../store/useUserStore';
import { useTravelCity, useTravelSave } from '../../store/useTravelStore';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import 'swiper/css';
import 'swiper/css/free-mode';

import { FreeMode, Pagination } from 'swiper';

interface City {
  cityId: number;
  cityName: string;
  cityUrl: string;
}

const CityChoice = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [provinceId, setProvinceId] = useState(location.state?.provinceId);
  const [cityList, setCityList] = useState<City[]>([]);
  const { userInfo } = useUserInfo();
  const travelSave = useTravelSave();
  const travelCity = useTravelCity();
  useEffect(() => {
    if (!userInfo || userInfo.userId === -1) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (provinceId) {
      getCity(provinceId);
    }
  }, [provinceId]);

  const getCity = (provinceId: number) => {
    cityDetail(provinceId)
      .then((response) => {
        const cityData = response.data.data;
        setCityList(cityData);
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };
  const choiceButton = (cityId: number, cityName: string) => {
    travelSave.setTravel({
      cityName: cityName,
      startDate: travelSave.travel.startDate,
      endDate: travelSave.travel.endDate,
      friendIdList: travelSave.travel.friendIdList,
      transportation: travelSave.travel.transportation,
      courseList: travelSave.travel.courseList,
    });
    travelCity.setTravelCity({
      cityId: cityId,
      city: cityName,
      provinceId: travelCity.travelCity.provinceId,
      province: travelCity.travelCity.province,
    });
    navigate('/course/checksite', { state: { cityId: cityId } });
  };
  return (
    <div
      style={{
        maxWidth: '400px',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
        height: '100%',
      }}
    >
      <CityPaper>
        <CityLine></CityLine>
        <CityTypography>
          {cityList.length > 0 && cityList[activeStep]
            ? cityList[activeStep].cityName
            : 'Loading...'}
        </CityTypography>
      </CityPaper>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        onSlideChange={(swiper) => handleStepChange(swiper.activeIndex)}
        style={{ marginTop: '50px' }}
      >
        {cityList.map((city, index) => (
          <SwiperSlide key={index}>
            <SwipeImage src={city.cityUrl} alt={city.cityName} />
          </SwiperSlide>
        ))}
      </Swiper>
      <ButtonBox>
        <ChooseButton
          onClick={() => choiceButton(cityList[activeStep].cityId, cityList[activeStep].cityName)}
        >
          선택
        </ChooseButton>
      </ButtonBox>
    </div>
  );
};

const CityPaper = styled.div`
  width: 100%;
  height: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background-color: ${(props) => props.theme.subtext};
  margin-top: 30px 0;
  padding-top: 30px;
  position: relative;
`;

const CityLine = styled.div`
  width: 100%;
  height: 40px;
  border-bottom: 6px solid ${(props) => props.theme.main};
  position: relative;
`;

const CityTypography = styled.div`
  position: absolute;
  width: 130px;
  height: 50px;
  text-align: center;
  background-color: ${(props) => props.theme.subtext};
  margin: 10px;
  border: 6px solid ${(props) => props.theme.main};
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 25px;
`;

const SwipeImage = styled.img`
  justify-content: center;
  align-items: center;
  object-fit: cover;
  margin: auto;
  border-radius: 10px;
  display: block;
  width: 380px;
  height: 500px;
  object-fit: cover;
`;

const ButtonBox = styled(Box)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const ChooseButton = styled.button`
  width: 100%;
  height: 40px;
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.subtext};
  margin: 10px;
  margin-top: 80px;
  padding: 10px;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

export default CityChoice;
