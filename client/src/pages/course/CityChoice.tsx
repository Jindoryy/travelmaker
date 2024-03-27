import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cityDetail } from '../../utils/axios/axios-travel';
import styled from 'styled-components';
import { Swiper as SwiperContainer, SwiperSlide } from 'swiper/react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import { EffectCube, Pagination } from 'swiper';

interface City {
  cityId: number;
  cityName: string;
  cityUrl: string;
}

const CityChoice = () => {
  const location = useLocation();

  const [provinceId, setProvinceId] = useState(location.state?.provinceId);
  const [cityList, setCityList] = useState<City[]>([]);

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

  const navigate = useNavigate();
  const choiceButton = (cityId: number) => {
    //시티 선택 완료
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
      <StyledSwiper
        effect={'cube'}
        grabCursor={true}
        pagination={true}
        modules={[EffectCube, Pagination]}
        onSlideChange={(swiper) => handleStepChange(swiper.activeIndex)}
      >
        {cityList.map((city, index) => (
          <SwiperSlide key={index}>
            <SwipeImage src={city.cityUrl} alt={city.cityName} />
          </SwiperSlide>
        ))}
      </StyledSwiper>
      <ButtonBox>
        <ChooseButton onClick={() => choiceButton(cityList[activeStep].cityId)}>선택</ChooseButton>
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

const StyledSwiper = styled(SwiperContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 98%;
  height: 450px;
  margin: 3px 5px;
  overflow: hidden;
`;

const SwipeImage = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: auto;
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
  margin-top: 50px;
  padding: 10px;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

export default CityChoice;
