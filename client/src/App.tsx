import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './utils/theme';
import './App.css';

import Layout from './pages/Layout';
import MainPage from './pages/main/MainPage';
import LoginPage from './pages/user/LoginPage';
import ErrorPage from './pages/ErrorPage';

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
          path: '/main',
          element: <MainPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/login',
          element: <LoginPage />,
          errorElement: <ErrorPage />,
        },
      ],
    },
  ]);
  return (
    <>
      <ThemeProvider theme={darkTheme}>
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
