import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';

const HeaderButtons = styled(Button)`
  && {
    display: flex;
    flex-direction: row;
    font-family: 'Pretendard';
    width: 400px;
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
    &:hover {
      background-color: rgb(86, 108, 240, 0.8);
    }
    &:visited {
      background-color: rgb(86, 108, 240, 0.8);
    }
  }
`;

const HeaderTabs = ({ selectedTab, onTabChange, size }: any) => {
  const buttons = Array.from({ length: size }, (_, index) => (
    <OneButton
      disableRipple
      key={index}
      onClick={() => onTabChange(index + 1)}
      className={selectedTab === index + 1 ? 'active' : ''}
    >
      {index + 1}일차
    </OneButton>
  ));

  return <HeaderButtons disableRipple>{buttons}</HeaderButtons>;
};

export default HeaderTabs;
