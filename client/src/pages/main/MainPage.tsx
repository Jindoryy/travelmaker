import styled from 'styled-components';
import Profile from '../../components/MainProfile';
import ProfileSmall from '../../components/MainProfileSmall';
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
        {/* <ProfileSmall /> */}
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
  z-index: 4;
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
`;

export default MainPage;
