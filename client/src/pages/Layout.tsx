import { Outlet } from 'react-router-dom';
import Footer from '../components/common/Footer';
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
  justify-content: space-between;
  align-items: center;
  font-family: 'IBM Plex Sans KR', sans-serif;
`;

const OutletBox = styled(Box)`
  && {
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-y: auto;
  }

  &&::-webkit-scrollbar {
    display: none;
  }
  flex: 1;
`;

const FooterBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 2vh;
  margin-top: 8vh;
  background-color: #fff;
`;
export default Layout;
