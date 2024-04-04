import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Masonry from '@mui/lab/Masonry';
import Checkbox from '@mui/material/Checkbox';
import { yellow } from '@mui/material/colors';

const ChooseSitePictures: React.FC<any> = ({ array, onlikeChange }) => {
  const [siteInfo, setSiteInfo] = useState<any>([...array]);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [imageHeights, setImageHeights] = useState<number[]>([]);

  useEffect(() => {
    const heights = array.map(() => getRandomHeight());
    setImageHeights(heights);
  }, [array]);

  const getRandomHeight = () => {
    return Math.floor(Math.random() * 200) + 150; // 200부터 400까지의 랜덤한 값 생성
  };

  const handleImageClick = (index: number) => {
    // 이미지 클릭 시 뒤집기
    setFlippedIndex(index === flippedIndex ? null : index);
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <Masonry columns={2} spacing={1}>
      {array.map((site: any, index: any) => (
        <SiteContainer key={site.destinationId}>
          <StyledCheckbox
            {...label}
            sx={{
              color: yellow[600],
              '&.Mui-checked': {
                color: yellow[600],
              },
            }}
            checked={site.likes_flag}
            onChange={() => onlikeChange(site.destinationId)}
          />
          <SiteImage
            style={{ height: `${imageHeights[index]}px` }}
            src={site.destinationImgUrl}
            alt={site.destinationName}
            onClick={() => handleImageClick(index)}
            isFlipped={index === flippedIndex}
          />

          {index === flippedIndex && (
            <Back onClick={() => handleImageClick(index)}>
              {site.destinationContent ? (
                <BackText>
                  {site.destinationName.length > 10
                    ? site.destinationName.slice(0, 9) + '...'
                    : site.destinationName}
                  <hr />
                  {site.destinationContent.length > 50
                    ? site.destinationContent.slice(0, 50) + '...'
                    : site.destinationContent}
                </BackText>
              ) : (
                // destinationContent가 null인 경우
                <BackText>
                  {site.destinationName.length > 10
                    ? site.destinationName.slice(0, 9) + '...'
                    : site.destinationName}
                </BackText>
              )}
            </Back>
          )}
        </SiteContainer>
      ))}
    </Masonry>
  );
};

const SiteContainer = styled.div`
  margin: 5px; /* 위아래 및 좌우 간격을 조정할 margin 값 */
  padding: 10px 0px 10px 10px;
  border-radius: 5px;
  max-width: 47%;
  /* max-height: 80px; */
  text-align: center;
  position: relative;
`;

const SiteImage = styled.img<{ isFlipped: boolean }>`
  margin: 5px;
  max-width: 100%;
  margin-top: -25px;
  margin-bottom: -30px;
  /* height: auto; */
  object-fit: cover;
  border-radius: 10px;
  transform: ${({ isFlipped }) =>
    isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'}; // 클릭 시 뒤집힌 이미지의 회전
  transition: transform 0.5s ease; // 부드러운 애니메이션 효과 추가
`;

const Back = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  margin-right: -6px;
  margin-bottom: -20px;
  background-color: rgba(255, 255, 255, 0.8);
  backface-visibility: hidden; // 뒷면 텍스트가 앞면에 보이지 않도록 함
  display: flex;
  justify-content: center; /* 가로 가운데 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
`;

const BackText = styled.p`
  font-size: 12px;
  font-weight: bold;
  color: black;
  text-align: center; // 가운데 정렬
  padding: 10px;
  padding-left: 15px;
  letter-spacing: 1px;
  white-space: pre-line; /* 줄바꿈 유지 */
  line-height: 1.5;
`;

const StyledCheckbox = styled(Checkbox)`
  position: absolute;
  top: 20px;
  right: -40%;
  z-index: 1;
`;

export default ChooseSitePictures;
