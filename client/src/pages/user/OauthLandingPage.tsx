import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { kakaoauthentication } from '../../utils/axios/axios-user';
import useUserInfo from '../../store/useUserStore';

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
  const { setUserInfo, userInfo } = useUserInfo();
  const [openAlert, setOpenAlert] = useState(false);
  const code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    if (code) {
      kakaoauthentication(code)
        .then((response) => {
          // 요청 성공 시 로직
          const { userId, nickName, profileUrl, tag, accessToken, refreshToken } =
            response.data.data;
          // 스토어에 사용자 정보 저장
          setUserInfo({ userId, nickName, profileUrl, tag });
          // LocalStorage에 사용자 정보 저장 => Zustand persist를 사용하기 때문에 별도로 같은 키값으로 저장하면 에러발생
          // localStorage.setItem('userInfo', JSON.stringify({ userId, nickName, profileUrl }));
          // LocalStorage에 인증토큰,재발급토큰 저장
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          // 스토어와 로컬 스토리지에서 사용자 정보를 읽어와 콘솔에 출력
          // 저장된 정보 및 토큰 확인

          navigate('/');
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
  margin-top: 10px;
`;
export default OauthLandingPage;
