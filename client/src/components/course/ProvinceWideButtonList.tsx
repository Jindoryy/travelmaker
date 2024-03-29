import React, { useEffect, useState } from 'react';
import ProvinceButton from '../../features/course/ProvinceWideButton';
import styled from 'styled-components';
import { getCourse } from '../../utils/axios/axios-course';
import { Skeleton } from '@mui/material';

interface Province {
  provinceId: number;
  provinceName: string;
  provinceUrl: string;
}

const ProvinceWideButtonList = () => {
  const [provinceContents, setProvinceContents] = useState<Province[]>(contents);
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
        provinceContents.map((content, index) => <ProvinceButton key={index} content={content} />)
      )}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  border-radius: 10px 10px 0 0;
  background-color: #eff1fe;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 410px;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 30px;
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

export default ProvinceWideButtonList;
