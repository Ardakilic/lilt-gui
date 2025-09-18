import { useTranslation } from 'react-i18next';
import { invoke } from '@tauri-apps/api/tauri';
import { File, Search } from 'lucide-react';
import { LiltConfig } from '../types/index';
import TooltipWrapper from './TooltipWrapper';

interface BinarySettingsProps {
  config: LiltConfig;
  onConfigChange: (updates: Partial<LiltConfig>) => void;
}

function BinarySettings({ config, onConfigChange }: BinarySettingsProps) {
  const { t } = useTranslation();

  const handleIdentifyBinary = async (
    binaryName: string,
    configKey: keyof LiltConfig,
  ) => {
    try {
      const path = await invoke<string>('find_binary_in_path', { binaryName });
      onConfigChange({ [configKey]: path });
    } catch (error) {
      console.error(`Failed to find ${binaryName}:`, error);
    }
  };

  return (
    <div className='settings-card'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        {t('settings.binaries')}
      </h3>

      <div className='space-y-4'>
        {/* Lilt Binary */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('settings.lilt_path')} *
          </label>
          <div className='flex items-center space-x-2'>
            <div className='flex-1 relative'>
              <input
                type='text'
                value={config.liltPath}
                onChange={e => onConfigChange({ liltPath: e.target.value })}
                placeholder={t('settings.lilt_path')}
                className='w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
              <File className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
            </div>
            <TooltipWrapper content={t('tooltips.identify')}>
              <button
                onClick={() => handleIdentifyBinary('lilt', 'liltPath')}
                className='identify-button flex items-center space-x-2'
              >
                <Search className='w-4 h-4' />
                <span>{t('settings.identify')}</span>
              </button>
            </TooltipWrapper>
          </div>
        </div>

        {/* Show additional binaries only when Docker is disabled */}
        {!config.useDocker && (
          <>
            {/* SoX Binary */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('settings.sox_path')}
              </label>
              <div className='flex items-center space-x-2'>
                <div className='flex-1 relative'>
                  <input
                    type='text'
                    value={config.soxPath}
                    onChange={e => onConfigChange({ soxPath: e.target.value })}
                    placeholder={t('settings.sox_path')}
                    className='w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                  <File className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
                </div>
                <TooltipWrapper content={t('tooltips.identify')}>
                  <button
                    onClick={() => handleIdentifyBinary('sox', 'soxPath')}
                    className='identify-button flex items-center space-x-2'
                  >
                    <Search className='w-4 h-4' />
                    <span>{t('settings.identify')}</span>
                  </button>
                </TooltipWrapper>
              </div>
            </div>

            {/* FFmpeg Binary */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('settings.ffmpeg_path')}
              </label>
              <div className='flex items-center space-x-2'>
                <div className='flex-1 relative'>
                  <input
                    type='text'
                    value={config.ffmpegPath}
                    onChange={e =>
                      onConfigChange({ ffmpegPath: e.target.value })
                    }
                    placeholder={t('settings.ffmpeg_path')}
                    className='w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                  <File className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
                </div>
                <TooltipWrapper content={t('tooltips.identify')}>
                  <button
                    onClick={() => handleIdentifyBinary('ffmpeg', 'ffmpegPath')}
                    className='identify-button flex items-center space-x-2'
                  >
                    <Search className='w-4 h-4' />
                    <span>{t('settings.identify')}</span>
                  </button>
                </TooltipWrapper>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BinarySettings;
