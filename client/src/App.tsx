import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';

import Layout from './pages/Layout';
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
          path: '/login',
          element: <LoginPage />,
          errorElement: <ErrorPage />,
        },
      ],
    },
  ]);
  return (
    <>
      <StyledContainer>
          <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
      </StyledContainer>
    </>
  );
}

const StyledContainer = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: auto;
  max-width: 412px;
  height: 100vh;
  overscroll-behavior-y: none;
  touch-action: none;
`;

export default App;
