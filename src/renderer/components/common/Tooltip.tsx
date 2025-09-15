import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipContentProps {
  position: TooltipPosition;
  visible: boolean;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<TooltipContentProps>`
  position: absolute;
  background: ${props => props.theme.colors.gray800};
  color: white;
  padding: 8px 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  white-space: nowrap;
  z-index: ${props => props.theme.zIndex.tooltip};
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  box-shadow: ${props => props.theme.shadows.lg};
  
  ${props => props.position === 'top' && css`
    bottom: calc(100% + 5px);
    left: 50%;
    transform: translateX(-50%);
    
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: ${props.theme.colors.gray800};
    }
  `}
  
  ${props => props.position === 'bottom' && css`
    top: calc(100% + 5px);
    left: 50%;
    transform: translateX(-50%);
    
    &::after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-bottom-color: ${props.theme.colors.gray800};
    }
  `}
  
  ${props => props.position === 'left' && css`
    right: calc(100% + 5px);
    top: 50%;
    transform: translateY(-50%);
    
    &::after {
      content: '';
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-left-color: ${props.theme.colors.gray800};
    }
  `}
  
  ${props => props.position === 'right' && css`
    left: calc(100% + 5px);
    top: 50%;
    transform: translateY(-50%);
    
    &::after {
      content: '';
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-right-color: ${props.theme.colors.gray800};
    }
  `}
`;

interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState<TooltipPosition>(position);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const tooltipContent = contentRef.current;
    const containerRect = container.getBoundingClientRect();
    const tooltipRect = tooltipContent.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newPosition = position;

    // Check if tooltip goes outside viewport and adjust position
    if (position === 'top' && containerRect.top - tooltipRect.height < 0) {
      newPosition = 'bottom';
    } else if (position === 'bottom' && containerRect.bottom + tooltipRect.height > viewportHeight) {
      newPosition = 'top';
    } else if (position === 'left' && containerRect.left - tooltipRect.width < 0) {
      newPosition = 'right';
    } else if (position === 'right' && containerRect.right + tooltipRect.width > viewportWidth) {
      newPosition = 'left';
    }

    setActualPosition(newPosition);
  }, [visible, position]);

  return (
    <TooltipContainer
      ref={containerRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <TooltipContent
        ref={contentRef}
        position={actualPosition}
        visible={visible}
      >
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};
