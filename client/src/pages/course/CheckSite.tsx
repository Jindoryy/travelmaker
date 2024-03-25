import React, { useState } from 'react';
import styled from 'styled-components';
import HeaderTabs from '../../components/HeaderTabs';
import CheckSitePictures from '../../components/CheckSitePictures';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const CheckSite = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  const handleTabChange = (tabNumber: number) => {
    setSelectedTab(tabNumber);
  };

  const letters = ['명소', '식당', '카페'];
  return (
    <MainPageContainer>
      <StyledHederTabs>
        <HeaderTabs
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          size={3}
          letters={letters}
        />
      </StyledHederTabs>
      <SitePicturesContainer>
        <SitePicturesStyle>
          <CheckSitePictures />
        </SitePicturesStyle>
      </SitePicturesContainer>
    </MainPageContainer>
  );
};

const StyledHederTabs = styled.div`
  position: fixed;
  top: 0;
  z-index: 1;
  background-color: white;
`;

const MainPageContainer = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const SitePicturesStyle = styled.div`
  margin: 10px;
  background-color: white;
  border-radius: 15px;
  z-index: 0;
`;

const SitePicturesContainer = styled.div`
  margin-top: 20px;
  /* padding-top: 35px; */
  /* background-color: #dde2fc; */
  z-index: 0;
`;

export default CheckSite;
