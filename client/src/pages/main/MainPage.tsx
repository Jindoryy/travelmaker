import styled from 'styled-components';
import Button from '@mui/material/Button';
import Profile from '../../components/MainProfile';
import SitePictures from '../../components/SitePictures';

const MainPage = () => {
  return (
    <MainPageContainer>
      <LogoLargeContainer>
        <LogoContainer>
          <Logo src="/img/horizontallogo.png" alt="Logo" />
        </LogoContainer>
      </LogoLargeContainer>
      <FixedProfile>
        <Profile />
      </FixedProfile>

      <SitePicturesContainer>
        <SitePicturesStyle>
          <SitePictures />
        </SitePicturesStyle>
      </SitePicturesContainer>
    </MainPageContainer>
  );
};

const MainPageContainer = styled.div`
  position: relative;
  background-color: #dde2fc;
`;

const FixedProfile = styled.div`
  padding-top: 35px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const SitePicturesStyle = styled.div`
  margin: 10px;
  background-color: white;
  border-radius: 15px;
  z-index: 0;
`;

const SitePicturesContainer = styled.div`
  padding-top: 360px; /* Profile  컴포넌트의 높이만큼 상단 여백 추가 */
  background-color: #dde2fc;
  z-index: 0;
`;

const LogoLargeContainer = styled.div`
  background-color: white;
  width: 100%;
  z-index: 2;
`;

const LogoContainer = styled.div`
  position: fixed;
  top: 0;
  padding-left: 10px;
  /* transform: translateX(-50%); */
  z-index: 2;
  width: 100%;
  background-color: #dde2fc;
`;

const Logo = styled.img`
  width: 150px; /* 로고 이미지의 너비 조정 */
  height: auto; /* 비율 유지 */
  /* background-color: rgb(86, 108, 240, 0.1); */
`;

export default MainPage;
