import styled from 'styled-components';
import Button from '@mui/material/Button';
import Profile from '../../components/MainProfile';
import SitePictures from '../../components/SitePictures';

const MainPage = () => {
  return (
    <MainPageContainer>
      <FixedProfile>
        <Profile />
      </FixedProfile>

      <SitePicturesContainer>
        <SitePictures />
      </SitePicturesContainer>
    </MainPageContainer>
  );
};

const FixedProfile = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const MainPageContainer = styled.div`
  position: relative;
  border-radius: 20px;
  background-color: rgb(86, 108, 240, 0.1);
`;

const SitePicturesContainer = styled.div`
  padding-top: 350px; /* Profile  컴포넌트의 높이만큼 상단 여백 추가 */
  background-color: rgb(86, 108, 240, 0.1);
  border-radius: 20px;
`;

export default MainPage;
