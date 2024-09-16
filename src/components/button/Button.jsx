import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${(props) => (props.primary ? "#007bff" : "#6c757d")};
  color: white;
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: ${(props) => (props.primary ? "#0056b3" : "#5a6268")};
  }

  &:active {
    background-color: ${(props) => (props.primary ? "#003e7e" : "#4e555b")};
  }
`;

const Button = ({ children, primary, onClick }) => {
  return (
    <StyledButton primary={primary} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;
