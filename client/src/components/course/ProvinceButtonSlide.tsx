import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Skeleton } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getRecommandCourse } from '../../utils/axios/axios-course';
import ProvinceSlideButton from '../../features/course/ProvinceSlideButton';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface Province {
  provinceId: number;
  provinceName: string;
  provinceUrl: string;
}

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const ProvinceButtonSlide = () => {
  const [provinceContents, setProvinceContents] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);

  function NextArrow(props: ArrowProps) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          position: 'absolute',
          top: '55%',
          right: '15px',
          zIndex: 1,
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
          top: '55%',
          left: '15px',
          zIndex: 1,
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
    slidesToShow: 2.2,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    getRecommandCourse()
      .then((response) => {
        if (response.status === 200 && response.data) {
          setProvinceContents(response.data.data);
        }
      })
      .catch((error) => {
        console.error('지역 데이터 가져오기 에러:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <ListContainer>
      <GuideText>
        <LocalFireDepartmentIcon style={{ color: '#FF9075' }} />
        추천 지역
        <LocalFireDepartmentIcon style={{ color: '#FF9075' }} />
      </GuideText>
      {loading || provinceContents.length === 0 ? (
        <>
          <Skeleton variant="rectangular" width={210} height={118} />
          <Skeleton width="60%" />
          <Skeleton width="80%" />
        </>
      ) : (
        <Slider {...settings}>
          {provinceContents.map((content, index) => (
            <Box>
              <ProvinceSlideButton key={index} content={content} />
            </Box>
          ))}
        </Slider>
      )}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  width: 95%;
  height: 245px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 1);
  display: flex-row;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 10px;
`;

const Box = styled.div`
  width: 90%;
  height: 240px;
  padding-left: 30px;
  box-sizing: border-box;
`;

const GuideText = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  padding: 0 0 10px 10px;
  text-align: center;
`;

export default ProvinceButtonSlide;
