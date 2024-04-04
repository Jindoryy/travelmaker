import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getUserStatus, UserStatusResponse } from '../../utils/axios/axios-user';

const DDayDiv = () => {
  const [userStatus, setUserStatus] = useState<UserStatusResponse | null>(null);
  const [daysUntil, setDaysUntil] = useState<number | null>(null);

  useEffect(() => {
    // getUserStatus 함수를 이용하여 사용자 상태를 가져옴
    getUserStatus()
      .then((response) => {
        setUserStatus(response.data); // 상태를 업데이트
        const startDate = new Date(response.data.data.afterCourseResponse.startDate);
        const today = new Date();
        const differenceInTime = startDate.getTime() - today.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        setDaysUntil(differenceInDays);
      })
      .catch((error) => {
        console.error(error.message); // 오류 메시지 설정
      });
  }, []);

  return (
    <DDayContainer>
      {userStatus && (
        <OverlayContainer>
          <StyledImg src={userStatus.data.afterCourseResponse?.imgUrl} alt="Course Image" />
          <TextOverlay>
            <h1>{userStatus.data.afterCourseResponse?.cityName}</h1>
            {daysUntil !== null && <h1>D-{daysUntil}</h1>}
          </TextOverlay>
        </OverlayContainer>
      )}
    </DDayContainer>
  );
};

export default DDayDiv;

const DDayContainer = styled.div`
  width: 100%;
  border-radius: 15px;
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const OverlayContainer = styled.div`
  width: 100%;
  position: relative;
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 32px;
  text-align: center;
  color: white;
  h1 {
    display: inline-block;
    margin-right: 10px;
  }
`;

const StyledImg = styled.img`
  width: 95%;
  height: 200px;
  object-fit: cover;
  border-radius: 15px;
`;
