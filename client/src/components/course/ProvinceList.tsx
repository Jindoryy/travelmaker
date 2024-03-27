import React, { useEffect, useState } from 'react';
import ProvinceButton from '../../features/course/ProvinceButton';
import styled from 'styled-components';
import { getCourse } from '../../utils/axios/axios-course';
import { Skeleton } from '@mui/material';

interface Province {
  provinceId: number;
  provinceName: string;
  provinceUrl: string;
}

const ProvinceList = () => {
  const [provinceContents, setProvinceContents] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);

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
      {loading || provinceContents.length === 0 ? (
        <>
          <Skeleton variant="rectangular" width={210} height={118} />
          <Skeleton width="60%" />
          <Skeleton width="80%" />
        </>
      ) : (
        <GridContainer>
          {provinceContents.map((content, index) => (
            <ProvinceButton key={index} content={content} />
          ))}
        </GridContainer>
      )}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  max-width: 350px;
  flex-direction: column;
  padding: 10px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px; /* 원하는 간격으로 조정 가능 */
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
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
  },
  {
    provinceId: 3,
    provinceName: '강원도',
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
  },
  {
    provinceId: 4,
    provinceName: '인천',
    provinceUrl: 'https://cdn.pixabay.com/photo/2022/10/15/16/44/night-view-7523474_1280.jpg',
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
export default ProvinceList;
