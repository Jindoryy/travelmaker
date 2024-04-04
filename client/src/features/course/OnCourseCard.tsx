import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getUserStatus, UserStatusResponse } from '../../utils/axios/axios-user';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CourseInfo {
  destinationName: string;
  destinationImgUrl: string;
}

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const OnCourseCard = () => {
  const [userStatus, setUserStatus] = useState<UserStatusResponse | null>(null);

  function NextArrow(props: ArrowProps) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          position: 'absolute',
          top: '50%',
          right: '30px',
          zIndex: 1,
          transform: 'translateY(-50%)',
        }}
        onClick={onClick}
      />
    );
  }

  function PrevArrow(props: ArrowProps) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          position: 'absolute',
          top: '50%',
          left: '5px',
          zIndex: 1,
          transform: 'translateY(-50%)',
        }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    getUserStatus()
      .then((response) => {
        setUserStatus(response.data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const renderSlider = (courseList: CourseInfo[]) => {
    return (
      <SliderContainer>
        <Slider {...settings}>
          {courseList.map((destination, index) => (
            <Slide key={index}>
              <OverlayContainer>
                <StyledImg src={destination.destinationImgUrl} alt={destination.destinationName} />
                <TextOverlay>{destination.destinationName}</TextOverlay>
              </OverlayContainer>
            </Slide>
          ))}
        </Slider>
      </SliderContainer>
    );
  };

  return (
    <OnCourseCards>
      {userStatus &&
        userStatus.data.onCourseResponse &&
        renderSlider(userStatus.data.onCourseResponse.courseInfoList)}
    </OnCourseCards>
  );
};

export default OnCourseCard;

const OnCourseCards = styled.div`
  width: 96%;
  border-radius: 15px;
  padding-bottom: 10px;
`;

const SliderContainer = styled.div`
  width: 99%;
  height: 100%;
  .slick-slide img {
    width: 100%;
    height: 300px;
  }
`;

const Slide = styled.div`
  width: fit-content;
`;

const OverlayContainer = styled.div`
  position: relative;
`;

const TextOverlay = styled.div`
  position: absolute;
  width: 300px;
  bottom: 42%;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  font-size: 30px;
  text-align: center;
  color: white;
`;

const StyledImg = styled.img`
  max-width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 20px;
`;
