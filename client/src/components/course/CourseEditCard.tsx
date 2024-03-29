import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import { StyledEngineProvider } from '@mui/styled-engine';
import Box from '@mui/material/Box';
import DehazeIcon from '@mui/icons-material/Dehaze';

import { DraggableProvided } from 'react-beautiful-dnd';

interface CourseEditCardProps {
  course: any;
  spotToSpot: number;
  provided: DraggableProvided;
  image: any;
}

const CourseEditCard: React.FC<CourseEditCardProps> = ({ course, spotToSpot, provided, image }) => {
  const [markerImage, setMarkerImage] = useState(image);

  useEffect(() => {
    setMarkerImage(image);
  }, [image]);

  return (
    <CardContainer ref={provided.innerRef} {...provided.draggableProps}>
      <NumberCircle>
        <CircleImage src={markerImage} />
      </NumberCircle>
      <CardBox>
        <CardImage src={course.destinationImgUrl}></CardImage>
        <CardDetail>
          <DetailCategory>
            {' '}
            {course.destinationType == 'sights'
              ? '명소'
              : course.destinationType == 'food'
                ? '식당'
                : '카페'}
          </DetailCategory>
          <DetailTitle>{course.destinationName}</DetailTitle>
        </CardDetail>
      </CardBox>
      <MoveCard {...provided.dragHandleProps}>
        <DehazeIcon></DehazeIcon>
      </MoveCard>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 100px;
  padding: 5px;
  margin: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 2.4px 2.4px 3.2px;
  border-radius: 10px;
  background-color: white;
`;

const NumberCircle = styled.div`
  width: 10%;
  margin: 2px;
  padding: 2px;
  display: flex;
  justify-content: center;
`;

const CircleImage = styled.img`
  width: 30px;
  height: 30px;
`;

const CardBox = styled(Box)`
  && {
    width: 90%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 5px;
  }
`;

const CardImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
  margin: auto;
`;

const CardDetail = styled(Box)`
  && {
    width: 80%;
    height: 95%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-family: 'Pretendard';
    margin-left: 10px;
  }
`;

const DetailCategory = styled(Box)`
  && {
    width: 90%;
    font-family: 'Pretendard';
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => props.theme.main};
    padding: 5px;
  }
`;

const DetailTitle = styled(Box)`
  && {
    width: 90%;
    font-family: 'Pretendard';
    font-size: 20px;
    font-weight: bold;
    color: ${(props) => props.theme.maintext};
    padding: 5px;
  }
`;

const MoveCard = styled(Box)`
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  padding: 5px;
`;
export default CourseEditCard;
