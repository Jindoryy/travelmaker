import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserInfo from '../../store/useUserStore';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const StartPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const { userInfo } = useUserInfo();

  useEffect(() => {
    if (userInfo.userId !== -1) {
      navigate('/main');
    }
  }, [userInfo, navigate]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      label: '/img/one.png',
      icon: '/img/icon-scroll.gif',
      description: '가고 싶은 장소를 골라보세요! 여행코스를 짤 때 유사한 곳으로 추천받아요!',
    },
    {
      label: `/img/two.png`,
      icon: '/img/icon-bubble.gif',
      description: `같이 가고 싶은 사람을 골라보세요! 함께 좋아할 만한 장소를 추천받아요!`,
    },
    {
      label: `/img/three.png`,
      icon: '/img/icon-favorite.gif',
      description: '가고 싶은 장소를 최적경로의 코스로 짜줘요!',
    },
    {
      label: `/img/four.png`,
      icon: '/img/icon-start.gif',
      description: '끝입니다! 이제 여행을 떠나볼까요?',
    },
  ];

  return (
    <Container>
      <Logo>
        <img src="/img/logo.png" alt="logo" />
      </Logo>
      
      <ContentWrapper>
        <StepperWrapper>
          <ContentDetail>
            <Step>
              <StepContent>
                <StepImage src={steps[activeStep].label} />
                <ScrollIcon src={steps[activeStep].icon} />
                <Description>{steps[activeStep].description}</Description>
              </StepContent>
            </Step>
          </ContentDetail>
          <MobileStepper
            variant="dots"
            steps={4}
            position="static"
            activeStep={activeStep}
            nextButton={
              <NavigationButton size="small" onClick={handleNext} disabled={activeStep === 3}>
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
              </NavigationButton>
            }
            backButton={
              <NavigationButton size="small" onClick={handleBack} disabled={activeStep === 0}>
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              </NavigationButton>
            }
          />
        </StepperWrapper>
      </ContentWrapper>
      <hr className="border-white w-full border-1 opacity-50" />
      <StartButton onClick={() => navigate('/main')}>시작하기</StartButton>
    </Container>
  );
};

const Container = styled.div`
  max-width: 412px;
  display: flex;
  /* width: 100%; */
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Logo = styled.div`
  margin: auto;
  padding-top: 20px;
  margin-bottom: 0;
  & img {
    width: 200px;
  }
`;


const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ContentDetail = styled.div`
  flex-grow: 1;
  position: relative;
`;

const Step = styled.div`
  margin-top: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
`;

const StepContent = styled.div`
  width: 300px;
  height: 250px;
  background-color: white;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const StepImage = styled.img`
  position: relative;
  top: 0;
  width: 20px;
  align-self: flex-start;
`;

const ScrollIcon = styled.img`
  width: 100px;
  padding-bottom: 6px;
`;

const Description = styled.p`
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 10px;
  word-break: keep-all;
`;

const StepperWrapper = styled.div`
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NavigationButton = styled(Button)`
  background-color: none;
`;

const StartButton = styled.button`
  width: 330px;
  height: 40px;
  position: fixed;
  bottom: 0;
  border-color: ${(props) => props.theme.main};
  color: #ffffff;
  background-color: ${(props) => props.theme.main};
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 90px;
  cursor: pointer;
`;

export default StartPage;
