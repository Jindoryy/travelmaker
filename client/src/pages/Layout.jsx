import { Outlet } from 'react-router-dom';
import Footer from '../componenets/Footer';

const Layout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
