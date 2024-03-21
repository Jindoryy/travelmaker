import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import styled from 'styled-components';
import Box from '@mui/material/Box';

const Layout = () => {
  return (
    <ContainerBox>
      <OutletBox>
        <Outlet />
      </OutletBox>
      <FooterBox>
        <Footer />
      </FooterBox>
    </ContainerBox>
  );
};

const ContainerBox = styled(Box)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const OutletBox = styled(Box)`
  && {
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-y: scroll;
  }

  &&::-webkit-scrollbar {
    display: none;
  }
`;

const FooterBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  weight: 100vw;
  height: 3vh;
  margin-top: 8vh;
  background-color: #fff;
`;
export default Layout;
