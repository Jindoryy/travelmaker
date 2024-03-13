import styled from 'styled-components';
import Button from '@mui/material/Button';

const KakaoButtonComponent = ({}) => (
  <KakaoLoginButton variant="contained">카카오로 로그인</KakaoLoginButton>
);

const LoginPage = () => {
  return (
    <>
      <LoginPageContainer>
        <LogoImg src="/img/logo.png" />
        <TextContainer>
          <TextSpan>계정과 비밀번호 없이</TextSpan>
          <br />
          <TextSpan>간편하게 로그인하세요</TextSpan>
        </TextContainer>
        <KakaoButtonComponent />
      </LoginPageContainer>
    </>
  );
};

const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
`;

const LogoImg = styled.img`
  height: 40%;
  max-height: 200px;
  width: auto;
  margin-bottom: 30%;
`;

const TextContainer = styled.div`
  text-align: center;
  margin-bottom: 10%;
`;

const TextSpan = styled.span`
  display: block;
  font-weight: bold;
  font-family: 'Pretendard', sans-serif;
`;

const KakaoLoginButton = styled(Button)`
  width: 100%;
  height: 45px;
  position: relative;
  margin-top: 8vh;
  background-color: #fee500;
  color: #000;

  &:hover {
    background-color: #fdd835;
  }
`;

export default LoginPage;
