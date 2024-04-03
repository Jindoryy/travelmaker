import styled from 'styled-components';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { MouseEventHandler, useState } from 'react';
import { updateExtraUserInfo } from '../../utils/axios/axios-user';
import useUserInfo from '../../store/useUserStore';
import Swal from 'sweetalert2';
import { RadioGroup, Radio, FormControlLabel } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';

import dayjs, { Dayjs } from 'dayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { koKR } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/ko';

interface ExtraInfoModalProps {
  handleDisplayModal: (event?: MouseEvent) => void; // 이벤트 객체를 선택적으로 받도록 수정
}

const ExtraInfoModal: React.FC<ExtraInfoModalProps> = ({ handleDisplayModal }) => {
  // const [birthDate, setBirthDate] = useState<string>('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | ''>('');
  const { userInfo } = useUserInfo();
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 폼 제출 기본 이벤트 방지

    if (!birthDate || !gender) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '모든 정보를 입력해 주세요!',
      });
      return;
    }

    const data = {
      userId: userInfo.userId,
      gender: gender as 'MALE' | 'FEMALE',
      birth: birthDate.format('YYYY-MM-DD'),
    };

    updateExtraUserInfo(data)
      .then((response) => {
        handleDisplayModal(); // 모달 닫기
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          handleDisplayModal();
        }
        console.error(error); // 오류 처리
      });
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
      <Overlay>
        <ModalContainer>
          <ModalContentContainer>
            <ModalTitle>추가 정보 입력</ModalTitle>
            <ModalBodyContainer>
              <Form onSubmit={handleSubmit}>
                <FormLabel id="birth-calendar" style={{ marginBottom: '-5px' }}>
                  생년월일
                </FormLabel>
                {/* <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  style={{marginBottom:'10px'}}
                /> */}

                <ThemeProvider theme={theme}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="ko"
                    localeText={koKR.components.MuiLocalizationProvider.defaultProps.localeText}
                    dateFormats={{ month: 'M월', year: 'YYYY년', normalDate: 'YYYY년 M월 D일' }}
                  >
                    <MobileDatePicker
                      views={['year', 'month', 'day']}
                      value={birthDate}
                      onChange={(newValue) => setBirthDate(newValue)}
                      sx={{ mb: 1 }}
                    />
                  </LocalizationProvider>
                </ThemeProvider>

                <FormLabel id="gender-radio" style={{ marginBottom: '-12px' }}>
                  성별
                </FormLabel>
                <RadioGroup
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE' | '')}
                >
                  <FormControlLabel value="MALE" control={<Radio />} label="남성" />
                  <FormControlLabel value="FEMALE" control={<Radio />} label="여성" />
                </RadioGroup>

                <ButtonSubmit type="submit">제출</ButtonSubmit>
              </Form>
            </ModalBodyContainer>
          </ModalContentContainer>
        </ModalContainer>
      </Overlay>
    </>
  );
};

export default ExtraInfoModal;

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.article`
  position: relative;
  width: 300px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 10px 0;
`;

const ModalContentContainer = styled.div`
  background-color: white;
  position: relative;
  width: 300px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;
const ModalBodyContainer = styled.div`
  padding: 10px 20px;
`;
const ModalTitle = styled.div`
  font-weight: bold;
  padding: 0 1rem;
  margin: 15px auto;
  color: #36454f;
  align-self: flex-start;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: thin;
  align-self: flex-start;
  color: #36454f;
`;
const HorizontalDivider = styled.div`
  width: 100%;
  height: 2px;
  background-color: #36454f;
`;
const Input = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  &:focus {
    outline: #36454f;
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 8px;
`;
const Button = styled.button<{ gender?: string }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background-color: ${(props) => (props.gender === 'MALE' ? '#3498db' : '#e91e63')};
  color: white;
  transition: all 0.2s ease-in-out;
  &:hover {
    opacity: 0.8;
  }
`;

const ButtonSubmit = styled.button`
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.subtext};
  margin: 10px 0px;
  padding: 10px;
  border-radius: 8px;
  font-family: sans-serif;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;
