import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './utils/theme';
import './App.css';

import Layout from './pages/Layout';
import MainPage from './pages/main/MainPage';
import CheckStie from './pages/course/CheckSite';
import LoginPage from './pages/user/LoginPage';
import StartPage from './pages/main/StartPage';
import ErrorPage from './pages/ErrorPage';
import CityChoice from './pages/course/CityChoice';
import BeforeConfirm from './pages/course/BeforeConfirm';
import OauthLandingPage from './pages/user/OauthLandingPage';
import EditCoursePage from './pages/course/EditCoursePage';
import ProvinceChoicePage from './pages/course/ProvinceChoicePage';
import MyPage from './pages/user/MyPage';
import DiaryWrite from './pages/user/DiaryWrite';
import DiaryDetail from './pages/user/DiaryDetail';
import DiaryUpdate from './pages/user/DiaryUpdate';
import DateTransChoice from './pages/course/DateTransChoice';
import AloneTogetherChoice from './pages/course/AloneTogetherChoice';
import MakeGroup from './pages/course/MakeGroup';
import CourseDetailPage from './pages/course/CourseDetailPage';
import LoadingComponent from './components/common/LoadingComponent';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: <StartPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: 'main',
          element: <MainPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: 'course',
          children: [
            {
              path: 'datetrans',
              element: <DateTransChoice />,
              errorElement: <ErrorPage />,
            },
            {
              path: 'alonetogether',
              element: <AloneTogetherChoice />,
              errorElement: <ErrorPage />,
            },
            {
              path: 'makegroup',
              element: <MakeGroup />,
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
            {
              path: 'detail/:travelId',
              element: <CourseDetailPage />,
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
          path: '/mypage',
          element: <MyPage />,
          errorElement: <ErrorPage />,
        },
        {
          //나중에 파라미터 추가
          path: '/diary/detail',
          element: <DiaryDetail />,
          errorElement: <ErrorPage />,
        },
        {
          //나중에 파라미터 추가
          path: '/diary/write',
          element: <DiaryWrite />,
          errorElement: <ErrorPage />,
        },
        {
          //나중에 파라미터 추가
          path: '/diaryupdate',
          element: <DiaryUpdate />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/editcourse',
          element: <EditCoursePage />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/test',
          element: <LoadingComponent />,
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
  max-width: 412px;
  width: 100vw;
  height: 100vh;
  margin-right: auto;
  margin-left: auto;
  padding: 0;
  overscroll-behavior-y: none;
`;

export default App;
