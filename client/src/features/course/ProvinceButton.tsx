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

const ProvinceButton: React.FC<ImageProps> = ({ content }) => {
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
  width: 10rem;
  height: 10rem;
  position: relative;
`;

const Image = styled.img`
  width: 40rem;
  height: 10rem;
  left: 0;
  top: 0;
  margin: 0;
  position: absolute;
  border-radius: 0.5rem;
`;

const TextOverlay = styled.div`
  width: 10rem;
  height: 2.5rem;
  left: 0;
  top: 6.675rem;
  position: absolute;
  text-align: center;
  color: #ffc65c;
  font-family: 'Black Han Sans', sans-serif;
  font-weight: normal;
  font-size: 2.8rem;
`;

export default ProvinceButton;
