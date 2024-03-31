import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTravelInfo, useTravelCity, useTravelSave } from '../../store/useTravelStore';
import { destinationDistance, travelSave } from '../../utils/axios/axios-travel';
import styled from 'styled-components';
import HeaderTabs from '../../components/common/HeaderTabs';
import KakaoMap from '../../components/course/KakaoMap';
import CourseEditCard from '../../components/course/CourseEditCard';
import ChooseSite from './ChooseSite';

import { useTheme } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/styled-engine';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Drawer from '@mui/material/Drawer';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const EditCoursePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTravelInfo, travelInfo } = useTravelInfo();
  const { setTravelCity, travelCity } = useTravelCity();
  const [selectedTab, setSelectedTab] = useState(1);
  const [firstDate, setFirstDate] = useState<any>(location.state?.firstDate);
  const [secondDate, setSecondDate] = useState<any>(location.state?.secondDate);
  const [thirdDate, setThirdDate] = useState<any>(location.state?.thirdDate);
  const [size, setSize] = useState<any>(location.state?.size);
  const [selectedDate, setSelectedDate] = useState<any>([...firstDate]);
  const [destinationIdList, setDestinationIdList] = useState<any[]>([]);
  const [distanceList, setDistanceList] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);

  const travelSaveStore = useTravelSave();

  const handleTabChange = (tabNumber: number) => {
    setSelectedTab(tabNumber);
  };
  const letters = ['1일차', '2일차', '3일차'];

  const handleDragEnd = (result: DropResult) => {
    console.log(result.destination);
    if (!result.destination) {
      return;
    }
    const reorderedItems = Array.from(selectedDate);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    
    const updatedCourseList = [...selectedDate];
    updatedCourseList[selectedTab - 1] = reorderedItems;
    const destinationList = updatedCourseList[selectedTab - 1].map((el: any) => {
      return el.destinationId;
    })
    getDistance(reorderedItems, destinationList);
    changeCourseList(updatedCourseList[selectedTab - 1]);
  };
  
  const getDistance = (courseLIst: any, destinationList: number[]) => {
    destinationDistance(destinationList)
    .then((response) => {
      console.log(response.data.data)
      const list = (response.data.data);
      const distanceLists = list.map((el: any) => {
        return el.nextDestinationDistance;
      })
      setDistanceList([...distanceLists]);
      distanceSet(courseLIst, distanceLists)
    })
    .catch((err) => {
      console.error(err);
    })
  }

  const changeCourseList = (newCourseList: any[]) => {
    if (selectedTab == 3) setThirdDate([...newCourseList])
    else if (selectedTab == 2) setSecondDate([...newCourseList])
    else setFirstDate([...newCourseList])
    markerSet(newCourseList);
  
    setSelectedDate(newCourseList);
  };

  const distanceSet = (courseList: any, distanceList: number[]) => {
    courseList.forEach((el: any, index: number) => {
      el.nextDestinationDistance = distanceList[index];
    }) 
  }
  const markerSet = (courseList: any[]) => {
    let number = 1;
    courseList.forEach((ele: any) => {
        if (number >= 7) return;
        let color = '';
        if (ele.destinationType == 'sights') color = 'orange';
        else if (ele.destinationType == 'food') color = 'pink';
        else color = 'red';
        ele.markerImage = require(`../../assets/image/marker/${color}marker${number}.png`);
        number++;
      });
  };

  useEffect(() => {
    if (selectedTab == 3) setSelectedDate([...thirdDate]);
    else if (selectedTab == 2) setSelectedDate([...secondDate]);
    else if (selectedTab == 1) setSelectedDate([...firstDate]);
  }, [selectedTab, firstDate, secondDate, thirdDate, distanceList, destinationIdList]);

  const addButton = () => {
    setIsDrawerOpen(true);
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const closeDrawerIfDestinationSelected = () => {
    if (selectedDestinationId) {
      console.log("Selected destinationId:", selectedDestinationId);
    }
  };

  const handleDestinationSelect = (destinationId: number) => {
    // 선택한 목적지의 destinationId를 상태에 저장
    setSelectedDestinationId(destinationId);
  };


  const saveButton = () => {
    let travelInfos: any = [];
    if (size == 3) {
      travelInfos = ([[...firstDate.map((el:any) => {
        return el.destinationId
      })], [...secondDate.map((el:any) => {
        return el.destinationId
      })], [...thirdDate.map((el:any) => {
        return el.destinationId
      })]]);
    } else if (size == 2) {
      travelInfos = ([[...firstDate.map((el:any) => {
        return el.destinationId
      })], [...secondDate.map((el:any) => {
        return el.destinationId
      })]]);
    } else {
      travelInfos = ([[...firstDate.map((el:any) => {
        return el.destinationId
      })]]);
    }
    saveTravel(travelInfos);
  }
  const saveTravel = (travelInfos: any) => {
    const travelSaveInfo = {
      cityName: travelSaveStore.travel.cityName,
      startDate: travelSaveStore.travel.startDate,
      endDate: travelSaveStore.travel.endDate,
      friendIdList: travelSaveStore.travel.friendTag,
      transportation: travelSaveStore.travel.transportation,
      courseList: travelInfos
    }
    travelSave(travelSaveInfo)
    .then((response:any) => {
      if (response.status == 200) {
        alert("여행을 저장했습니다!");
      }
    })
    .catch((err:any) => {
      console.error(err)
    });
    // navigate('/my');
  
  }
  return (
    <StyledEngineProvider>
      <BoxContainer>
        <HeaderTabs
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          size={size}
          letters={letters}
        />
        <CourseMap>
          <TravelHeader>
            <HeaderTitle>{travelCity.city}</HeaderTitle>
            <HeaderDate>
              {travelInfo.startDate} ~ {travelInfo.endDate}
            </HeaderDate>
          </TravelHeader>
          <TravelMap id="map">
            <KakaoMap dateCourse={selectedDate} />
          </TravelMap>
        </CourseMap>
        <EditBody>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId={`course-edit-droppable-${selectedTab}`}
              key={`course-edit-droppable-${selectedTab}`}
            >
              {(provided: any) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {selectedDate && selectedDate.map((place: any, index: number) => (
                    <Draggable
                      key={place.destinationId ? place.destinationId.toString() : index.toString()}
                      draggableId={place.destinationId ? place.destinationId.toString() : index.toString()}
                      index={index}
                    >
                      {(provided: any) => (
                        <CourseEditCard
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          course={place}
                          provided={provided}
                          image={place.markerImage}
                          distance={place.nextDestinationDistance}
                          idx={index}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <AddButton onClick={() => addButton()}>
            <AddBoxIcon />
          </AddButton>
          <Drawer anchor="bottom" open={isDrawerOpen} onClose={closeDrawerIfDestinationSelected} PaperProps={{style:{height:'70%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}}>
            <ChooseSite onCloseDrawer={closeDrawer} onDestinationSelect={handleDestinationSelect} />
          </Drawer>
        </EditBody>
        <ButtonBox>
            <ChooseButton onClick={() => saveButton()}>일정 저장</ChooseButton>
          </ButtonBox>
      </BoxContainer>
    </StyledEngineProvider>
  );
};

const BoxContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const CourseMap = styled.div`
  max-width: 400px;
  width: 95%;
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

const EditBody = styled.div`
  max-width: 412px;
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f7f8fa;
  margin: 10px;
  padding: 10px;
`;

const AddButton = styled(Box)`
  width: 50px;
  background-color: red;
  display: flex;
  justify-content: center;
`;

const ButtonBox = styled(Box)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const ChooseButton = styled.button`
  width: 390px;
  height: 40px;
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.subtext};
  margin: 0px 10px;
  padding: 10px;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;


export default EditCoursePage;
