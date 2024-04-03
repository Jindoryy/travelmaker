import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { destinationDetail, destinationArray } from '../../utils/axios/axios-travel';
import HeaderTabs from '../../components/common/HeaderTabs';
import ChooseSitePictures from './ChooseSitePictures';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTravelCity, useTravelSave, useTravelInfo } from '../../store/useTravelStore';

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

const ChooseSite: React.FC<{
  onDestinationSelect: (destinationId: number) => void;
  onCloseDrawer: () => void;
}> = ({ onDestinationSelect, onCloseDrawer }) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [destinationList, setDestinationList] = useState<any>([[]]);
  const travelSave = useTravelSave();
  const travelCity = useTravelCity();
  const [cityId, setCityId] = useState<any>(travelCity.travelCity.cityId);
  const [allList, setAllList] = useState<any>([[]]);
  const [sightsList, setSightsList] = useState<any>([]);
  const [foodList, setFoodList] = useState<any>([]);
  const [cafeList, setCafeList] = useState<any>([]);

  const { setTravelInfo } = useTravelInfo();

  useEffect(() => {
    if (cityId) {
      getDestinationInfo(cityId);
    }
  }, []);

  const getDestinationInfo = (cityId: number) => {
    const friendIds = travelSave.travel.friendIdList;
    destinationDetail(cityId, friendIds)
      .then((response) => {
        const newList = response.data.data.destinationRecommendList;
        getDivide(newList);
        getDestinationDetail(newList);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  const getDivide = (newList: any) => {
    if (!newList) return;
    setAllList([[...newList.sights], [...newList.food], [...newList.cafe]]);
    setSightsList([...newList.sights]);
    setFoodList([...newList.food]);
    setCafeList([...newList.cafe]);
  };

  const getDestinationDetail = (newList: any) => {
    destinationArray(newList.sights)
      .then((response) => {
        const array = response.data.data;
        array.map((el: any) => {
          el.likes_flag = false;
        });
        setSightsList([...array]);
      })
      .catch((err) => {
        console.error(err);
      });
    destinationArray(newList.food)
      .then((response) => {
        const array = response.data.data;
        array.map((el: any) => {
          el.likes_flag = false;
        });
        setFoodList([...array]);
      })
      .catch((err) => {
        console.error(err);
      });
    destinationArray(newList.cafe)
      .then((response) => {
        const array = response.data.data;
        array.map((el: any) => {
          el.likes_flag = false;
        });
        setCafeList([...array]);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleTabChange = (tabNumber: number) => {
    setSelectedTab(tabNumber);
  };

  const letters = ['명소', '식당', '카페'];

  // 다음 페이지로 이동하는 함수
  const goToNextPage = () => {
    const likes: number[] = [];
    sightsList.map((el: any) => {
      if (el.likes_flag) likes.push(el.destinationId);
    });
    foodList.map((el: any) => {
      if (el.likes_flag) likes.push(el.destinationId);
    });
    cafeList.map((el: any) => {
      if (el.likes_flag) likes.push(el.destinationId);
    });
    travelSave.setTravel({
      cityName: travelSave.travel.cityName,
      startDate: travelSave.travel.startDate,
      endDate: travelSave.travel.endDate,
      friendIdList: travelSave.travel.friendIdList,
      transportation: travelSave.travel.transportation,
      courseList: [...likes],
    });
  };

  const handleLikeChange = (likeId: number) => {
    onDestinationSelect(likeId);
    onCloseDrawer();
  };

  return (
    <MainPageContainer>
      <StyledHeaderTabs>
        <HeaderTabs
          selectedTab={selectedTab}
          letters={letters}
          onTabChange={handleTabChange}
          size={3}
        />
      </StyledHeaderTabs>

      <SitePicturesContainer>
        <SitePicturesStyle>
          {selectedTab === 1 && (
            <ChooseSitePictures array={sightsList} onlikeChange={handleLikeChange} />
          )}
          {selectedTab === 2 && (
            <ChooseSitePictures array={foodList} onlikeChange={handleLikeChange} />
          )}
          {selectedTab === 3 && (
            <ChooseSitePictures array={cafeList} onlikeChange={handleLikeChange} />
          )}
        </SitePicturesStyle>
      </SitePicturesContainer>
    </MainPageContainer>
  );
};

const StyledHeaderTabs = styled.div`
  position: fixed;
  top: 30%;
  padding-left: 5px;
  z-index: 2;
  background-color: white;
  display: flex;
  justify-content: center;
`;

const MainPageContainer = styled.div`
  margin-top: 100px;
  margin-bottom: 50px;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const SitePicturesStyle = styled.div`
  margin: 10px;
  background-color: white;
  border-radius: 15px;
`;

const SitePicturesContainer = styled.div`
  height: 100%;
  margin-top: 20px;
  z-index: 0;
`;

export default ChooseSite;
