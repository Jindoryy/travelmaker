import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { destinationDetail } from '../../utils/axios/axios-travel';
import HeaderTabs from '../../components/HeaderTabs';
import CheckSitePictures from '../../components/CheckSitePictures';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';

interface Destination {}

const CheckSite = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  const location = useLocation();

  const [cityId, setCityId] = useState(location.state?.cityId);
  const [destinationList, setDestinationList] = useState<Destination[]>([]);

  useEffect(() => {
    if (cityId) {
      getDestinationInfo(cityId);
    }
  }, [cityId]);

  const getDestinationInfo = (cityId: number) => {
    // 추천리스트 조회
    destinationDetail(cityId)
      .then((response) => {
        // 요청 성공 시 로직
        console.log(response.data); // 서버 응답 확인
      })
      .catch((error) => {
        // 요청 실패 시 로직
        console.error('Error:', error);
      });
  };

  //   const handleClick = () => {
  //     navigate('/course/beforeconfirm');
  //   };

  const handleTabChange = (tabNumber: number) => {
    setSelectedTab(tabNumber);
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
        />
      </StyledHeaderTabs>
      <SitePicturesContainer>
        <SitePicturesStyle>
          <CheckSitePictures />
        </SitePicturesStyle>
      </SitePicturesContainer>
      <ButtonBox>{/* <ChooseButton onClick={handleClick}>선택</ChooseButton> */}</ButtonBox>
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

const ButtonBox = styled(Box)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ChooseButton = styled.button`
  position: fixed;
  bottom: 80px;
  width: 90%;
  height: 40px;
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.subtext};
  margin: 10px;
  margin-top: 50px;
  padding: 10px;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

export default CheckSite;
