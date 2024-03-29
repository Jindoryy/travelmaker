import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { destinationArray } from '../utils/axios/axios-travel';
import { useLocation, useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';

interface CheckSitePicturesProps {
  array: number[]; // array props의 타입을 명시적으로 정의
}

interface SiteInfoProps {
  status: string;
  data: [
    {
      destinationId: number;
      destinationType: string;
      destinationName: string;
      destinationImgUrl: string;
    },
  ];
}

const CheckSitePictures: React.FC<CheckSitePicturesProps> = ({ array }) => {
  const [siteInfo, setSiteInfo] = useState<SiteInfoProps>({
    status: '',
    data: [
      {
        destinationId: 0,
        destinationType: '',
        destinationName: '',
        destinationImgUrl: '',
      },
    ],
  });
  const location = useLocation();

  useEffect(() => {
    // 컴포넌트가 마운트될 때 한 번만 실행
    getSiteInfo(array);
  }, [array]); // array가 변경될 때마다 실행

  const getSiteInfo = (array: number[]) => {
    destinationArray(array)
      .then((response) => {
        const siteResponse: SiteInfoProps = {
          status: response.data.status,
          data: response.data.data,
        };
        setSiteInfo(siteResponse);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <StyledDiv>
      {siteInfo.data.map((site, index) => (
        <SiteContainer key={index}>
          <SiteImage src={site.destinationImgUrl} alt={site.destinationName} />
        </SiteContainer>
      ))}
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  margin-top: 100px;
  background-color: yellow;
  padding: 10px;
  border-radius: 5px;
  max-width: 412px;
  width: 45%;
`;

const SiteContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap; /* 요소들이 자동으로 줄 바꿈되도록 설정 */
  justify-content: center; /* 요소들을 가운데 정렬 */
`;

const SiteImage = styled.img`
  width: 200px;
  height: auto;
  margin: 5px;
`;

export default CheckSitePictures;
