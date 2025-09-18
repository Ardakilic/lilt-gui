import { ReactNode } from 'react';

interface TooltipWrapperProps {
  content: string;
  children: ReactNode;
}

function TooltipWrapper({ content, children }: TooltipWrapperProps) {
  return (
    <div className='relative group'>
      {children}
      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50'>
        <div className='bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap'>
          {content}
          <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'></div>
        </div>
      </div>
    </div>
  );
}

export default TooltipWrapper;
