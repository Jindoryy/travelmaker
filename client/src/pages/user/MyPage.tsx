import styled from 'styled-components';
import useUserInfo from '../../store/useUserStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyPageHeader from '../../components/user/MyPageHeader';
import MyPageList from '../../components/user/MyPageList';

const MyPage = () => {
  const { userInfo } = useUserInfo();
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo.userId === -1) {
      navigate('/login');
    }
  }, [userInfo, navigate]);
  return (
    <>
      <PageContainer>
        <MyPageHeader userInfo={userInfo} />
        <MyPageList userInfo={userInfo} />
        <FooterMargin />
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  box-sizing: border-box;
  background-color: #eff1fe;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 0;
  margin: 0;
  padding-bottom: 20px;
  overflow: auto;
`;

const FooterMargin = styled.div`
  height: 80px;
`;

export default MyPage;
