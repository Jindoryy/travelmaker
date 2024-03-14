import * as React from 'react';
import styled from 'styled-components';
import HeaderTabs from '../../components/HeaderTabs';
import KakaoMap from '../../components/KakaoMap';

import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { useTheme } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/styled-engine';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const BoxContainer = styled(Box)`
  max-width: 400px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
`;
const TravelHeader = styled.div`
  width: 90%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 5px;
  padding: 5px;
  font-family: 'Pretendard';
`;

const HeaderTitle = styled.div`
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  padding: 2px;
`;

const HeaderDate = styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  padding: 2px;
`;

const TravelMap = styled.div`
  width: 100%;
`;
const BeforeConfirm = () => {
  return (
    <StyledEngineProvider>
      <BoxContainer>
        <div>
          <HeaderTabs />
        </div>
        <TravelHeader>
          <HeaderTitle>대구</HeaderTitle>
          <HeaderDate>2024.02.15 ~ 2024.02.18</HeaderDate>
        </TravelHeader>
        <TravelMap id="map">
          <KakaoMap />
        </TravelMap>
      </BoxContainer>
    </StyledEngineProvider>
  );
};

export default BeforeConfirm;
