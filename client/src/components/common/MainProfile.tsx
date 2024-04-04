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
      <StyledProfileContent>
        {getProfileContent()}
        <StyledText>새로운 코스를 짜러 가볼까요?</StyledText>
      </StyledProfileContent>
    </StyledProfileContainer>
  );
};

const StyledProfileContainer = styled.div`
  background-color: white;
  color: #000;
  margin: 10px;
  border-radius: 15px;
  height: 90px;
  cursor: pointer;
  padding: 20px;
  margin-left: 5px;
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;
`;

const StyledProfileContent = styled.p`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  word-break: keep-all;
  line-height: 20px;
  width: 100%;
  margin-top: 5px;
`;

const StyledProfileImage = styled.img`
  max-width: 100%;
  width: 100px;
  height: 100px;
  padding-left: 5px;
`;

const StyledText = styled.div`
  width: 100%;
  font-size: 12px;
  font-align: flex-start;
  margin-top: 5px;
`;
export default Profile;
