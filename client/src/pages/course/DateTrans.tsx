import { useState } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';

const DateTrans = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const saveButton = () => {
    console.log('일정 저장');
  };

  const choices = [
    {
      image:
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Bus.png',
      alt: 'BUS',
      label: '버스',
    },
    {
      image:
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Automobile.png',
      alt: 'GOOGLE',
      label: '자동차',
    },
    {
      image:
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People%20with%20activities/Man%20Walking%20Light%20Skin%20Tone.png',
      alt: 'WALK',
      label: '도보',
    },
  ];

  const onTabChange = (index:any) => {
    if (selectedTab === index) {
      setSelectedTab(0);
    } else {
      setSelectedTab(index);
    }
  };

  return (
    <>
      <PageContainer>
        <CalendarContainer>
          <CalendarInfoContainer>
            <CalendarInfoText1>여행기간 선택</CalendarInfoText1>
            <CalendarInfoText2>최대 3일</CalendarInfoText2>
          </CalendarInfoContainer>
          <div>캘린더 자리</div>
        </CalendarContainer>
        <TransContainer>
          <TransInfoText>이동수단 선택</TransInfoText>
          <TransChoiceContainer>
            {choices.map((choice, index) => (
              <TransChoice
                key={index}
                onClick={() => onTabChange(index + 1)}
                className={selectedTab === index + 1 ? 'active' : ''}
              >
                <img src={choice.image} alt={choice.alt} width="75" height="75" />
                <div>{choice.label}</div>
              </TransChoice>
            ))}
          </TransChoiceContainer>
        </TransContainer>
        <ButtonBox>
          <ChooseButton onClick={() => saveButton()}>다음</ChooseButton>
        </ButtonBox>
      </PageContainer>
    </>
  );
};
const PageContainer = styled.div`
  width:412px;
  height:100vh;
  background-color:#566cf038;
  padding: 50px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CalendarContainer = styled.div`
  background-color:gold;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px
`;
const CalendarInfoContainer = styled.div`
  margin-bottom: 10px;
  text-align: center;
`;
const CalendarInfoText1 = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom:5px
`;
  const CalendarInfoText2 = styled.div`
  font-size: 16px;
  color: #555;
`;
const TransContainer = styled.div`
  text-align: center;
`;
const TransInfoText = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom:5px
`;
const TransChoiceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;
  const TransChoice = styled.div`
  margin: 0px 5px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.className === 'active' ? '#566cf038' : 'white'};
  border: 2px solid ${(props) => props.theme.main};
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;
export default DateTrans;
