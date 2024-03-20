import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Swiper as SwiperContainer, SwiperSlide } from 'swiper/react';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import { EffectCube, Pagination } from 'swiper';

// 서버에서 받아오는 도시 리스트
const cityList = [
  {
    label: '강릉',
    imgPath: require('../../assets/image/kangwondo/강원-강릉.jpg'),
  },
  {
    label: '속초',
    imgPath: require('../../assets/image/kangwondo/강원-속초.jpg'),
  },
  {
    label: '평창',
    imgPath: require('../../assets/image/kangwondo/강원-평창.jpg'),
  },
  {
    label: '동해',
    imgPath: require('../../assets/image/kangwondo/강원-동해.jpg'),
  },
  {
    label: '고성',
    imgPath: require('../../assets/image/kangwondo/강원-고성.jpg'),
  },
  {
    label: '삼척',
    imgPath: require('../../assets/image/kangwondo/강원-삼척.jpg'),
  },
  {
    label: '양구',
    imgPath: require('../../assets/image/kangwondo/강원-양구.jpg'),
  },
  {
    label: '양양',
    imgPath: require('../../assets/image/kangwondo/강원-양양.jpg'),
  },
  {
    label: '영월',
    imgPath: require('../../assets/image/kangwondo/강원-영월.jpg'),
  },
  {
    label: '원주',
    imgPath: require('../../assets/image/kangwondo/강원-원주.jpg'),
  },
  {
    label: '인제',
    imgPath: require('../../assets/image/kangwondo/강원-인제.jpg'),
  },
  {
    label: '정선',
    imgPath: require('../../assets/image/kangwondo/강원-정선.jpg'),
  },
  {
    label: '철원',
    imgPath: require('../../assets/image/kangwondo/강원-철원.jpg'),
  },
  {
    label: '춘천',
    imgPath: require('../../assets/image/kangwondo/강원-춘천.jpg'),
  },
  {
    label: '태백',
    imgPath: require('../../assets/image/kangwondo/강원-태백.jpg'),
  },
  {
    label: '홍천',
    imgPath: require('../../assets/image/kangwondo/강원-홍천.jpg'),
  },
  {
    label: '화천',
    imgPath: require('../../assets/image/kangwondo/강원-화천.jpg'),
  },
  {
    label: '횡성',
    imgPath: require('../../assets/image/kangwondo/강원-횡성.jpg'),
  },
];

const CityChoice = () => {
  const themes = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = cityList.length;
  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const choiceButton = (city: string) => {
    //시티 선택 완료
    console.log(city);
  };
  return (
    <div
      style={{
        maxWidth: '400px',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
      }}
    >
      <CityPaper>
        <CityLine></CityLine>
        <CityTypography>{cityList[activeStep].label}</CityTypography>
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
            <SwipeImage src={city.imgPath} alt={city.label} />
          </SwiperSlide>
        ))}
      </StyledSwiper>
      <ButtonBox>
        <ChooseButton onClick={() => choiceButton(cityList[activeStep].label)}>선택</ChooseButton>
      </ButtonBox>
    </div>
  );
};

const CityPaper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background-color: ${(props) => props.theme.subtext};
  margin-top: 30px 0;
  padding-top: 30px;
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
  height: 500px;
  margin: 0px 5px;
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
