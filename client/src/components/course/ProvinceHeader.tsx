import { styled } from 'styled-components';
import React, { useState, useEffect } from 'react';

const ProvinceHeader = () => {
  const getProfileImage = () => {
    return require('../../assets/image/KissingCat.png');
  };

  return (
    <>
      <ProfileContainer>
        <ProfileImage src={getProfileImage()} alt="Profile" />
        <ProfileText>건희님, 어디로 떠나 볼까요?...</ProfileText>
      </ProfileContainer>
    </>
  );
};

const ProfileContainer = styled.div`
  border-radius: 20px;
  background-color: #fff;
  display: flex;
  height: 80px;
  gap: 6px;
  font-size: 20px;
  color: #000;
  font-weight: 200;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const ProfileImage = styled.img`
  height: 100%;
  width: auto;
  object-fit: cover;
`;

const ProfileText = styled.div`
  font-family: 'Black Han Sans', sans-serif;
  flex-grow: 1;
  flex-basis: auto;
  margin: auto 0;
`;

export default ProvinceHeader;
