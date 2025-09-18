import { useTranslation } from 'react-i18next';
import { LiltConfig, OutputFormat } from '../types';
import TooltipWrapper from './TooltipWrapper';

interface ConversionSettingsProps {
  config: LiltConfig;
  onConfigChange: (updates: Partial<LiltConfig>) => void;
}

function ConversionSettings({
  config,
  onConfigChange,
}: ConversionSettingsProps) {
  const { t } = useTranslation();

  return (
    <div className='settings-card'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        {t('settings.conversion')}
      </h3>

      <div className='space-y-4'>
        {/* Docker Setting */}
        <div>
          <TooltipWrapper content={t('tooltips.use_docker')}>
            <label className='flex items-center space-x-3'>
              <input
                type='checkbox'
                checked={config.useDocker}
                onChange={e => onConfigChange({ useDocker: e.target.checked })}
                className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
              />
              <span className='text-sm font-medium text-gray-700'>
                {t('settings.use_docker')}
              </span>
            </label>
          </TooltipWrapper>
        </div>

        {/* Output Format */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('settings.enforce_output_format')}
          </label>
          <TooltipWrapper content={t('tooltips.enforce_output_format')}>
            <select
              value={config.enforceOutputFormat}
              onChange={e =>
                onConfigChange({
                  enforceOutputFormat: e.target.value as OutputFormat,
                })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              <option value=''>{t('settings.output_format.default')}</option>
              <option value='flac'>{t('settings.output_format.flac')}</option>
              <option value='mp3'>{t('settings.output_format.mp3')}</option>
              <option value='alac'>{t('settings.output_format.alac')}</option>
            </select>
          </TooltipWrapper>
        </div>

        {/* Copy Images */}
        <div>
          <TooltipWrapper content={t('tooltips.copy_images')}>
            <label className='flex items-center space-x-3'>
              <input
                type='checkbox'
                checked={config.copyImages}
                onChange={e => onConfigChange({ copyImages: e.target.checked })}
                className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
              />
              <span className='text-sm font-medium text-gray-700'>
                {t('settings.copy_images')}
              </span>
            </label>
          </TooltipWrapper>
        </div>

        {/* No Preserve Metadata */}
        <div>
          <TooltipWrapper content={t('tooltips.no_preserve_metadata')}>
            <label className='flex items-center space-x-3'>
              <input
                type='checkbox'
                checked={config.noPreserveMetadata}
                onChange={e =>
                  onConfigChange({ noPreserveMetadata: e.target.checked })
                }
                className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
              />
              <span className='text-sm font-medium text-gray-700'>
                {t('settings.no_preserve_metadata')}
              </span>
            </label>
          </TooltipWrapper>
        </div>
      </div>
    </div>
  );
}

export default ConversionSettings;
