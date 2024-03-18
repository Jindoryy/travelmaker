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

  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <DogImagesContainer>
        <FlipContainer>
          <Card isFlipped={isFlipped} onClick={handleCardClick}>
            <Front>
              <StyledCheckbox
                {...label}
                sx={{
                  color: pink[600],
                  '&.Mui-checked': {
                    color: pink[600],
                  },
                }}
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
              />
              <img src="/img/강릉시.jpg" />
            </Front>
            <Back>
              <StyledCheckbox
                {...label}
                sx={{
                  color: pink[600],
                  '&.Mui-checked': {
                    color: pink[600],
                  },
                }}
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
              />
              <BackText>
                남산서울타워 서울특별시 용산구 남산공원길 105 도심 속 로맨틱 아일랜드로 입지를
                굳힌 남산서울타워는 예로부터 백년해로의 길지로 널리 알려져있다.
              </BackText>
            </Back>
          </Card>
        </FlipContainer>
        {dogImgArrLeft.map((dogImg, index) => (
          <DogImageCard key={dogImg.id}>
            <StyledCheckbox
              {...label}
              sx={{
                color: pink[600],
                '&.Mui-checked': {
                  color: pink[600],
                },
              }}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
            />
            <img src={dogImg.dogUrl} alt={`Dog ${dogImg.id}`} />
          </DogImageCard>
        ))}
        {isLoadingLeft && <p>Loading...</p>}
        <div id="observerLeft" style={{ height: '10px' }}></div>
      </DogImagesContainer>
      <DogImagesContainer>
        {dogImgArrRight.map((dogImg, index) => (
          <DogImageCard key={dogImg.id}>
            <StyledCheckbox
              {...label}
              sx={{
                color: pink[600],
                '&.Mui-checked': {
                  color: pink[600],
                },
              }}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
            />
            <img src={dogImg.dogUrl} alt={`Dog ${dogImg.id}`} />
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
  /* padding: 10px; */
  margin-top: -10px;
  margin-bottom: -10px;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
  }
`;

const FlipContainer = styled.div`
  width: 100%;
  height: auto;
  perspective: 1100px;
  margin-bottom: 40px;
`;

const Card = styled.div<{ isFlipped: boolean }>`
  width: 165px;
  height: 200px;
  position: relative;
  transition: 0.4s;
  transform-style: preserve-3d;

  ${({ isFlipped }) =>
    isFlipped &&
    `
    transform: rotateY(180deg);
  `}
`;

const Front = styled.div`
  position: absolute;
  margin-top: -10px;
  width: 100%;
  height: 100%;
  /* background: red; */
  backface-visibility: hidden;
  text-align: center;
  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
  }
`;

const Back = styled.div`
  position: absolute;
  margin-top: 30px;
  width: 100%;
  height: 100%;
  background: lightgrey;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
`;

const BackText = styled.p`
  font-size: 16px;
  color: black;
`;

const StyledCheckbox = styled(Checkbox)`
  position: absolute;
  top: 40px;
  right: -60px;
`;
