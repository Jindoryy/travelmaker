import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Profile from '../../components/common/MainProfile';
import SitePictures from '../../components/common/SitePictures';
import { useLocation, useNavigate } from 'react-router-dom';
import { kakaoauthentication } from '../../utils/axios/axios-user';

interface UserResponse {
  status: string;
  data: {
    userId: number;
    nickName: string;
    profileUrl: string;
    status: string;
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  };
}

const MainPage = () => {
  const [userInfoList, setUserInfoList] = useState<UserResponse>({
    status: '',
    data: {
      userId: 0,
      nickName: '',
      profileUrl: '',
      status: '',
      tokenType: '',
      accessToken: '',
      expiresIn: 0,
      refreshToken: '',
      refreshTokenExpiresIn: 0,
    },
  });
  const location = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await kakaoauthentication('your_code_here'); // Replace "your_code_here" with the actual code
        setUserInfoList(response.data);
        console.log(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

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
