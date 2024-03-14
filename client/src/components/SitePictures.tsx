import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface DogImg {
  id: string;
  dogUrl: string;
}

export default function Dogs(): JSX.Element {
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dogImgArr, setDogImgArr] = useState<DogImg[]>([]);

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
    });
    const observerTarget = document.getElementById('observer');
    if (observerTarget) {
      observer.observe(observerTarget);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const API_URL = `https://api.thedogapi.com/v1/images/search?size=small&format=json&has_breeds=true&order=ASC&page=${page}&limit=10`;
      const response = await axios.get(API_URL);
      const newData = response.data.map((dogImg: { id: string; url: string }) => ({
        id: dogImg.id,
        dogUrl: dogImg.url,
      })) as DogImg[];
      setDogImgArr((prevData) => [...prevData, ...newData]);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <DogImagesContainer>
      {dogImgArr.map((dogImg, index) => (
        <DogImageCard key={dogImg.id}>
          <img src={dogImg.dogUrl} alt={`Dog ${dogImg.id}`} />
          <p>cute_{dogImg.id}</p>
        </DogImageCard>
      ))}
      {isLoading && <p>Loading...</p>}
      <div id="observer" style={{ height: '10px' }}></div>
    </DogImagesContainer>
  );
}

const DogImagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 한 줄에 두 개의 열 설정 */
  gap: 20px; /* 그리드 아이템 간격 설정 */
`;

const DogImageCard = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
  }
`;
