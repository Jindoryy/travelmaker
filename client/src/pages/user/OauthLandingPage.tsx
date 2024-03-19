import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { kakaoauthentication } from '../../utils/axios/axios-user';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

const OauthLandingPage = () => {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    if (code) {
      kakaoauthentication(code)
        .then((response) => {
          // 요청 성공 시 로직
          console.log(response.data); // 서버 응답 확인
          navigate('/home'); // 예시: 홈페이지로 리다이렉션
        })
        .catch((error) => {
          // 요청 실패 시 로직
          console.error('Error:', error);
          setOpenAlert(true); // 오류 알림 창 표시
        });
    }
  }, [code]);

  return (
    <>
      <Dialog open={openAlert} onClose={() => navigate('/loginpage')}>
        <DialogTitle>{'오류'}</DialogTitle>
        <DialogContent>
          <DialogContentText>로그인 도중 오류가 발생하였습니다.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/login')}>확인</Button>
        </DialogActions>
      </Dialog>
      <LoadingContainer>
        <LoadingContent>
          <div>
            <CircularProgress size={60} />
          </div>
          <TextContainer>
            <TextSpan>로그인 중입니다.</TextSpan>
            <TextSpan>잠시만 기다려주세요...</TextSpan>
          </TextContainer>
        </LoadingContent>
      </LoadingContainer>
    </>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f1f5f9; // 예시 색상
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const TextContainer = styled.div`
  text-align: center;
  margin-top: 100px;
`;

const TextSpan = styled.span`
  display: block;
  font-weight: bold;
  font-family: 'Pretendard', sans-serif;
  margin-top: 10px;
`;
export default OauthLandingPage;
