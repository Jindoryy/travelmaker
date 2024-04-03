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
  width: 95%;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 30px;
`;

export default ProvinceWideButtonList;
