import styled from 'styled-components';
import Button from '@mui/material/Button';
import Profile from '../../components/MainProfile';
import SitePictures from '../../components/SitePictures';

const MainPage = () => {
  return (
    <>
      <MainPageContainer>
        <FixedProfile>
          <Profile />
        </FixedProfile>
      </MainPageContainer>
      <SitePicturesContainer>
        <SitePictures />
      </SitePicturesContainer>
    </>
  );
};

const FixedProfile = styled.div`
  position: fixed;
  background-color: white;
  top: 0;
  width: 100%;
`;

const MainPageContainer = styled.div`
  position: relative;
  background-color: white;
  border-radius: 20px;
`;

const SitePicturesContainer = styled.div`
  padding-top: 350px; /* Profile 컴포넌트의 높이만큼 상단 여백 추가 */
`;

export default MainPage;
