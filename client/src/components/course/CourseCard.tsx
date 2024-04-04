import React, { useEffect, useState } from 'react';
import { useTravelInfo } from '../../store/useTravelStore';
import styled from 'styled-components';

import Box from '@mui/material/Box';

const CourseCard = ({ course }: any) => {
  const [toGoTime, setToGoTime] = useState<number>(course.nextDestinationDistance);
  const { travelInfo } = useTravelInfo();
  const transportation = travelInfo.transportation;
  const time =
    {
      WALK: 12,
      BUS: 5,
      CAR: 2,
    }[transportation] || 5;
  const getTwoDecimalPlaces = (number: number) => {
    return Math.round(number * 100) / 100;
  };
  const getTime = (distance: number) => {
    return Math.round(distance * time);
  };
  useEffect(() => {
    const distance = getTwoDecimalPlaces(course.nextDestinationDistance);
    let realTime = getTime(distance);
    if (realTime == 0) realTime = 1;
    setToGoTime(realTime);
  }, [course]);

  return (
    <CardContainer key={course}>
      <NumberCircle>
        <CircleImage src={course.markerImage} />
      </NumberCircle>
      <CardBox>
        <CardDetail>
          <DetailDesc>
            <DetailCategory>
              {course.destinationType === 'sights'
                ? '명소'
                : course.destinationType === 'food'
                  ? '식당'
                  : '카페'}
            </DetailCategory>
            <DetailTitle>{course.destinationName}</DetailTitle>
          </DetailDesc>
          {course.nextDestinationDistance ? (
            <DetailTime>예상추정시간: 약 {toGoTime}분</DetailTime>
          ) : (
            <></>
          )}
        </CardDetail>
        <CardImage src={course.destinationImgUrl}></CardImage>
      </CardBox>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 150px;
  padding: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 2.4px 2.4px 3.2px;
  margin-bottom: 5px;
  border-radius: 10px;
`;

const NumberCircle = styled.div`
  width: 95%;
`;

const CircleImage = styled.img`
  width: 25px;
  height: 25px;
`;

const CardBox = styled(Box)`
  && {
    width: 90%;
    height: 80%;
    border-left: 2px solid rgba(0, 0, 0, 0.1);
    margin-left: 1.6%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const CardDetail = styled(Box)`
  && {
    width: 60%;
    height: 95%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px;
  }
`;

const DetailDesc = styled(Box)``;

const DetailCategory = styled(Box)`
  && {
    width: 90%;
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => props.theme.main};
    padding: 5px;
  }
`;

const DetailTitle = styled(Box)`
  && {
    width: 90%;
    font-size: 20px;
    font-weight: bold;
    color: ${(props) => props.theme.maintext};
    padding: 5px;
    margin-top: 5px;
  }
`;

const DetailTime = styled(Box)`
  && {
    width: 90%;
    font-size: 12px;
    font-weight: bold;
    color: ${(props) => props.theme.maintext};
    padding: 5px;
  }
`;
const CardImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10px;
`;

export default CourseCard;
