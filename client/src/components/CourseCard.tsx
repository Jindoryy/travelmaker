import * as React from 'react';
import styled from 'styled-components';

import { StyledEngineProvider } from '@mui/styled-engine';
import Box from '@mui/material/Box';

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
    font-family: 'Pretendard';
    padding: 15px;
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
    font-size: 25px;
    font-weight: bold;
    color: ${(props) => props.theme.maintext};
    padding: 5px;
  }
`;

const DetailTime = styled(Box)`
  && {
    width: 90%;
    font-family: 'Pretendard';
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
const CourseCard = () => {
  return (
    <CardContainer>
      <NumberCircle>
        <CircleImage src={require('../assets/image/marker/pinkmarker1.png')} />
      </NumberCircle>
      <CardBox>
        <CardDetail>
          <DetailCategory>명소</DetailCategory>
          <DetailTitle>수성못</DetailTitle>
          <DetailTime>예상추정시간: 12분</DetailTime>
        </CardDetail>
        <CardImage src={require('../assets/image/강릉시.jpg')}></CardImage>
      </CardBox>
    </CardContainer>
  );
};

export default CourseCard;
