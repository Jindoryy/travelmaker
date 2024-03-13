import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </StyledFooter>
  );
};

export default Footer;
