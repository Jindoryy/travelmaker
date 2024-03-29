import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { destinationDetail } from '../../utils/axios/axios-travel';
import HeaderTabs from '../../components/common/HeaderTabs';
import CheckSitePictures from '../../components/course/CheckSitePictures';
import { useLocation } from 'react-router-dom';

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
  const [selectedTab, setSelectedTab] = useState(1);
  const [destinationList, setDestinationList] = useState<DestinationResponse>({
    status: '',
    data: {
      destinationRecommendList: {
        sights: [],
        cafe: [],
        food: [],
      },
    },
  });
  const location = useLocation();
  const [cityId, setCityId] = useState<number | undefined>(location.state?.cityId);

  useEffect(() => {
    if (cityId) {
      getDestinationInfo(cityId);
    }
  }, [cityId]);

  useEffect(() => {
    // 페이지가 처음 렌더링될 때 기본으로 '명소' 탭의 정보 가져오기
    if (cityId) {
      getDestinationInfo(cityId);
    }
  }, []); // cityId가 변경될 때만 실행

  const getDestinationInfo = (cityId: number) => {
    destinationDetail(cityId)
      .then((response) => {
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

  const handleTabChange = (tabNumber: number) => {
    setSelectedTab(tabNumber);
  };

  const letters = ['명소', '식당', '카페'];

  return (
    <MainPageContainer>
      <StyledHeaderTabs>
        <HeaderTabs
          selectedTab={selectedTab}
          letters={letters}
          onTabChange={handleTabChange}
          size={letters.length}
          //   destinationList={destinationList}
        />
      </StyledHeaderTabs>
      <SitePicturesContainer>
        <SitePicturesStyle>
          <CheckSitePictures
            array={
              selectedTab === 1
                ? destinationList.data.destinationRecommendList.sights
                : selectedTab === 2
                  ? destinationList.data.destinationRecommendList.food
                  : destinationList.data.destinationRecommendList.cafe
            }
          />
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
  max-width: 412px;
  width: 100vw;
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
