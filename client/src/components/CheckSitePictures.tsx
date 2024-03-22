import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { yellow } from '@mui/material/colors';
import axios from 'axios';
import styled from 'styled-components';

interface CatImg {
  id: string;
  catUrl: string;
}

export default function Cats(): JSX.Element {
  const [pageLeft, setPageLeft] = useState<number>(0);
  const [pageRight, setPageRight] = useState<number>(0);
  const [isLoadingLeft, setIsLoadingLeft] = useState<boolean>(false);
  const [isLoadingRight, setIsLoadingRight] = useState<boolean>(false);
  const [catImgArrLeft, setCatImgArrLeft] = useState<CatImg[]>([]);
  const [catImgArrRight, setCatImgArrRight] = useState<CatImg[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

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
      const API_URL_LEFT = `https://api.thecatapi.com/v1/images/search?size=small&format=json&has_breeds=true&order=ASC&page=${pageLeft}&limit=5`;
      const response = await axios.get(API_URL_LEFT);
      const newData = response.data.map((catImg: { id: string; url: string }) => ({
        id: catImg.id,
        catUrl: catImg.url,
      })) as CatImg[];
      setCatImgArrLeft((prevData) => [...prevData, ...newData]);
    } catch (error) {
      console.log(error);
    }
    setIsLoadingLeft(false);
  };

  const fetchDataRight = async () => {
    setIsLoadingRight(true);
    try {
      const API_URL_RIGHT = `https://api.thecatapi.com/v1/images/search?size=small&format=json&has_breeds=true&order=ASC&page=${pageRight}&limit=5`;
      const response = await axios.get(API_URL_RIGHT);
      const newData = response.data.map((catImg: { id: string; url: string }) => ({
        id: catImg.id,
        catUrl: catImg.url,
      })) as CatImg[];
      setCatImgArrRight((prevData) => [...prevData, ...newData]);
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

  const handleCheckboxChange = (id: string) => {
    const isChecked = checkedItems.includes(id);
    if (isChecked) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <CatImagesContainer>
        <FlipContainer>
          <StyledCheckboxs
            {...label}
            sx={{
              color: yellow[600],
              '&.Mui-checked': {
                color: yellow[600],
              },
            }}
          />
          <Card isFlipped={isFlipped} onClick={handleCardClick}>
            <Front isDarkened>
              <img src="/img/강릉시.jpg" />
            </Front>

            <Back>
              <BackText>
                남산서울타워
                <br />
                <br />
                도심 속 로맨틱 아일랜드로 입지를 굳힌 남산서울타워는 예로부터 백년해로의 길지로 널리
                알려져있다.
              </BackText>
            </Back>
          </Card>
        </FlipContainer>
        {catImgArrLeft.map((catImg, index) => (
          <CatImageCard key={catImg.id} isDarkened={checkedItems.includes(catImg.id)}>
            <StyledCheckbox
              checked={checkedItems.includes(catImg.id)}
              onChange={() => handleCheckboxChange(catImg.id)}
              sx={{
                color: yellow[600],
                '&.Mui-checked': {
                  color: yellow[600],
                },
              }}
            />
            <img src={catImg.catUrl} alt={`Cat ${catImg.id}`} />
          </CatImageCard>
        ))}
        {isLoadingLeft && <p>Loading...</p>}
      </CatImagesContainer>
      <CatImagesContainer>
        {catImgArrRight.map((catImg, index) => (
          <CatImageCard key={catImg.id} isDarkened={checkedItems.includes(catImg.id)}>
            <StyledCheckbox
              checked={checkedItems.includes(catImg.id)}
              onChange={() => handleCheckboxChange(catImg.id)}
              sx={{
                color: yellow[600],
                '&.Mui-checked': {
                  color: yellow[600],
                },
              }}
            />
            <img src={catImg.catUrl} alt={`Cat ${catImg.id}`} />
          </CatImageCard>
        ))}
        {isLoadingRight && <p>Loading...</p>}
      </CatImagesContainer>
    </div>
  );
}

const CatImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 20px;
  margin: 10px;
  width: 45%;
`;

interface CatImageCardProps {
  isDarkened: boolean;
}

const CatImageCard = styled.div<CatImageCardProps>`
  position: relative;
  margin-top: -10px;
  margin-bottom: -10px;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    transition: filter 0.3s;
    filter: ${({ isDarkened }) => (isDarkened ? 'brightness(50%)' : 'none')};
  }
`;

const StyledCheckbox = styled(Checkbox)`
  position: absolute;
  top: 45px;
  right: -65px;
  z-index: 1;
`;

const StyledCheckboxs = styled(Checkbox)`
  position: absolute;
  top: 35px;
  right: -130px;
  z-index: 1;
`;

const FlipContainer = styled.div`
  width: 100%;
  height: auto;
  perspective: 1100px;
  margin-bottom: 40px;
`;

const Card = styled.div<{ isFlipped: boolean }>`
  width: 100%;
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

const Front = styled.div<CatImageCardProps>`
  position: absolute;
  margin-top: -10px;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: filter 0.3s;
  filter: ${({ isDarkened }) => (isDarkened ? 'brightness(50%)' : 'none')};

  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
  }
`;

const Back = styled.div`
  position: absolute;
  margin-top: -10px;
  padding-bottom: 35px;
  border-radius: 5px;

  width: 100%;
  height: 100%;
  background: lightgrey;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackText = styled.p`
  font-size: 12px;
  font-weight: bold;
  color: black;
  font-family: 'Pretendard';
  margin: 10px;
  letter-spacing: 1px;
  white-space: pre-line;
  line-height: 1.5;
`;