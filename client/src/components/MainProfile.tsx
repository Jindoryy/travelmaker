import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ProfileProps {
  scrolled: boolean;
  scrollHeight: number;
  fontSize: string;
}

interface ProfileImageProps {
  size: string;
}

const Profile = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollHeight = window.scrollY;
      setScrollHeight(currentScrollHeight);

      if (currentScrollHeight > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [userState, setUserState] = useState<'beforeCourse' | 'beforeTravel' | 'onTravel'>(
    'beforeCourse',
  );

  useEffect(() => {
    const states: Array<'beforeCourse' | 'beforeTravel' | 'onTravel'> = [
      'beforeCourse',
      'beforeTravel',
      'onTravel',
    ];
    const randomIndex = Math.floor(Math.random() * states.length);
    setUserState(states[randomIndex]);
  }, []);

  const getProfileContent = () => {
    switch (userState) {
      case 'onTravel':
        return '즐거운 ㅇㅇ여행 ㅇ일차';
      case 'beforeTravel':
        return '두근두근 기대되는 여행';
      default:
        return '이런 곳은 어떠세요?';
    }
  };

  const getProfileImage = () => {
    switch (userState) {
      case 'beforeTravel':
        return require('../assets/image/KissingCat.png');
      case 'beforeCourse':
        return require('../assets/image/WorldMap.png');
      default:
        return require('../assets/image/AirplaneDeparture.png');
    }
  };

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
      <br />
    </StyledProfileContainer>
  );
};

const StyledProfileContainer = styled.div<ProfileProps>`
  background-color: white;
  color: #000;
  padding: 10px;
  margin: 10px;
  text-align: center;
  align-items: center;
  border-radius: 15px;
  transition: height 0.1s;
  height: ${({ scrolled, scrollHeight }) => {
    if (scrolled && scrollHeight >= 1000) {
      return '120px';
    } else {
      if (scrollHeight > 200) {
        return '120px';
      } else if (scrollHeight > 100) {
        return '200px';
      } else if (scrollHeight > 50) {
        return '250px';
      } else {
        return '300px';
      }
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
