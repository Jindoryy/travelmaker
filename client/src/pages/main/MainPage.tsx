import styled from 'styled-components';
import Profile from '../../components/common/MainProfile';
import SitePictures from '../../components/common/SitePictures';

const MainPage = () => {
  return (
    <MainPageContainer>
      <LogoLargeContainer>
        <LogoContainer>
          <Logo src="/img/horizontallogo.png" alt="Logo" />
        </LogoContainer>
      </LogoLargeContainer>

      <StyledProfile>
        <Profile />
      </StyledProfile>

      <SitePicturesContainer>
        <SitePicturesStyle>
          <SitePictures />
        </SitePicturesStyle>
      </SitePicturesContainer>
    </MainPageContainer>
  );
};

const MainPageContainer = styled.div`
  max-width: 412px;
  position: relative;
  justify-content: center;
  background-color: #dde2fc;
`;

const StyledProfile = styled.div`
  padding-top: 35px;
  position: fixed;
  top: 0;
  max-width: 412px;
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
  padding-top: 380px; /* Profile  컴포넌트의 높이만큼 상단 여백 추가 */
  background-color: #dde2fc;
  z-index: 0;
`;

const LogoLargeContainer = styled.div`
  background-color: white;
  max-width: 412px;
  width: 100%;
  z-index: 2;
`;

const LogoContainer = styled.div`
  position: fixed;
  top: 0;

  /* transform: translateX(-50%); */
  z-index: 2;
  width: 100%;
  max-width: 412px;

  background-color: #dde2fc;
`;

const Logo = styled.img`
  width: 150px; /* 로고 이미지의 너비 조정 */
  height: auto; /* 비율 유지 */
  padding-left: 10px;
  max-width: 412px;
`;

export default MainPage;
