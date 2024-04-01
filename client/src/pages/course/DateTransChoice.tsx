import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import dayjs, { Dayjs } from 'dayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { koKR } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/ko';

const DateTransChoice = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const transportations = [
    {
      image:
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Bus.png',
      alt: 'BUS',
      label: '버스',
    },
    {
      image:
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Automobile.png',
      alt: 'CAR',
      label: '자동차',
    },
    {
      image:
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People%20with%20activities/Man%20Walking%20Light%20Skin%20Tone.png',
      alt: 'WALK',
      label: '도보',
    },
  ];

  useEffect(() => {
    if (startDate && endDate) {
      const newEndDate = startDate.add(2, 'day');
      setEndDate(newEndDate);
    }
  }, [startDate]);

  const onTabChange = (alt: string) => {
    if (selectedTab === alt) {
      setSelectedTab('');
    } else {
      setSelectedTab(alt);
    }
  };

  const saveButton = () => {
    //기간, 이동수단 선택했는지 검사 후 저장
    if (startDate && endDate) {
      const selectedTransportations = transportations.filter(transportation => selectedTab === transportation.alt);
      if (selectedTransportations.length > 0) {
        console.log(startDate.format('YYYY-MM-DD'));
        console.log(endDate.format('YYYY-MM-DD'));
        console.log(selectedTransportations[0].alt);
        //여기서 store에 저장
        
        navigate('/course/alonetogether');
      } else {
        console.log('빈값 있음');
      }
    } else {
      console.log('빈값 있음');
    }
  };

  const theme = createTheme(
    {
      palette: {
        primary: { main: '#566CF0' },
      },
    },
    koKR,
  );

  return (
    <>
      <PageContainer>
        <CalendarContainer>
          <CalendarInfoContainer>
            <CalendarInfoText1>여행기간 선택</CalendarInfoText1>
            <CalendarInfoText2>최대 3일</CalendarInfoText2>
          </CalendarInfoContainer>

          <ThemeProvider theme={theme}>
            <LocalizationProvider 
              dateAdapter={AdapterDayjs}
              adapterLocale="ko"
              localeText={koKR.components.MuiLocalizationProvider.defaultProps.localeText}
              dateFormats={{month:'YYYY년 M월', year:'', normalDate:'YY/M/D'}}
            >
              <DatePickerContainer>
                <MobileDatePicker
                  label="여행 시작일"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  minDate={dayjs().startOf('day')}
                />
              </DatePickerContainer>
              <DatePickerContainer>
                <MobileDatePicker
                  label="여행 마지막일"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  minDate={startDate ? startDate : dayjs().startOf('day')}
                  maxDate={startDate ? startDate.add(2, 'day') : dayjs().startOf('day').add(2, 'day')}
                />
              </DatePickerContainer>
            </LocalizationProvider>
          </ThemeProvider>
          
        </CalendarContainer>
        <TransContainer>
          <TransInfoText>이동수단 선택</TransInfoText>
          <TransChoiceContainer>
            {transportations.map((transportations, index) => (
              <TransChoice
                key={index}
                onClick={() => onTabChange(transportations.alt)}
                className={selectedTab === transportations.alt ? 'active' : ''}
              >
                <img src={transportations.image} alt={transportations.alt} width="75" height="75" />
                <div>{transportations.label}</div>
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
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  padding-bottom: 30px;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  // background-color: #566cf038;
`;
const CalendarInfoContainer = styled.div`
  text-align: center;
  margin-bottom: 40px;
  background-color: #566cf038;
  padding: 10px;
  display: inline-block;
  width: 380px;
  border-radius: 8px 8px 0px 0px;
`;
const CalendarInfoText1 = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom:5px;
`;
  const CalendarInfoText2 = styled.div`
  font-size: 16px;
  color: #555;
`;
const DatePickerContainer = styled.div`
  margin-bottom: 20px;
`;
const TransContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0px 20px;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;
const TransInfoText = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  background-color: #566cf038;
  padding: 10px;
  display: inline-block;
  width: 380px;
  border-radius: 8px 8px 0px 0px;
`;
const TransChoiceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px 0px 50px;
`;
  const TransChoice = styled.div`
  margin: 0px 8px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.className === 'active' ? '#566cf038' : 'white'};
  // border: 2px solid ${(props) => props.theme.main};
  width: 100px;
  height: 100px;
  cursor: pointer;
  padding: 5px 2px;
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
export default DateTransChoice;
