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

const ProvinceWideButton: React.FC<ImageProps> = ({ content }) => {
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
  width: 93%;
  height: 80px;
  position: relative;
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: 0.5rem;
  &:hover img {
    transform: scale(1.2);
    transition-duration: 0.5s;
  }
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.6), transparent);
  }
`;

const Image = styled.img`
  width: 370px;
  height: 110px;
  margin: 0;
  object-fit: cover;
  object-position: center bottom;
  border-radius: 0.5rem;
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  padding-right: 1rem;
  text-align: center;
  color: #ffc65c;
  font-family: 'Black Han Sans', sans-serif;
  font-size: 2rem;
  z-index: 1;
`;

export default ProvinceWideButton;
