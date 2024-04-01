import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Profile from '../../components/common/MainProfile';
import SitePictures from '../../components/common/SitePictures';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserStatus, UserStatusResponse } from '../../utils/axios/axios-user';
import ExtraInfoModal from '../../components/common/ExtraInfoModal';
import DiaryAlert from '../../components/common/DiaryAlert';

const MainPage = () => {
  const [userStatus, setUserStatus] = useState<UserStatusResponse | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const handleDisplayModal = useCallback(() => {
    setIsOpenModal((prev) => (prev = !prev));
  }, []);
  const handleDisplayAlert = useCallback(() => {
    setIsOpenAlert((prev) => (prev = !prev));
  }, []);

  useEffect(() => {
    // getUserStatus 함수를 이용하여 사용자 상태를 가져옴
    getUserStatus()
      .then((response) => {
        console.log(response.data.data.birthCheck);
        console.log(response.data.data.genderCheck);
        setUserStatus(response.data); // 상태를 업데이트
        if (response.data.data.genderCheck === false || response.data.data.birthCheck === false) {
          setIsOpenModal(true);
        } else {
          setIsOpenModal(false);
        }
      })
      .catch((error) => {
        console.error(error.message); // 오류 메시지 설정
      });
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행됨

  return (
    <MainPageContainer>
      {isOpenAlert && <DiaryAlert handleDisplayAlert={handleDisplayAlert} />}
      {isOpenModal && <ExtraInfoModal handleDisplayModal={handleDisplayModal} />}
      <LogoLargeContainer>
        <LogoContainer>
          <Logo src="/img/horizontallogo.png" alt="Logo" />
        </LogoContainer>
      </LogoLargeContainer>

      <StyledProfile>
        <Profile
          scrolled={false}
          scrollHeight={0}
          fontSize={''}
          userState={userStatus?.data.status || ''}
        />
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
