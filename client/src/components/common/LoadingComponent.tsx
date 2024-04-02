import { styled } from 'styled-components';

const LoadingComponent = () => {
  return (
    <Overlay>
      <StyledImage src={getImage()} alt="Loading" />
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
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const StyledImage = styled.img`
  width: 410px;
  object-fit: cover;
`;

const getImage = () => {
  return require('../../assets/image/MapGif3.gif');
};
