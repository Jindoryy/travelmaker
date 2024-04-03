import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { destinationDetail, destinationArray } from '../../utils/axios/axios-travel';
import HeaderTabs from '../../components/common/HeaderTabs';
import CheckSitePictures from '../../components/course/CheckSitePictures';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTravelInfo, useTravelSave, useTravelCity } from '../../store/useTravelStore';
import LoadingComponent from '../../components/common/LoadingComponent';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Swal from 'sweetalert2';

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
  const [destinationList, setDestinationList] = useState<any>([[]]);
  const location = useLocation();
  const navigate = useNavigate(); // 이동을 위한 hook 추가
  const travelSave = useTravelSave();
  const travelCity = useTravelCity();
  const [cityId, setCityId] = useState<any>(travelCity.travelCity.cityId);
  const [allList, setAllList] = useState<any>([[]]);
  const [sightsList, setSightsList] = useState<any>([]);
  const [foodList, setFoodList] = useState<any>([]);
  const [cafeList, setCafeList] = useState<any>([]);
  const [likeList, SetLikeList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { setTravelInfo } = useTravelInfo();

  useEffect(() => {
    if (travelSave.travel.startDate === '' || travelSave.travel.endDate === '') {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    // 3초 후에 로딩 상태 변경
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (cityId) {
      getDestinationInfo(cityId);
    }
  }, []);

  const getDestinationInfo = (cityId: string) => {
    const numberId = Number(cityId);
    const friendIds = travelSave.travel.friendIdList;
    destinationDetail(numberId, friendIds)
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
    if (likes.length < 3) {
      Swal.fire({
        icon: 'error',
        text: '3개 이상 선택해주세요!',
      });
      return;
    }
    travelSave.setTravel({
      cityName: travelSave.travel.cityName,
      startDate: travelSave.travel.startDate,
      endDate: travelSave.travel.endDate,
      friendIdList: travelSave.travel.friendIdList,
      transportation: travelSave.travel.transportation,
      courseList: [...likes],
    });
    // 여기에 다음 페이지 경로를 넣어주세요
    navigate('/course/beforeconfirm');
  };

  return (
    <MainPageContainer>
      <LoadingComponents isLoading={isLoading}>
        <LoadingComponent />
      </LoadingComponents>
      <HiddenDuringLoading isLoading={isLoading}>
        <StyledHeaderTabs>
          <HeaderTabs
            selectedTab={selectedTab}
            letters={letters}
            onTabChange={handleTabChange}
            size={3}
          />
        </StyledHeaderTabs>
        <HeaderInfo>
          가고 싶은 장소에
          <CheckBoxIcon
            style={{
              width: '20px',
              height: '20px',
              textAlign: 'center',
              margin: '0px 3px',
              color: '#FFC65C',
            }}
          />
          해주세요!
        </HeaderInfo>

        <SitePicturesContainer>
          <SitePicturesStyle>
            <TabContent isVisible={selectedTab === 1}>
              <CheckSitePictures array={sightsList} />
            </TabContent>
            <TabContent isVisible={selectedTab === 2}>
              <CheckSitePictures array={foodList} />
            </TabContent>
            <TabContent isVisible={selectedTab === 3}>
              <CheckSitePictures array={cafeList} />
            </TabContent>
          </SitePicturesStyle>
          <NextPageButton onClick={goToNextPage}>완료</NextPageButton>
        </SitePicturesContainer>
      </HiddenDuringLoading>
    </MainPageContainer>
  );
};

const StyledHeaderTabs = styled.div`
  position: fixed;
  padding-left: 5px;
  top: 0;
  z-index: 2;
  background-color: white;
  display: flex;
  justify-content: center;
`;

const HeaderInfo = styled.div`
  position: fixed;
  width: 98%;
  height: 25px;
  text-align: flex-start;
  line-height: 20px;
  top: 65px;
  background-color: white;
  font-size: 15px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 30px;
  z-index: 2;
`;
const MainPageContainer = styled.div`
  padding-top: 30px;
  margin-bottom: 30px;
  display: flex;
  width: 100%;
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
  margin-top: 20px;
  z-index: 0;
  display: flex;
  justify-content: center;
`;
// 추가된 버튼에 대한 스타일 지정
const NextPageButton = styled.button`
  position: fixed; /* 버튼의 위치를 조정하기 위해 필요 */
  bottom: 0;
  width: 330px;
  border: none;
  padding: 10px 20px;
  background-color: #566cf0;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  z-index: 10;
  margin-bottom: 100px;
`;

interface TabContentProps {
  isLoading: boolean;
}

const LoadingComponents = styled.div<TabContentProps>`
  /* 로딩 컴포넌트 스타일. 로딩 상태가 아닐 때 숨김 */
  display: ${(props) => (props.isLoading ? 'block' : 'none')};
  text-align: center;
  padding: 20px;
  font-size: 24px;
`;

const HiddenDuringLoading = styled.div<TabContentProps>`
  visibility: ${(props) => (props.isLoading ? 'hidden' : 'visible')};
  /* 로딩 중에는 내용을 숨김 */
`;

interface ContentProps {
  isVisible: boolean;
}

const TabContent = styled.div<ContentProps>`
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
`;

export default CheckSite;
