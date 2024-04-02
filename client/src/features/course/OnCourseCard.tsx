import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getUserStatus, UserStatusResponse } from '../../utils/axios/axios-user';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import './styles.css';
// import required modules
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
                <img src={destination.destinationImgUrl} alt={destination.destinationName} />
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
  background-color: white;
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
`;
