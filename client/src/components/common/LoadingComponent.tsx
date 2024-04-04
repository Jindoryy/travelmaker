import { styled } from 'styled-components';

const LoadingComponent = () => {
  return (
    <Overlay>
      <StyledImage src={getImage()} alt="Loading" />
      <LoadingText>조금만 기다려주세요...</LoadingText>
    </Overlay>
  );
};

export default LoadingComponent;

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const StyledImage = styled.img`
  width: 95%;
  object-fit: cover;
`;

const LoadingText = styled.div`
  width: 95%;
  text-align: center;
  font-weight: bold;
  font-size: 22px;
`;

const getImage = () => {
  return require('../../assets/image/MapGif3.gif');
};
