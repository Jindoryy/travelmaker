import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Profile = () => {
  const [userState, setUserState] = useState<'beforeCourse' | 'beforeTravel' | 'onTravel'>(
    'beforeCourse',
  );

  const getProfileContent = () => {
    switch (userState) {
      case 'onTravel':
        return '즐거운 ㅇㅇ여행 ㅇ일차';
      case 'beforeTravel':
        return '두근두근 기대되는 여행';
      default:
        return '이런 곳은 어떠세요?';
    }
  };

  const getProfileImage = () => {
    switch (userState) {
      case 'beforeTravel':
        return require('../assets/image/KissingCat.png');
      case 'beforeCourse':
        return require('../assets/image/WorldMap.png');
      default:
        return require('../assets/image/AirplaneDeparture.png');
    }
  };

  return (
    <StyledProfileContainer>
      <StyledProfileImage src={getProfileImage()} alt="Profile" />
      <StyledProfileContent>{getProfileContent()}</StyledProfileContent>
      <br />
      <button onClick={() => setUserState('beforeCourse')}>코스전</button>
      <button onClick={() => setUserState('beforeTravel')}>코스후,여행전</button>
      <button onClick={() => setUserState('onTravel')}>여행중</button>
    </StyledProfileContainer>
  );
};

const StyledProfileContainer = styled.div`
  background-color: white;
  color: #000;
  padding: 10px;
  margin: 10px;
  text-align: center;
  border-radius: 20px;
`;

const StyledProfileContainerScrolled = styled.div`
  background-color: #ccc;
  color: #000;
  padding: 10px;
  margin: 10px;
  text-align: center;
  border-radius: 20px;
`;

const StyledProfileContent = styled.p`
  font-size: 20px; /* 폰트 크기를 키웁니다. */
  font-weight: bold;
`;

const StyledProfileImage = styled.img`
  max-width: 100%;
  height: auto;
`;
const StyledProfileImageScrolled = styled.img`
  max-width: 100%;
  height: 100px;
`;

export default Profile;
