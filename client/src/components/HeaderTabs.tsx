import React, { useState } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const HeaderTabs = ({ selectedTab, letters, onTabChange, size }: any) => {
  return (
    <HeaderBox>
      {Array.from({ length: size }, (_, index) => (
        <OneButton
          disableRipple
          key={index}
          onClick={() => onTabChange(index + 1)}
          className={selectedTab === index + 1 ? 'active' : ''}
        >
          {letters[index]}
        </OneButton>
      ))}
    </HeaderBox>
  );
};

const HeaderBox = styled(Box)`
  && {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: auto;
    margin-top: 10px;
    padding: 2px 4px;
    height: 50px;
    background-color: #f2f4f6;
    border-radius: 30px;
    hover: none;
  }
`;

const OneButton = styled(Button)`
  && {
    display: flex;
    width: 130px;
    height: 40px;
    border-radius: 30px;
    background-color: ${(props) =>
      props.className === 'active' ? 'rgb(86, 108, 240, 0.8)' : '#f2f4f6'};
    color: ${(props) => (props.className === 'active' ? 'white' : '#B1AFAF')};
    font-family: 'Pretendard';
    font-size: 16px;
    font-weight: bold;
    . &:hover {
      background-color: rgb(86, 108, 240, 0.8);
    }
    &:visited {
      background-color: rgb(86, 108, 240, 0.8);
    }
  }
`;

export default HeaderTabs;
