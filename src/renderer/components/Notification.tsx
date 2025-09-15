import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div<{ type: NotificationType; isClosing?: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  z-index: ${props => props.theme.zIndex.notification};
  max-width: 400px;
  min-width: 300px;
  animation: ${props => props.isClosing ? slideOut : slideIn} 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  
  ${props => props.type === 'success' && css`
    background: ${props.theme.colors.success};
    color: white;
  `}
  
  ${props => props.type === 'error' && css`
    background: ${props.theme.colors.error};
    color: white;
  `}
  
  ${props => props.type === 'info' && css`
    background: ${props.theme.colors.info};
    color: white;
  `}
  
  ${props => props.type === 'warning' && css`
    background: ${props.theme.colors.warning};
    color: white;
  `}
`;

const Message = styled.span`
  flex: 1;
  font-size: ${props => props.theme.fontSize.md};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
  
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span<{ type: NotificationType }>`
  font-size: 18px;
  
  ${props => props.type === 'success' && css`
    content: '✓';
  `}
  
  ${props => props.type === 'error' && css`
    content: '✕';
  `}
  
  ${props => props.type === 'info' && css`
    content: 'ℹ';
  `}
  
  ${props => props.type === 'warning' && css`
    content: '⚠';
  `}
  
  &::before {
    content: ${props => {
      switch (props.type) {
        case 'success': return '"✓"';
        case 'error': return '"✕"';
        case 'info': return '"ℹ"';
        case 'warning': return '"⚠"';
        default: return '""';
      }
    }};
  }
`;

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const [isClosing, setIsClosing] = React.useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  return (
    <NotificationContainer type={type} isClosing={isClosing}>
      <Icon type={type} />
      <Message>{message}</Message>
      <CloseButton onClick={handleClose}>
        ✕
      </CloseButton>
    </NotificationContainer>
  );
};
