import { forwardRef, type InputHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

interface StyledInputProps {
  $hasError?: boolean;
}

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.fontSize.md};
  font-family: inherit;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  transition: ${(props) => props.theme.transitions.default};
  outline: none;
  
  &::placeholder {
    color: ${(props) => props.theme.colors.textLight};
  }
  
  &:focus {
    border-color: ${(props) => props.theme.colors.borderFocus};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  ${(props) =>
    props.$hasError &&
    css`
    border-color: ${props.theme.colors.error};
    
    &:focus {
      border-color: ${props.theme.colors.error};
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
  
  &:disabled {
    background: ${(props) => props.theme.colors.gray100};
    color: ${(props) => props.theme.colors.textLight};
    cursor: not-allowed;
  }
`;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ hasError, ...props }, ref) => {
  return <StyledInput ref={ref} $hasError={hasError} {...props} />;
});

Input.displayName = 'Input';
