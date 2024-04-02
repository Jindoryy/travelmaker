import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getUserStatus, UserStatusResponse } from '../../utils/axios/axios-user';
import { Swiper, SwiperSlide } from 'swiper/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FreeMode, Pagination, Navigation } from 'swiper';

const OnCourseCard = () => {
  const [userStatus, setUserStatus] = useState<UserStatusResponse | null>(null);

  useEffect(() => {
    // getUserStatus 함수를 이용하여 사용자 상태를 가져옴
    getUserStatus()
      .then((response) => {
        console.log(response.data.data.onCourseResponse.startDate);
        console.log(response.data.data.onCourseResponse.cityName);
        console.log(response.data.data.onCourseResponse.courseInfoList);
        setUserStatus(response.data); // 상태를 업데이트
        const startDate = new Date(response.data.data.onCourseResponse.startDate);
        const today = new Date();
        const differenceInTime = today.getTime() - startDate.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

        const courseInfoList = response.data.data.onCourseResponse.courseInfoList;
      })
      .catch((error) => {
        console.error(error.message); // 오류 메시지 설정
      });
  }, []);

  return (
    <OnCourseCards>
      {userStatus && userStatus.data.onCourseResponse && (
        <SwiperWrapper>
          <Swiper spaceBetween={30} slidesPerView={1} navigation pagination={{ clickable: true }}>
            {userStatus.data.onCourseResponse.courseInfoList.map((destination, index) => (
              <SwiperSlide key={index}>
                <OverlayContainer>
                  <StyledImg
                    src={destination.destinationImgUrl}
                    alt={destination.destinationName}
                  />
                  <TextOverlay>{destination.destinationName}</TextOverlay>
                </OverlayContainer>
              </SwiperSlide>
            ))}
          </Swiper>
        </SwiperWrapper>
      )}
    </OnCourseCards>
  );
};

export default OnCourseCard;

const OnCourseCards = styled.div`
  border-radius: 20px;
  height: auto;
  margin: 10px;
  padding: 10px;
`;

const SwiperWrapper = styled.div`
  width: 100%;
  height: 100%;
  .swiper-slide img {
    width: 100%;
    height: auto;
  }
`;

const OverlayContainer = styled.div`
  position: relative;
  width: fit-content;
`;

const TextOverlay = styled.div`
  position: absolute;
  bottom: 50%; /* 예시로 설정한 위치입니다. 원하는 위치로 조정하세요. */
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Pretendard';
  font-weight: bold;
  font-size: 32px;
  text-align: center;
  color: white;
`;

const StyledImg = styled.img`
  max-width: 412px;
  width: 380px;
  height: 160px;
  object-fit: cover;
  /* height: auto; */
  border-radius: 20px; /* 예시로 추가한 스타일 */
`;
