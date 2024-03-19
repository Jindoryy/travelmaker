import * as React from 'react';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';

import { StyledEngineProvider } from '@mui/styled-engine';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
// import { autoPlay } from 'react-swipeable-views-utils';

// 자동으로 사진이 넘어가는 함수
// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

// 서버에서 받아오는 도시 리스트
const cityList = [
  {
    label: '강릉',
    imgPath: require('../../assets/image/강릉시.jpg'),
  },
  {
    label: '속초',
    imgPath: require('../../assets/image/속초시.jpg'),
  },
  {
    label: '평창',
    imgPath: require('../../assets/image/평창시.jpg'),
  },
  {
    label: '동해',
    imgPath: require('../../assets/image/동해시.jpg'),
  },
];

const CityChoice = () => {
  const themes = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = cityList.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const choiceButton = (city: string) => {
    //시티 선택 완료
    console.log(city);
  };
  return (
    <StyledEngineProvider>
      <BoxContainer>
        <CityPaper>
          <CityLine></CityLine>
          <CityTypography>{cityList[activeStep].label}</CityTypography>
        </CityPaper>
        <SwipeableViews
          axis={themes.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {cityList.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <ImageBox>
                  <RealImage src={step.imgPath} alt={step.label} />
                </ImageBox>
              ) : null}
            </div>
          ))}
        </SwipeableViews>
        <ChooseButton disableRipple onClick={() => choiceButton(cityList[activeStep].label)}>
          선택
        </ChooseButton>
      </BoxContainer>
    </StyledEngineProvider>
  );
};

const BoxContainer = styled(Box)`
  max-width: 400px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
`;

const CityPaper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background-color: ${(props) => props.theme.subtext};
  margin-top: 30px 0;
  padding-top: 30px;
`;

const CityLine = styled.div`
  width: 100%;
  height: 40px;
  border-bottom: 6px solid ${(props) => props.theme.main};
  position: relative;
`;

const CityTypography = styled.div`
  position: absolute;
  width: 130px;
  height: 50px;
  text-align: center;
  background-color: ${(props) => props.theme.subtext};
  margin: 10px;
  border: 6px solid ${(props) => props.theme.main};
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 25px;
`;
const ImageBox = styled(Box)`
  height: 450px;
  display: block;
  max-width: 400px;
  overflow: hidden;
`;

const RealImage = styled.img`
  width: 100%;
  height: 100%;
  margin: auto;
  border-radius: 25px;
`;

const ChooseButton = styled(Button)`
  && {
    width: 90%;
    height: 40px;
    background-color: ${(props) => props.theme.main};
    color: ${(props) => props.theme.subtext};
    margin: 10px;
    margin-top: 30px;
    padding: 10px;
    border-radius: 8px;
    font-family: 'Pretendard', sans-serif;
    font-weight: 600;
    font-size: 16px;
  }
`;

export default CityChoice;
