import { useTranslation } from 'react-i18next';
import { Folder, HardDrive } from 'lucide-react';
import { LiltConfig } from '../types';
import TooltipWrapper from './TooltipWrapper';

interface DirectorySettingsProps {
  config: LiltConfig;
  onDirectorySelect: (type: 'source' | 'target') => void;
}

function DirectorySettings({
  config,
  onDirectorySelect,
}: DirectorySettingsProps) {
  const { t } = useTranslation();

  return (
    <div className='settings-card'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        {t('settings.source_dir')} & {t('settings.target_dir')}
      </h3>

      <div className='space-y-4'>
        {/* Source Directory */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('settings.source_dir')} *
          </label>
          <div className='flex items-center space-x-2'>
            <div className='flex-1 relative'>
              <input
                type='text'
                value={config.sourceDir}
                readOnly
                placeholder={t('settings.source_dir')}
                className='w-full px-3 py-2 pl-10 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
              <HardDrive className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
            </div>
            <TooltipWrapper content={t('tooltips.source_dir')}>
              <button
                onClick={() => onDirectorySelect('source')}
                className='file-browser-button flex items-center space-x-2'
              >
                <Folder className='w-4 h-4' />
                <span>{t('settings.browse')}</span>
              </button>
            </TooltipWrapper>
          </div>
        </div>

        {/* Target Directory */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('settings.target_dir')} *
          </label>
          <div className='flex items-center space-x-2'>
            <div className='flex-1 relative'>
              <input
                type='text'
                value={config.targetDir}
                readOnly
                placeholder={t('settings.target_dir')}
                className='w-full px-3 py-2 pl-10 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
              <HardDrive className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
            </div>
            <TooltipWrapper content={t('tooltips.target_dir')}>
              <button
                onClick={() => onDirectorySelect('target')}
                className='file-browser-button flex items-center space-x-2'
              >
                <Folder className='w-4 h-4' />
                <span>{t('settings.browse')}</span>
              </button>
            </TooltipWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirectorySettings;
