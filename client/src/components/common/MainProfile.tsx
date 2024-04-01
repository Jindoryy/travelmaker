import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ProfileProps {
  scrolled: boolean;
  scrollHeight: number;
  fontSize: string;
}

interface ProfileImageProps {
  size: string;
}

const Profile = ({ userState }: { userState: string }) => {
  // userState props로 변경
  const [scrolled, setScrolled] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);

  const getProfileContent = () => {
    switch (userState) {
      case 'ON_COURSE':
        return '즐거운 ㅇㅇ여행 ㅇ일차';
      case 'AFTER_COURSE':
        return '두근두근 기대되는 여행';
      default:
        return '이런 곳은 어떠세요?';
    }
  };

  const getProfileImage = () => {
    switch (userState) {
      case 'AFTER_COURSE':
        return require('../../assets/image/KissingCat.png'); // 이미지 가져오는 방식 수정
      case 'BEFORE_COURSE':
        return require('../../assets/image/WorldMap.png'); // 이미지 가져오는 방식 수정
      default:
        return require('../../assets/image/AirplaneDeparture.png'); // 이미지 가져오는 방식 수정
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollHeight = document.documentElement.scrollTop;
      console.log('currentScrollHeight:', currentScrollHeight); // 콘솔에 출력
      setScrollHeight(currentScrollHeight);
      setScrolled(currentScrollHeight > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollHeight]); // 의존성 배열 수정

  const getProfileSize = () => {
    if (scrollHeight > 200) {
      return '100px';
    } else if (scrollHeight > 100) {
      return '150px';
    } else if (scrollHeight > 50) {
      return '200px';
    } else {
      return '250px';
    }
  };

  const getProfileContentFontSize = () => {
    if (scrollHeight > 200) {
      return '16px';
    } else if (scrollHeight > 100) {
      return '18px';
    } else if (scrollHeight > 50) {
      return '20px';
    } else {
      return '22px';
    }
  };

  return (
    <StyledProfileContainer
      scrolled={scrolled}
      scrollHeight={scrollHeight}
      fontSize={getProfileContentFontSize()}
    >
      <StyledProfileImage src={getProfileImage()} alt="Profile" size={getProfileSize()} />
      <StyledProfileContent
        scrolled={scrolled}
        scrollHeight={scrollHeight}
        fontSize={getProfileContentFontSize()}
      >
        {getProfileContent()}
      </StyledProfileContent>
    </StyledProfileContainer>
  );
};

const StyledProfileContainer = styled.div<ProfileProps>`
  background-color: white;
  color: #000;
  padding: 10px;
  margin: 10px;
  max-width: 375px;
  width: 100%;
  text-align: center;
  border-radius: 15px;
  transition: height 0.1s;
  height: ${({ scrolled, scrollHeight }) => {
    if (scrolled && scrollHeight >= 1000) {
      return '120px';
    } else {
      return scrollHeight > 200
        ? '120px'
        : scrollHeight > 100
          ? '200px'
          : scrollHeight > 50
            ? '250px'
            : '300px';
    }
  }};
`;

const StyledProfileContent = styled.p<ProfileProps>`
  font-size: ${({ fontSize }) => fontSize};
  font-family: 'Pretendard';
  font-weight: bold;
  transition: font-size 0.1s;
`;

const StyledProfileImage = styled.img<ProfileImageProps>`
  max-width: 100%;
  height: auto;
  transition: height 0.1s;
  height: ${({ size }) => size};
`;

export default Profile;
