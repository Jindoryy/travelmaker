import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTravelInfo, useTravelCity } from '../../store/useTravelStore';
import styled from 'styled-components';
import HeaderTabs from '../../components/HeaderTabs';
import KakaoMap from '../../components/KakaoMap';
import CourseEditCard from '../../components/CourseEditCard';

import { useTheme } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/styled-engine';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// 스팟별 거리 (대중교통에 따라 계산해서 표시해 주어야합니다.)
const spotToSpot = [[14, 23], [30], [42]];

// 일자별로 순서대로 들어온 장소 ID를 조회 API요청하기
const EditCoursePage: React.FC = () => {
  const location = useLocation();
  const { setTravelInfo, travelInfo } = useTravelInfo();
  const { setTravelCity, travelCity } = useTravelCity();
  const [selectedTab, setSelectedTab] = useState(1);
  const [courseInfo, setCourseInfo] = useState(location.state?.courseInfo);
  const [courseList, setCourseList] = useState<any[]>(courseInfo);
  const [spottoSpot, setSpottoSpot] = useState<any>([[]]);
  const [markerList, setMarkerList] = useState<any>();
  const [key, setKey] = useState(0);

  useEffect(() => {
    // courseInfo가 변경될 때마다 key를 업데이트
    setKey((prevKey) => prevKey + 1);
  }, [courseInfo, spottoSpot]);

  const handleTabChange = (tabNumber: number) => {
    setSelectedTab(tabNumber);
  };
  const letters = ['1일차', '2일차', '3일차'];

  const [items, setItems] = useState<number[]>([1, 2, 3]);

  const handleDragEnd = (result: DropResult) => {
    console.log(result.destination);
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(courseList[selectedTab - 1]);
    console.log(reorderedItems);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    const updatedCourseList = [...courseList];
    updatedCourseList[selectedTab - 1] = reorderedItems;
    changeCourseList(updatedCourseList);
  };
  const changeCourseList = (newCourseList: any[]) => {
    const newCourse = markerSet(newCourseList);
    setCourseList(newCourse);
  };

  // useEffect(() => {
  //   console.log('마커바뀐다아');
  //   markerSet();
  // }, [courseList]);

  //데이터에 따라 마커 이미지 설정해주는 함수
  const markerSet = (newCourseList: any) => {
    newCourseList.forEach((el: any) => {
      let number = 1;
      el.forEach((ele: any) => {
        if (number >= 7) return;
        let color = '';
        if (ele.destinationType == 'sights') color = 'orange';
        else if (ele.destinationType == 'food') color = 'pink';
        else color = 'red';
        ele.markerImage = require(`../../assets/image/marker/${color}marker${number}.png`);
        number++;
      });
    });
    return newCourseList;
  };

  useEffect(() => {}, [courseList]);
  return (
    <StyledEngineProvider>
      <BoxContainer>
        <HeaderTabs
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          size={courseList.length}
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
            <KakaoMap dateCourse={courseList[selectedTab - 1].slice(0, 6)} />
          </TravelMap>
        </CourseMap>
        <EditBody>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId={`course-edit-droppable-${selectedTab}`}
              key={`course-edit-droppable-${selectedTab}`}
            >
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {courseList[selectedTab - 1].map((place: any, index: number) => (
                    <Draggable
                      key={place.destinationId.toString()}
                      draggableId={place.destinationId.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <CourseEditCard
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          course={courseList[selectedTab - 1][index]}
                          spotToSpot={spotToSpot[selectedTab - 1][index - 1]}
                          provided={provided}
                          image={courseList[selectedTab - 1][index].markerImage}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </EditBody>
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
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f7f8fa;
  margin: 10px;
  padding: 10px;
`;

export default EditCoursePage;
