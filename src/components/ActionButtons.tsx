import { useTranslation } from 'react-i18next';
import { Play, Square, Download, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onDownload: () => void;
  onClearOutput: () => void;
}

function ActionButtons({
  isRunning,
  onStart,
  onStop,
  onDownload,
  onClearOutput,
}: ActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className='settings-card'>
      <div className='grid grid-cols-2 gap-4'>
        {/* Start/Stop Transcoding */}
        <div className='col-span-2 space-y-2'>
          {!isRunning ? (
            <button
              onClick={onStart}
              className='w-full bg-green-600 text-white font-medium py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2'
            >
              <Play className='w-5 h-5' />
              <span>{t('actions.start_transcoding')}</span>
            </button>
          ) : (
            <button
              onClick={onStop}
              className='w-full bg-red-600 text-white font-medium py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2'
            >
              <Square className='w-5 h-5' />
              <span>{t('actions.stop_transcoding')}</span>
            </button>
          )}
        </div>

        {/* Download Lilt */}
        <button
          onClick={onDownload}
          className='bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2'
        >
          <Download className='w-4 h-4' />
          <span>{t('actions.download_lilt')}</span>
        </button>

        {/* Clear Output */}
        <button
          onClick={onClearOutput}
          className='bg-gray-600 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2'
        >
          <Trash2 className='w-4 h-4' />
          <span>{t('actions.clear_output')}</span>
        </button>
      </div>
    </div>
  );
}

export default ActionButtons;
