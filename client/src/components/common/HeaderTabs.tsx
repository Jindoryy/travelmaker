import React, { useState } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';

const HeaderTabs = ({ selectedTab, letters, onTabChange, size }: any) => {
  return (
    <HeaderBox>
      {Array.from({ length: size }, (_, index) => (
        <OneButton
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

const HeaderBox = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 10px 0px;
  padding: 2px 4px;
  height: 50px;
  background-color: #f2f4f6;
  border-radius: 30px;
`;

const OneButton = styled.button`
  width: 130px;
  height: 40px;
  border-radius: 30px;
  background-color: ${(props) =>
    props.className === 'active' ? 'rgba(86, 108, 240, 0.8)' : '#f2f4f6'};
  color: ${(props) => (props.className === 'active' ? 'white' : '#B1AFAF')};
  font-size: 16px;
  font-weight: bold;
  border: none;
`;

export default HeaderTabs;
