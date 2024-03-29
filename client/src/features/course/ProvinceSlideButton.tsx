import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface ImageProps {
  content: {
    provinceId: number;
    provinceName: string;
    provinceUrl: string;
  };
}

const ProvinceSlideButton: React.FC<ImageProps> = ({ content }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/course/city', { state: { provinceId: content.provinceId } });
  };

  return (
    <Container onClick={handleClick}>
      <Image src={content.provinceUrl} alt={content.provinceName} />
      <TextOverlay>{content.provinceName}</TextOverlay>
    </Container>
  );
};

const Container = styled.div`
  width: 140px;
  height: 220px;
  position: relative;
  border-radius: 10px;
  box-shadow: 0px 8px 6px -6px rgba(0, 0, 0, 1);
`;

const Image = styled.img`
  width: 140px;
  height: 220px;
  left: 0;
  top: 0;
  margin: 0;
  position: absolute;
  object-fit: cover;
  object-position: center bottom;
  border-radius: 10px;
`;

const TextOverlay = styled.div`
  width: 140px;
  height: 220px;
  left: 0;
  top: 160px;
  position: absolute;
  text-align: center;
  color: #ffc65c;
  font-family: 'Black Han Sans', sans-serif;
  font-weight: normal;
  font-size: 20px;
`;

export default ProvinceSlideButton;
