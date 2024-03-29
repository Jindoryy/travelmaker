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
      <Footer />
    </ContainerBox>
  );
};

const ContainerBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const OutletBox = styled(Box)`
  padding-bottom: 80px;
`;
export default Layout;
