import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './utils/theme';
import './App.css';

import Layout from './pages/Layout';
import MainPage from './pages/main/MainPage';
import CheckStie from './pages/course/CheckSite';
import LoginPage from './pages/user/LoginPage';
import ErrorPage from './pages/ErrorPage';
import CityChoice from './pages/course/CityChoice';
import BeforeConfirm from './pages/course/BeforeConfirm';
import OauthLandingPage from './pages/user/OauthLandingPage';
import EditCoursePage from './pages/course/EditCoursePage';
import ProvinceChoicePage from './pages/course/ProvinceChoicePage';
import DateTrans from './pages/course/DateTrans';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: <MainPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: 'course',
          children: [
            {
              path: 'datetrans',
              element: <DateTrans />,
              errorElement: <ErrorPage />,
            },
            {
              path: 'city',
              element: <CityChoice />,
              errorElement: <ErrorPage />,
            },
            {
              path: 'checksite',
              element: <CheckStie />,
              errorElement: <ErrorPage />,
            },
            {
              path: 'province',
              element: <ProvinceChoicePage />,
              errorElement: <ErrorPage />,
            },
            {
              path: 'beforeconfirm',
              element: <BeforeConfirm />,
              errorElement: <ErrorPage />,
            },
          ],
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
        {
          path: '/editcourse',
          element: <EditCoursePage />,
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
  width: 100vw;
  height: 100vh;
  overscroll-behavior-y: none;
`;

export default App;
