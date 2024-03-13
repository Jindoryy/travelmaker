import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { StyledEngineProvider } from '@mui/styled-engine';
import styled from 'styled-components';

// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const AutoPlaySwipeableViews = SwipeableViews;

const images = [
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
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const BoxContainer = styled(Box)`
    max-width: 400px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `;

  const CityPaper = styled.div`
    width: 95%;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: none;
    background-color: #ffffff;
    margin-top: 30px 0;
    padding-top: 30px;
  `;

  const CityLine = styled.div`
    width: 100%;
    height: 40px;
    border-bottom: 5px solid #566cf0;
    position: relative;
  `;

  const CityTypography = styled.div`
    position: absolute;
    width: 130px;
    height: 60px;
    text-align: center;
    background-color: #ffffff;
    margin: 10px;
    border: 5px solid #566cf0;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Pretendard', sans-serif;
    font-weight: 600;
    font-size: 25px;
  `;
  return (
    <StyledEngineProvider>
      <BoxContainer>
        <CityPaper>
          <CityLine></CityLine>
          <CityTypography>{images[activeStep].label}</CityTypography>
        </CityPaper>
        <AutoPlaySwipeableViews
          axis={themes.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {images.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component="img"
                  sx={{
                    height: 450,
                    display: 'block',
                    maxWidth: 400,
                    overflow: 'hidden',
                    width: '100%',
                    margin: 'auto',
                  }}
                  src={step.imgPath}
                  alt={step.label}
                />
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
              Next
              {themes.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {themes.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
      </BoxContainer>
    </StyledEngineProvider>
  );
};

export default CityChoice;
