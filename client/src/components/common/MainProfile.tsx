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
  margin: 10px;
  border-radius: 20px;
  height: 110px;
  cursor: pointer;
  padding: 20px;
  padding-top: 25px;
  padding-bottom: 25px;
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;
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
