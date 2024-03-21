import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import styled from 'styled-components';
import Box from '@mui/material/Box';

const Layout = () => {
  return (
    <ContainerBox>
      <Outlet />
      <Footer />
    </ContainerBox>
  );
};

const ContainerBox = styled(Box)`
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default Layout;
