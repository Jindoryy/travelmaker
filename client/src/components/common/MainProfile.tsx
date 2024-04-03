import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Profile = ({ userState }: { userState: string }) => {
  const getProfileContent = () => {
    switch (userState) {
      case 'ON_COURSE':
        return '즐거운 여행중';
      case 'AFTER_COURSE':
        return '두근두근 기대되는 여행';
      default:
        return '나만의 여행을 만들어봐요';
    }
  };

  const getProfileImage = () => {
    switch (userState) {
      case 'AFTER_COURSE':
        return require('../../assets/image/KissingCat.png');
      case 'ON_COURSE':
        return require('../../assets/image/AirplaneDeparture.png');
      default:
        return require('../../assets/image/Motorway.png');
    }
  };

  return (
    <StyledProfileContainer>
      <StyledProfileImage src={getProfileImage()} alt="Profile" />
      <StyledProfileContent>{getProfileContent()}</StyledProfileContent>
    </StyledProfileContainer>
  );
};

const StyledProfileContainer = styled.div`
  background-color: white;
  color: #000;
  padding: 10px;
  margin: 10px;
  max-width: 365px;
  width: 100%;
  text-align: center;
  border-radius: 20px;
  display: flex; /* flexbox 설정 */
  align-items: center; /* 수직 중앙 정렬 */
  /* justify-content: space-between; */
  height: 110px;
  cursor: pointer;
`;

const StyledProfileContent = styled.p`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  width: 100%;
`;

const StyledProfileImage = styled.img`
  max-width: 100%;
  /* width: 100px; */
  height: 80px;
  padding-left: 5px;
`;

export default Profile;
