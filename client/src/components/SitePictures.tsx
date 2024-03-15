import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { pink } from '@mui/material/colors';
import axios from 'axios';
import styled from 'styled-components';

interface DogImg {
  id: string;
  dogUrl: string;
}

export default function Dogs(): JSX.Element {
  const [pageLeft, setPageLeft] = useState<number>(0);
  const [pageRight, setPageRight] = useState<number>(0);
  const [isLoadingLeft, setIsLoadingLeft] = useState<boolean>(false);
  const [isLoadingRight, setIsLoadingRight] = useState<boolean>(false);
  const [dogImgArrLeft, setDogImgArrLeft] = useState<DogImg[]>([]);
  const [dogImgArrRight, setDogImgArrRight] = useState<DogImg[]>([]);

  const handleObserverLeft = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoadingLeft) {
      setPageLeft((prevPage) => prevPage + 1);
    }
  };

  const handleObserverRight = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoadingRight) {
      setPageRight((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const observerLeft = new IntersectionObserver(handleObserverLeft, {
      threshold: 0,
    });
    const observerTargetLeft = document.getElementById('observerLeft');
    if (observerTargetLeft) {
      observerLeft.observe(observerTargetLeft);
    }

    const observerRight = new IntersectionObserver(handleObserverRight, {
      threshold: 0,
    });
    const observerTargetRight = document.getElementById('observerRight');
    if (observerTargetRight) {
      observerRight.observe(observerTargetRight);
    }
  }, []);

  useEffect(() => {
    fetchDataLeft();
  }, [pageLeft]);

  useEffect(() => {
    fetchDataRight();
  }, [pageRight]);

  const fetchDataLeft = async () => {
    setIsLoadingLeft(true);
    try {
      const API_URL_LEFT = `https://api.thedogapi.com/v1/images/search?size=small&format=json&has_breeds=true&order=ASC&page=${pageLeft}&limit=5`;
      const response = await axios.get(API_URL_LEFT);
      const newData = response.data.map((dogImg: { id: string; url: string }) => ({
        id: dogImg.id,
        dogUrl: dogImg.url,
      })) as DogImg[];
      setDogImgArrLeft((prevData) => [...prevData, ...newData]);
    } catch (error) {
      console.log(error);
    }
    setIsLoadingLeft(false);
  };

  const fetchDataRight = async () => {
    setIsLoadingRight(true);
    try {
      const API_URL_RIGHT = `https://api.thedogapi.com/v1/images/search?size=small&format=json&has_breeds=true&order=ASC&page=${pageRight}&limit=5`;
      const response = await axios.get(API_URL_RIGHT);
      const newData = response.data.map((dogImg: { id: string; url: string }) => ({
        id: dogImg.id,
        dogUrl: dogImg.url,
      })) as DogImg[];
      setDogImgArrRight((prevData) => [...prevData, ...newData]);
    } catch (error) {
      console.log(error);
    }
    setIsLoadingRight(false);
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <DogImagesContainer>
        {dogImgArrLeft.map((dogImg, index) => (
          <DogImageCard key={dogImg.id}>
            <img src={dogImg.dogUrl} alt={`Dog ${dogImg.id}`} />
            <StyledCheckbox
              {...label}
              sx={{
                '&.Mui-checked': {
                  color: pink[600],
                },
              }}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
            />
          </DogImageCard>
        ))}
        {isLoadingLeft && <p>Loading...</p>}
        <div id="observerLeft" style={{ height: '10px' }}></div>
      </DogImagesContainer>
      <DogImagesContainer>
        {dogImgArrRight.map((dogImg, index) => (
          <DogImageCard key={dogImg.id}>
            <img src={dogImg.dogUrl} alt={`Dog ${dogImg.id}`} />
            <StyledCheckbox
              {...label}
              sx={{
                '&.Mui-checked': {
                  color: pink[600],
                },
              }}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
            />
          </DogImageCard>
        ))}
        {isLoadingRight && <p>Loading...</p>}
        <div id="observerRight" style={{ height: '10px' }}></div>
      </DogImagesContainer>
    </div>
  );
}

const DogImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 20px;
  /* padding: 10px; */
  margin: 10px;
  width: 45%;
`;

const DogImageCard = styled.div`
  position: relative;
  padding: 10px;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  position: absolute;
  top: 10px;
  right: 10px;
`;
