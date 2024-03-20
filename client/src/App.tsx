import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './utils/theme';
import './App.css';

import Layout from './pages/Layout';
import LoginPage from './pages/user/LoginPage';
import ErrorPage from './pages/ErrorPage';
import CityChoice from './pages/course/CityChoice';
import OauthLandingPage from './pages/user/OauthLandingPage';
import ProvinceChoicePage from './pages/course/ProvinceChoicePage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        // {
        //   path: '/',
        //   element: 메인페이지,
        //   errorElement: <ErrorPage />,
        // },
        {
          path: '/course/city',
          element: <CityChoice />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/course/province',
          element: <ProvinceChoicePage />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/login',
          element: <LoginPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/login/oauth2/code/kakao',
          element: <OauthLandingPage />,
          errorElement: <ErrorPage />,
        },
      ],
    },
  ]);
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        {' '}
        {/* 라이트 테마 또는 다크 테마를 선택하여 사용 */}
        <StyledContainer>
          <RouterProvider router={router} />
        </StyledContainer>
      </ThemeProvider>
    </>
  );
}

const StyledContainer = styled.div`
  background-color: #fff;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  max-width: 412px;
  height: 90vh;
  overscroll-behavior-y: none;
  touch-action: none;
`;

export default App;
