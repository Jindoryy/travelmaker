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

const ContainerBox = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-family: 'Pretendard';
  letter-spacing: -1px;
`;

const OutletBox = styled.div`
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
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
