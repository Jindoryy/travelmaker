import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Skeleton } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getCourse } from '../../utils/axios/axios-course';
import ProvinceSlideButton from '../../features/course/ProvinceSlideButton';

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
  const [provinceContents, setProvinceContents] = useState<Province[]>(contents);
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
    slidesToShow: 2.5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    getCourse()
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
      <GudieText> 추천 지역</GudieText>
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
  width: 390px;
  height: 245px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 1);
  display: flex-row;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 10px;
`;

const Box = styled.div`
  width: 100%;
  height: 240px;
  padding-left: 85px;
  box-sizing: border-box;
`;

const GudieText = styled.div`
  font-family: 'Black Han Sans', sans-serif;
  font-size: larger;
  padding: 0 0 10px 10px;
`;

const contents = [
  {
    provinceId: 1,
    provinceName: '서울',
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
  },
  {
    provinceId: 2,
    provinceName: '경기도',
    provinceUrl:
      'https://t1.daumcdn.net/thumb/R720x0/?fname=http://t1.daumcdn.net/brunch/service/user/2fG8/image/jG1i_PH_-M7JPZvmUJFk8GluML4.jpg',
  },
  {
    provinceId: 3,
    provinceName: '강원도',
    provinceUrl:
      'https://post-phinf.pstatic.net/MjAxOTAxMjhfMTk5/MDAxNTQ4NjYzNTQyNzI2.7nppcsLa6UTZokcS91d790P6lyouAMzX-3Zn_9T01r0g.zSLiaPN3fErmABLTBIkDHOUowOkEy61FxJlH1HyJpeMg.JPEG/GettyImages-jv11321426-2.jpg?type=w800_q75',
  },
  {
    provinceId: 4,
    provinceName: '인천',
    provinceUrl: 'https://balpumnews.cdn.ntruss.com/wp-content/uploads/2024/03/3156_16651_3458.jpg',
  },
  {
    provinceId: 5,
    provinceName: '충청북도',
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
  },
  {
    provinceId: 6,
    provinceName: '충청남도',
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
  },
  {
    provinceId: 7,
    provinceName: '전라북도',
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
  },
  {
    provinceId: 8,
    provinceName: '경상북도',
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
  },
  {
    provinceId: 9,
    provinceName: '전라남도',
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
  },
  {
    provinceId: 10,
    provinceName: '경상남도',
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
  },
  {
    provinceId: 11,
    provinceName: '제주도',
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
  },
  {
    provinceId: 12,
    provinceName: '울릉도',
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
  },
];

export default ProvinceButtonSlide;
