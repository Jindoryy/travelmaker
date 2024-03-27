import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { destinationArray } from '../utils/axios/axios-travel';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

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
      {/* siteInfo의 data 배열을 map으로 순회하여 각 사이트의 정보를 표시 */}
      {siteInfo.data.map((site, index) => (
        <div key={index}>
          <p>Destination ID: {site.destinationId}</p>
          <p>Destination Type: {site.destinationType}</p>
          <p>Destination Name: {site.destinationName}</p>
          <img src={site.destinationImgUrl} alt={site.destinationName} />
        </div>
      ))}
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  margin-top: 100px;
  background-color: lightgray;
  padding: 10px;
  border-radius: 5px;
`;

export default CheckSitePictures;
