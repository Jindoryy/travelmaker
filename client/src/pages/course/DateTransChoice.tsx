import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravelSave, useTravelInfo } from '../../store/useTravelStore';
import useUserInfo from '../../store/useUserStore';
import { getAlreadyConfirm } from '../../utils/axios/axios-travel';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import dayjs, { Dayjs } from 'dayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { koKR } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/ko';
import Swal from 'sweetalert2';

const DateTransChoice = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [savedDate, setSavedDate] = useState<any>([]);
  const [disableDate, setDisableDate] = useState<any>([]);
  const travelSaveStore = useTravelSave();
  const travelInfoStore = useTravelInfo();
  const userInfo = useUserInfo();

  useEffect(() => {
    getAlreadyConfirm(userInfo.userInfo.userId)
      .then((response) => {
        const dates = response.data;
        if (dates) {
          const getSavedDate: string[] = [];
          dates.map((dateObj: any) => {
            const startDate = new Date(dateObj.startDate);
            const endDate = new Date(dateObj.endDate);
            const currentDate = new Date(startDate);

            while (currentDate <= endDate) {
              getSavedDate.push(currentDate.toISOString().slice(0, 10));
              currentDate.setDate(currentDate.getDate() + 1);
            }
          });
          setSavedDate(getSavedDate);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
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
    const nextDay = dayjs(startDate).add(1, 'day').format('YYYY-MM-DD');
    const nextNextDay = dayjs(startDate).add(2, 'day').format('YYYY-MM-DD');
    let updatedDisable = [];
    if (savedDate.includes(nextDay) && !savedDate.includes(nextNextDay)) {
      updatedDisable = savedDate;
      updatedDisable.push(nextDay);
      updatedDisable.push(nextNextDay);
    } else {
      updatedDisable = savedDate;
    }
    setSavedDate(updatedDisable);
  }, [startDate]);

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
    if (startDate && endDate) {
      const selectedTransportations = transportations.filter(
        (transportation) => selectedTab === transportation.alt,
      );
      if (selectedTransportations.length > 0) {
        travelSaveStore.setTravel({
          cityName: '',
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          friendIdList: [],
          transportation: selectedTransportations[0].alt,
          courseList: [],
        });
        travelInfoStore.setTravelInfo({
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          transportation: selectedTransportations[0].alt,
          destinationIdList: [],
        });
        navigate('/course/alonetogether');
      } else {
        Swal.fire({
          icon: 'warning',
          text: '이동수단을 골라주세요.',
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        text: '날짜를 선택해주세요.',
      });
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
              dateFormats={{ month: 'M월', year: 'YYYY년', normalDate: 'YYYY년 M월 D일' }}
            >
              <DatePickerContainer>
                <MobileDatePicker
                  label="여행 시작일"
                  views={['year', 'month', 'day']}
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  minDate={dayjs().startOf('day')}
                  shouldDisableDate={(date) => savedDate.includes(date.format('YYYY-MM-DD'))}
                />
              </DatePickerContainer>
              <DatePickerContainer>
                <MobileDatePicker
                  label="여행 마지막날"
                  views={['year', 'month', 'day']}
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  minDate={startDate ? startDate : dayjs().startOf('day')}
                  maxDate={
                    startDate ? startDate.add(2, 'day') : dayjs().startOf('day').add(2, 'day')
                  }
                  shouldDisableDate={(date) => savedDate.includes(date.format('YYYY-MM-DD'))}
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
  width: 90%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const CalendarContainer = styled.div`
  width: 100%;
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
  width: 95%;
  border-radius: 8px 8px 0px 0px;
`;
const CalendarInfoText1 = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;
const CalendarInfoText2 = styled.div`
  font-size: 16px;
  color: #555;
`;
const DatePickerContainer = styled.div`
  margin-bottom: 20px;
`;
const TransContainer = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0px 20px;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;
const TransInfoText = styled.div`
  width: 95%;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  background-color: #566cf038;
  padding: 10px;
  display: inline-block;

  border-radius: 8px 8px 0px 0px;
`;
const TransChoiceContainer = styled.div`
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px 0px 50px;
`;
const TransChoice = styled.div`
  margin: 0px 8px;
  border-radius: 8px;
  background-color: ${(props) => (props.className === 'active' ? '#566cf038' : 'white')};
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
  width: 330px;
  height: 40px;
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.subtext};
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;
export default DateTransChoice;
