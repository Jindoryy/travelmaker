import { styled } from 'styled-components';
import useUserInfo from '../../store/useUserStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';

const ProvinceHeader = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();
  useEffect(() => {
  if (!userInfo || userInfo.userId === -1) {
    navigate('/login');
  }
  }, [userInfo, navigate]);
  const { nickName } = userInfo;

  const getProfileImage = () => {
    return require('../../assets/image/DesertIsland.png');
  };

  return (
    <>
      <ProfileContainer>
        <TextContainer>
          <ProfileHighLightText>
            안녕하세요 {nickName}님<br />
          </ProfileHighLightText>
          <ProfileText>어디로 떠나 볼까요?...</ProfileText>
        </TextContainer>
        <ProfileImage src={getProfileImage()} alt="Profile" />
      </ProfileContainer>
    </>
  );
};

const ProfileContainer = styled.div`
  display: flex;
  height: 130px;
  gap: 6px;
  font-size: 20px;
  color: #000;
  font-weight: 200;
`;

const TextContainer = styled.div`
  width: 70%;
  padding: 30px 0 0 20px;
  display: flex;
  flex-direction: column;
`;
const ProfileImage = styled.img`
  flex-basis: 1;
  max-width: 100px;
  object-fit: contain;
  padding: 20px 20px 0px 0px;
`;
const ProfileText = styled.div`
  font-family: 'Black Han Sans', sans-serif;
  font-size: larger;
  margin-bottom: 0px;
`;

const ProfileHighLightText = styled(ProfileText)`
  word-break: keep-all;
  font-size: xx-large;
`;

export default ProvinceHeader;
