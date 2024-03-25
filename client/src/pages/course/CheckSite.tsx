// CheckSite.tsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { destinationDetail } from '../../utils/axios/axios-travel';
import HeaderTabs from '../../components/HeaderTabs';
import CheckSitePictures from '../../components/CheckSitePictures';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';

interface DestinationResponse {
  status: string;
  data: {
    destinationRecommendList: {
      sights: number[];
      cafe: number[];
      food: number[];
    };
  };
}

const CheckSite = () => {
  const [selectedTab, setSelectedTab] = useState<string>('명소'); // 탭을 문자열로 변경
  const location = useLocation();
  const [cityId, setCityId] = useState<number | undefined>(location.state?.cityId); // cityId를 숫자 또는 undefined로 설정
  const [destinationList, setDestinationList] = useState<DestinationResponse>({
    // 배열이 아닌 단일 객체로 설정
    status: '',
    data: {
      destinationRecommendList: {
        sights: [],
        cafe: [],
        food: [],
      },
    },
  });

  useEffect(() => {
    if (cityId) {
      getDestinationInfo(cityId);
    }
  }, [cityId]);

  const getDestinationInfo = (cityId: number) => {
    destinationDetail(cityId)
      .then((response) => {
        console.log(response.data);
        const destinationResponse: DestinationResponse = {
          status: response.data.status,
          data: response.data.data,
        };
        setDestinationList(destinationResponse);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleTabChange = (tabName: string) => {
    // 탭 이름을 문자열로 받음
    setSelectedTab(tabName);
  };

  const letters = ['명소', '식당', '카페'];

  return (
    <MainPageContainer>
      <StyledHeaderTabs>
        <HeaderTabs
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          size={3}
          letters={letters}
          destinationList={destinationList} // destinationList 전달
        />
      </StyledHeaderTabs>
      <SitePicturesContainer>
        <SitePicturesStyle>
          {selectedTab === '명소' ? (
            <CheckSitePictures array={destinationList.data.destinationRecommendList.sights} />
          ) : selectedTab === '식당' ? (
            <CheckSitePictures array={destinationList.data.destinationRecommendList.food} />
          ) : (
            <CheckSitePictures array={destinationList.data.destinationRecommendList.cafe} />
          )}
        </SitePicturesStyle>
      </SitePicturesContainer>
    </MainPageContainer>
  );
};

const StyledHeaderTabs = styled.div`
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
  z-index: 0;
`;

export default CheckSite;
