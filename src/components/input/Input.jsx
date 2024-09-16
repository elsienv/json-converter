import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 8px;
  width: 100%;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 4px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Input = ({ value, onChange, placeholder, type = "text" }) => {
  return (
    <StyledInput
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default Input;
