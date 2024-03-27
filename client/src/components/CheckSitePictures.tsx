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
  destinationId: number;
  destinationType: string;
  destinationName: string;
  destinationImgUrl: string;
}

const CheckSitePictures: React.FC<CheckSitePicturesProps> = ({ array }) => {
  const [siteInfoList, setSiteInfoList] = useState<SiteInfoProps[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  // const gotoMain = () => {
  //   navigate("/main", {
  //     state: {
  //       userId: user.uid
  //     }
  //   });
  // };

  return (
    <div>
      {siteInfoList.map((site) => (
        <div key={site.destinationId}>
          <p>{site.destinationName}</p>
          <img src={site.destinationImgUrl} alt={site.destinationName} />
        </div>
      ))}
    </div>
  );
};

export default CheckSitePictures;
