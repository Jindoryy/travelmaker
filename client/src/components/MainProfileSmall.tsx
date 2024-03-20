import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ProfileSmall = () => {
  const [userState, setUserState] = useState<'beforeCourse' | 'beforeTravel' | 'onTravel'>(
    'beforeCourse',
  );

  useEffect(() => {
    const states: Array<'beforeCourse' | 'beforeTravel' | 'onTravel'> = [
      'beforeCourse',
      'beforeTravel',
      'onTravel',
    ];
    const randomIndex = Math.floor(Math.random() * states.length);
    setUserState(states[randomIndex]);
  }, []);

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
      <StyledProfileContent>
        <StyledProfileImage src={getProfileImage()} alt="Profile" />
        {getProfileContent()}
      </StyledProfileContent>
      <br />
    </StyledProfileContainer>
  );
};

const StyledProfileContainer = styled.div`
  background-color: white;
  color: #000;
  padding: 10px;
  margin: 10px;
  /* text-align: center; */

  border-radius: 15px;
`;

const StyledProfileContent = styled.span`
  font-size: 20px;
  font-family: 'Pretendard';
  font-weight: bold;
  margin-top: 10px;
  display: flex; /* 수직 가운데 정렬을 위해 Flexbox 사용 */
  align-items: center;
`;

const StyledProfileImage = styled.img`
  max-width: 50px;
  height: auto;
  margin-right: 20px; /* 이미지와 텍스트 사이의 간격을 조절 */
  margin-left: 10px;
`;

export default ProfileSmall;
