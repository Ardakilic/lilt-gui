import type { SelectHTMLAttributes } from 'react';
import React from 'react';
import styled from 'styled-components';

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 40px 10px 12px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.fontSize.md};
  font-family: inherit;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  transition: ${(props) => props.theme.transitions.default};
  outline: none;
  cursor: pointer;
  appearance: none;
  
  &:focus {
    border-color: ${(props) => props.theme.colors.borderFocus};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:disabled {
    background: ${(props) => props.theme.colors.gray100};
    color: ${(props) => props.theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 12px;
`;

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ options, placeholder, ...props }) => {
  return (
    <SelectContainer>
      <StyledSelect {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      <SelectIcon>▼</SelectIcon>
    </SelectContainer>
  );
};
