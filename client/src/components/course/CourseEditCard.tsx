import React, { useEffect, useState, useRef } from 'react';
import { useTravelInfo } from '../../store/useTravelStore';
import styled from 'styled-components';

import Box from '@mui/material/Box';
import DehazeIcon from '@mui/icons-material/Dehaze';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ClearIcon from '@mui/icons-material/Clear';

import { DraggableProvided } from 'react-beautiful-dnd';

interface CourseEditCardProps {
  course: any;
  spotToSpot: number;
  provided: DraggableProvided;
  image: any;
  distance: number;
  idx: number;
  size: number;
  onDelete: (destinationId: number) => void;
}

const CourseEditCard: React.FC<CourseEditCardProps> = ({
  course,
  provided,
  image,
  distance,
  idx,
  size,
  onDelete,
}) => {
  const [markerImage, setMarkerImage] = useState(image);
  const { travelInfo } = useTravelInfo();
  const transportation = travelInfo.transportation;
  const time =
    {
      WALK: 12,
      BUS: 5,
      CAR: 2,
    }[transportation] || 5;
  const [toGoTime, setToGoTime] = useState<number>(Math.round(distance * time));

  useEffect(() => {
    let realTime = getTime(distance);
    if (realTime == 0) realTime = 1;
    setToGoTime(realTime);
  }, []);

  const getTime = (distance: number) => {
    return Math.round(distance * time);
  };

  useEffect(() => {
    let realTime = getTime(distance);
    if (realTime == 0) realTime = 1;
    setToGoTime(realTime);
  }, [distance]);

  useEffect(() => {
    setMarkerImage(image);
  }, [image]);

  const handleDeleteClick = () => {
    onDelete(course.destinationId);
  };
  return (
    <CardContainer ref={provided.innerRef} {...provided.draggableProps}>
      <NumberCircle>
        <CircleImage src={markerImage} />
      </NumberCircle>
      <CardBox>
        <CardImage src={course.destinationImgUrl}></CardImage>
        <CardDetail>
          <DetailHeader>
            <DetailCategory>
              {' '}
              {course.destinationType == 'sights'
                ? '명소'
                : course.destinationType == 'food'
                  ? '식당'
                  : '카페'}
            </DetailCategory>
          </DetailHeader>
          <DetailTitle>{course.destinationName}</DetailTitle>
          {idx < size ? <DetailTime>예상추정시간: 약 {toGoTime}분</DetailTime> : <></>}
        </CardDetail>
      </CardBox>
      <MoveCard {...provided.dragHandleProps}>
        <DehazeIcon></DehazeIcon>
      </MoveCard>
      <DeleteButton>
        <HighlightOffIcon
          onClick={handleDeleteClick}
          style={{
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            color: '#F93053',
          }}
        />
      </DeleteButton>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  padding: 5px;
  margin: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 2.4px 2.4px 3.2px;
  margin-left: 0px;
  padding-left: 0px;
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
    margin-left: 10px;
  }
`;

const DetailHeader = styled(Box)`
  && {
    width: 100%;
    display: flex;
    align-items: center;
  }
`;
const DetailCategory = styled(Box)`
  && {
    width: 90%;
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => props.theme.main};
    padding-left: 5px;
  }
`;

const DetailTitle = styled(Box)`
  && {
    width: 95%;
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => props.theme.maintext};
    padding: 5px;
  }
`;

const DetailTime = styled(Box)`
  && {
    width: 70%;
    font-size: 12px;
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

const DeleteButton = styled(Box)`
  width: 5%;
  top: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;
export default CourseEditCard;
