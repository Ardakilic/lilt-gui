import { useTranslation } from 'react-i18next';
import { Terminal } from 'lucide-react';
import { ProcessOutput } from '../types';

interface OutputTerminalProps {
  output: ProcessOutput[];
  isRunning: boolean;
}

function OutputTerminal({ output, isRunning }: OutputTerminalProps) {
  const { t } = useTranslation();

  return (
    <div className='settings-card h-full'>
      <div className='flex items-center space-x-2 mb-4'>
        <Terminal className='w-5 h-5 text-gray-600' />
        <h3 className='text-lg font-semibold text-gray-900'>
          {t('output.title')}
        </h3>
        {isRunning && (
          <div className='flex items-center space-x-2'>
            <div className='loading-spinner'></div>
            <span className='text-sm text-green-600 font-medium'>
              {t('status.running')}
            </span>
          </div>
        )}
      </div>

      <div className='terminal-output'>
        {output.length === 0 ? (
          <div className='text-gray-500 italic'>{t('output.empty')}</div>
        ) : (
          output.map((line, index) => (
            <div
              key={index}
              className={`font-mono text-sm mb-1 ${
                line.isError ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {line.line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OutputTerminal;
