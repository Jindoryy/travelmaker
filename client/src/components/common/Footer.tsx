import React, { useState, useEffect } from 'react';
import type { SVGProps } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useUserInfo from '../../store/useUserStore';

const Footer = (props: SVGProps<SVGSVGElement>) => {
  const [activeButton, setActiveButton] = useState(2);
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();
  const location = useLocation();
  const isCoursePage = location.pathname.startsWith('/course');
  const isMyPage = location.pathname.startsWith('/mypage');
  const isDiaryPage = location.pathname.startsWith('/diary');
  const isLoginPage = location.pathname.startsWith('/login');

  useEffect(() => {
    if (isCoursePage) {
      setActiveButton(1);
    } else if (isMyPage || isDiaryPage) {
      setActiveButton(3);
    } else if (isLoginPage) {
      setActiveButton(0);
    }
  }, [isCoursePage, isMyPage, isDiaryPage, isLoginPage]);

  const checkLoginAndNavigatetoMap = () => {
    if (userInfo.userId === -1 || userInfo.userId === undefined) {
      // userId가 -1이거나 undefined면 로그인 페이지로 이동
      setActiveButton(0);
      navigate('/login');
    } else {
      setActiveButton(1);
      navigate('/course/datetrans');
    }
  };
  const checkLoginAndNavigate = () => {
    if (userInfo.userId === -1 || userInfo.userId === undefined) {
      // userId가 -1이거나 undefined면 로그인 페이지로 이동
      setActiveButton(0);
      navigate('/login');
    } else {
      setActiveButton(3);
      navigate('/mypage');
    }
  };

  return (
    <FooterBox>
      <OneButton
        disableRipple
        className={activeButton === 1 ? 'active' : undefined}
        onClick={() => {
          checkLoginAndNavigatetoMap();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40px"
          height="40px"
          viewBox="0 0 24 24"
          {...props}
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            d="M3 8.71c0-1.474 0-2.21.393-2.64a1.5 1.5 0 0 1 .497-.36c.532-.236 1.231-.003 2.629.463c1.067.356 1.6.534 2.14.515a3 3 0 0 0 .588-.078c.525-.125.993-.437 1.929-1.06l1.382-.922c1.2-.8 1.799-1.2 2.487-1.291c.688-.093 1.372.135 2.739.591l1.165.388c.99.33 1.485.495 1.768.888c.283.393.283.915.283 1.958v8.129c0 1.473 0 2.21-.393 2.64a1.5 1.5 0 0 1-.497.358c-.532.237-1.231.004-2.629-.462c-1.067-.356-1.6-.534-2.14-.515a3.001 3.001 0 0 0-.588.078c-.525.125-.993.437-1.929 1.06l-1.382.922c-1.2.8-1.799 1.2-2.487 1.291c-.688.093-1.372-.135-2.739-.591l-1.165-.388c-.99-.33-1.485-.495-1.768-.888C3 18.403 3 17.88 3 16.838zm6-2.071V20.5M15 3v14"
          ></path>
        </svg>
      </OneButton>
      <OneButton
        disableRipple
        className={activeButton === 2 ? 'active' : undefined}
        onClick={() => {
          setActiveButton(2);
          navigate('/main');
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40px"
          height="40px"
          viewBox="0 0 24 24"
          {...props}
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
          >
            <path d="M6.133 21C4.955 21 4 20.02 4 18.81v-8.802c0-.665.295-1.295.8-1.71l5.867-4.818a2.09 2.09 0 0 1 2.666 0l5.866 4.818c.506.415.801 1.045.801 1.71v8.802c0 1.21-.955 2.19-2.133 2.19z"></path>
            <path d="M9.5 21v-5.5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2V21"></path>
          </g>
        </svg>
      </OneButton>
      <OneButton
        disableRipple
        className={activeButton === 3 ? 'active' : undefined}
        onClick={() => checkLoginAndNavigate()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40px"
          height="40px"
          viewBox="0 0 16 16"
          {...props}
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
          >
            <circle cx={8} cy={6} r={3.25}></circle>
            <path d="M2.75 14.25c0-2.5 2-5 5.25-5s5.25 2.5 5.25 5"></path>
          </g>
        </svg>
      </OneButton>
    </FooterBox>
  );
};

const FooterBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 412px;
  width: 100vw;
  padding: 15px 0;
  margin: auto;
  position: fixed;
  bottom: 0;
  background-color: white;
  z-index: 99;
`;

const OneButton = styled(Button)`
  && {
    width: 100%;
    color: ${(props) => (props.className === 'active' ? '#566CF0' : '#cccccc')};
  }
`;
export default Footer;
