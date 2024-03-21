import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { destinationDetail, cityDetail } from '../../utils/axios/axios-travel';
import styled from 'styled-components';
import { Swiper as SwiperContainer, SwiperSlide } from 'swiper/react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import { EffectCube, Pagination } from 'swiper';

// 서버에서 받아오는 도시 리스트
// {
//   "cityId": 0,
//   "cityName": "string",
//   "cityUrl": "string"
// }
const cityList = [
  {
    cityId: 0,
    cityName: '강릉',
    cityUrl: require('../../assets/image/kangwondo/강원-강릉.jpg'),
  },
  {
    cityId: 1,
    cityName: '속초',
    cityUrl: require('../../assets/image/kangwondo/강원-속초.jpg'),
  },
  {
    cityId: 2,
    cityName: '평창',
    cityUrl: require('../../assets/image/kangwondo/강원-평창.jpg'),
  },
  {
    cityId: 3,
    cityName: '동해',
    cityUrl: require('../../assets/image/kangwondo/강원-동해.jpg'),
  },
  {
    cityId: 4,
    cityName: '고성',
    cityUrl: require('../../assets/image/kangwondo/강원-고성.jpg'),
  },
  {
    cityId: 5,
    cityName: '삼척',
    cityUrl: require('../../assets/image/kangwondo/강원-삼척.jpg'),
  },
  {
    cityId: 6,
    cityName: '양구',
    cityUrl: require('../../assets/image/kangwondo/강원-양구.jpg'),
  },
  {
    cityId: 7,
    cityName: '양양',
    cityUrl: require('../../assets/image/kangwondo/강원-양양.jpg'),
  },
  {
    cityId: 8,
    cityName: '영월',
    cityUrl: require('../../assets/image/kangwondo/강원-영월.jpg'),
  },
  {
    cityId: 9,
    cityName: '원주',
    cityUrl: require('../../assets/image/kangwondo/강원-원주.jpg'),
  },
  {
    cityId: 10,
    cityName: '인제',
    cityUrl: require('../../assets/image/kangwondo/강원-인제.jpg'),
  },
  {
    cityId: 11,
    cityName: '정선',
    cityUrl: require('../../assets/image/kangwondo/강원-정선.jpg'),
  },
  {
    cityId: 12,
    cityName: '철원',
    cityUrl: require('../../assets/image/kangwondo/강원-철원.jpg'),
  },
  {
    cityId: 13,
    cityName: '춘천',
    cityUrl: require('../../assets/image/kangwondo/강원-춘천.jpg'),
  },
  {
    cityId: 14,
    cityName: '태백',
    cityUrl: require('../../assets/image/kangwondo/강원-태백.jpg'),
  },
  {
    cityId: 15,
    cityName: '홍천',
    cityUrl: require('../../assets/image/kangwondo/강원-홍천.jpg'),
  },
  {
    cityId: 16,
    cityName: '화천',
    cityUrl: require('../../assets/image/kangwondo/강원-화천.jpg'),
  },
  {
    cityId: 17,
    cityName: '횡성',
    cityUrl: require('../../assets/image/kangwondo/강원-횡성.jpg'),
  },
];
const getCity = (provinceId: number) => {
  console.log(provinceId);
  cityDetail(provinceId)
    .then((response) => {
      console.log(response.data.data);
    })
    .catch((error) => {
      console.error('Error: ', error);
    });
};

const choiceButton = (cityId: number) => {
  //시티 선택 완료
  console.log(cityId);
  destinationDetail(cityId)
    .then((response) => {
      // 요청 성공 시 로직
      console.log(response.data); // 서버 응답 확인
    })
    .catch((error) => {
      // 요청 실패 시 로직
      console.error('Error:', error);
    });
};

const CityChoice = () => {
  const location = useLocation();
  // 도 id 받아오는 코드(주석처리부분)
  // const [provinceId, setProvinceId] = useState(location.state?.provinceId);
  const provinceId = 32;
  getCity(provinceId);

  const [activeStep, setActiveStep] = React.useState(0);
  const handleStepChange = (step: number) => {
    setActiveStep(step);
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
        <CityTypography>{cityList[activeStep].cityName}</CityTypography>
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
