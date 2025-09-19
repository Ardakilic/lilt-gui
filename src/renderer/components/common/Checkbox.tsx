import type { InputHTMLAttributes } from 'react';
import React from 'react';
import styled from 'styled-components';

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  
  &:hover input:not(:disabled) + span {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.span<{ checked: boolean; disabled?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid ${(props) => (props.checked ? props.theme.colors.primary : props.theme.colors.border)};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background: ${(props) => (props.checked ? props.theme.colors.primary : props.theme.colors.background)};
  transition: ${(props) => props.theme.transitions.default};
  
  ${(props) =>
    props.disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
  `}
  
  &::after {
    content: '';
    position: absolute;
    display: ${(props) => (props.checked ? 'block' : 'none')};
    left: 6px;
    top: 2px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const Label = styled.span<{ disabled?: boolean }>`
  font-size: ${(props) => props.theme.fontSize.md};
  color: ${(props) => (props.disabled ? props.theme.colors.textLight : props.theme.colors.text)};
`;

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  disabled = false,
  onChange,
  ...props
}) => {
  return (
    <CheckboxContainer>
      <HiddenCheckbox checked={checked} disabled={disabled} onChange={onChange} {...props} />
      <StyledCheckbox checked={checked} disabled={disabled} />
      {label && <Label disabled={disabled}>{label}</Label>}
    </CheckboxContainer>
  );
};
