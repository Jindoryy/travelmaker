import styled from 'styled-components';

const MyPageHeader = ({ userInfo }: MyPageHeaderProps) => {
  return (
    <>
      <ProfileContainer>
        <ProfileImage src={userInfo.profileUrl} />
        <ProfileName>{userInfo.nickName} </ProfileName>
        <ProfileText>#{userInfo.tag} </ProfileText>
      </ProfileContainer>
    </>
  );
};
export default MyPageHeader;

interface UserInfo {
  userId: number;
  profileUrl: string;
  nickName: string;
  tag: number;
}

interface MyPageHeaderProps {
  userInfo: UserInfo;
}

const ProfileContainer = styled.div`
  display: flex;
  width: 100%;
  height: 165px;
  background: white;
  /* border-radius: 20px;
  box-shadow: 3px 3px 2px gray; */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin: 40px 0 15px 0;
  object-fit: cover;
`;

const ProfileName = styled.div`
  font-family: sans-serif;
  font-size: larger;
  font-weight: 600;
`;
const ProfileText = styled.div`
  font-family: sans-serif;
  font-size: normal;
  font-weight: 300;
`;
