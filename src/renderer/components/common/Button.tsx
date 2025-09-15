import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth?: boolean;
}

const buttonVariants = {
  primary: css`
    background: ${props => props.theme.colors.primary};
    color: white;
    border: 1px solid ${props => props.theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.colors.primaryDark};
      border-color: ${props => props.theme.colors.primaryDark};
    }
  `,
  secondary: css`
    background: ${props => props.theme.colors.gray100};
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.colors.gray200};
    }
  `,
  success: css`
    background: ${props => props.theme.colors.success};
    color: white;
    border: 1px solid ${props => props.theme.colors.success};
    
    &:hover:not(:disabled) {
      background: #059669;
    }
  `,
  warning: css`
    background: ${props => props.theme.colors.warning};
    color: white;
    border: 1px solid ${props => props.theme.colors.warning};
    
    &:hover:not(:disabled) {
      background: #d97706;
    }
  `,
  error: css`
    background: ${props => props.theme.colors.error};
    color: white;
    border: 1px solid ${props => props.theme.colors.error};
    
    &:hover:not(:disabled) {
      background: #dc2626;
    }
  `,
  ghost: css`
    background: transparent;
    color: ${props => props.theme.colors.primary};
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.colors.gray50};
    }
  `,
};

const buttonSizes = {
  sm: css`
    padding: 6px 12px;
    font-size: ${props => props.theme.fontSize.sm};
    min-height: 32px;
  `,
  md: css`
    padding: 8px 16px;
    font-size: ${props => props.theme.fontSize.md};
    min-height: 40px;
  `,
  lg: css`
    padding: 12px 20px;
    font-size: ${props => props.theme.fontSize.lg};
    min-height: 48px;
  `,
};

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: ${props => props.theme.fontWeight.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  text-decoration: none;
  outline: none;
  white-space: nowrap;
  
  ${props => buttonVariants[props.$variant]}
  ${props => buttonSizes[props.$size]}
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span>⟳</span>}
      {children}
    </StyledButton>
  );
};
