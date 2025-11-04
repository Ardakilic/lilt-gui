import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SelectFile,
  SelectDirectory,
  FindInPath,
  StartTranscoding,
  IsTranscoding,
} from '../../wailsjs/go/main/App';
import type { main } from '../../wailsjs/go/models';

interface ConfigFormProps {
  savedConfig: main.ConfigData | null;
  onSaveConfig: (config: main.ConfigData) => void;
}

function ConfigForm({ savedConfig, onSaveConfig }: ConfigFormProps) {
  const { t } = useTranslation();
  const [config, setConfig] = useState<main.TranscodeConfig>({
    liltBinary: '',
    soxBinary: '',
    soxNgBinary: '',
    ffmpegBinary: '',
    ffprobeBinary: '',
    useDocker: true,
    outputFormat: 'flac',
    noPreserveMetadata: false,
    copyImages: true,
    sourceDir: '',
    targetDir: '',
  });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (savedConfig?.lastConfig) {
      setConfig(savedConfig.lastConfig);
    }
  }, [savedConfig]);

  useEffect(() => {
    const interval = setInterval(() => {
      IsTranscoding()
        .then(setIsRunning)
        .catch(() => setIsRunning(false));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleBrowseLilt = async () => {
    const file = await SelectFile(t('config.selectLiltBinary'));
    if (file) {
      setConfig({ ...config, liltBinary: file });
    }
  };

  const handleIdentifyLilt = async () => {
    try {
      const path = await FindInPath('lilt');
      setConfig({ ...config, liltBinary: path });
    } catch (err) {
      alert(t('config.notFoundInPath', { binary: 'lilt' }));
    }
  };

  const handleBrowseSox = async () => {
    const file = await SelectFile(t('config.selectSoxBinary'));
    if (file) {
      setConfig({ ...config, soxBinary: file });
    }
  };

  const handleIdentifySox = async () => {
    try {
      const path = await FindInPath('sox');
      setConfig({ ...config, soxBinary: path });
    } catch (err) {
      alert(t('config.notFoundInPath', { binary: 'sox' }));
    }
  };

  const handleBrowseSoxNg = async () => {
    const file = await SelectFile(t('config.selectSoxNgBinary'));
    if (file) {
      setConfig({ ...config, soxNgBinary: file });
    }
  };

  const handleIdentifySoxNg = async () => {
    try {
      const path = await FindInPath('sox_ng');
      setConfig({ ...config, soxNgBinary: path });
    } catch (err) {
      alert(t('config.notFoundInPath', { binary: 'sox_ng' }));
    }
  };

  const handleBrowseFfmpeg = async () => {
    const file = await SelectFile(t('config.selectFfmpegBinary'));
    if (file) {
      setConfig({ ...config, ffmpegBinary: file });
    }
  };

  const handleIdentifyFfmpeg = async () => {
    try {
      const path = await FindInPath('ffmpeg');
      setConfig({ ...config, ffmpegBinary: path });
    } catch (err) {
      alert(t('config.notFoundInPath', { binary: 'ffmpeg' }));
    }
  };

  const handleBrowseFfprobe = async () => {
    const file = await SelectFile(t('config.selectFfprobeBinary'));
    if (file) {
      setConfig({ ...config, ffprobeBinary: file });
    }
  };

  const handleIdentifyFfprobe = async () => {
    try {
      const path = await FindInPath('ffprobe');
      setConfig({ ...config, ffprobeBinary: path });
    } catch (err) {
      alert(t('config.notFoundInPath', { binary: 'ffprobe' }));
    }
  };

  const handleBrowseSource = async () => {
    const dir = await SelectDirectory(t('config.selectSourceDirectory'));
    if (dir) {
      setConfig({ ...config, sourceDir: dir });
    }
  };

  const handleBrowseTarget = async () => {
    const dir = await SelectDirectory(t('config.selectTargetDirectory'));
    if (dir) {
      setConfig({ ...config, targetDir: dir });
    }
  };

  const handleStartTranscoding = async () => {
    if (!config.liltBinary) {
      alert(t('config.validation.liltRequired'));
      return;
    }
    if (!config.sourceDir) {
      alert(t('config.validation.sourceRequired'));
      return;
    }
    if (!config.targetDir) {
      alert(t('config.validation.targetRequired'));
      return;
    }

    try {
      await StartTranscoding(config);
      onSaveConfig({
        lastConfig: config,
        language: savedConfig?.language || 'en',
      });
    } catch (err) {
      alert(`${t('config.error.startFailed')}: ${err}`);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl flex-shrink-0">
      <div className="card-body">
        <h2 className="card-title">{t('config.title')}</h2>

        {/* Lilt Binary */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t('config.liltBinary')}</span>
            <span className="label-text-alt text-error">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('config.liltBinaryPlaceholder')}
              className="input input-bordered flex-1"
              value={config.liltBinary}
              onChange={(e) => setConfig({ ...config, liltBinary: e.target.value })}
              data-tooltip={t('config.tooltip.liltBinary')}
              title={t('config.tooltip.liltBinary')}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleBrowseLilt}
              disabled={isRunning}
            >
              {t('config.browse')}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleIdentifyLilt}
              disabled={isRunning}
            >
              {t('config.identify')}
            </button>
          </div>
        </div>

        {/* Use Docker */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={config.useDocker}
              onChange={(e) => setConfig({ ...config, useDocker: e.target.checked })}
              disabled={isRunning}
            />
            <span className="label-text">{t('config.useDocker')}</span>
            <div
              className="tooltip tooltip-right"
              data-tip={t('config.tooltip.useDocker')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 stroke-info-content"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </label>
        </div>

        {/* External binaries (only when not using Docker) */}
        {!config.useDocker && (
          <div className="space-y-4 p-4 bg-base-200 rounded-lg">
            <h3 className="font-semibold">{t('config.externalTools')}</h3>

            {/* SoX Binary */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t('config.soxBinary')}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('config.soxBinaryPlaceholder')}
                  className="input input-bordered input-sm flex-1"
                  value={config.soxBinary}
                  onChange={(e) => setConfig({ ...config, soxBinary: e.target.value })}
                  title={t('config.tooltip.soxBinary')}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleBrowseSox}
                  disabled={isRunning}
                >
                  {t('config.browse')}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleIdentifySox}
                  disabled={isRunning}
                >
                  {t('config.identify')}
                </button>
              </div>
            </div>

            {/* SoX-NG Binary */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t('config.soxNgBinary')}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('config.soxNgBinaryPlaceholder')}
                  className="input input-bordered input-sm flex-1"
                  value={config.soxNgBinary}
                  onChange={(e) => setConfig({ ...config, soxNgBinary: e.target.value })}
                  title={t('config.tooltip.soxNgBinary')}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleBrowseSoxNg}
                  disabled={isRunning}
                >
                  {t('config.browse')}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleIdentifySoxNg}
                  disabled={isRunning}
                >
                  {t('config.identify')}
                </button>
              </div>
            </div>

            {/* FFmpeg Binary */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t('config.ffmpegBinary')}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('config.ffmpegBinaryPlaceholder')}
                  className="input input-bordered input-sm flex-1"
                  value={config.ffmpegBinary}
                  onChange={(e) => setConfig({ ...config, ffmpegBinary: e.target.value })}
                  title={t('config.tooltip.ffmpegBinary')}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleBrowseFfmpeg}
                  disabled={isRunning}
                >
                  {t('config.browse')}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleIdentifyFfmpeg}
                  disabled={isRunning}
                >
                  {t('config.identify')}
                </button>
              </div>
            </div>

            {/* FFprobe Binary */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t('config.ffprobeBinary')}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('config.ffprobeBinaryPlaceholder')}
                  className="input input-bordered input-sm flex-1"
                  value={config.ffprobeBinary}
                  onChange={(e) => setConfig({ ...config, ffprobeBinary: e.target.value })}
                  title={t('config.tooltip.ffprobeBinary')}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleBrowseFfprobe}
                  disabled={isRunning}
                >
                  {t('config.browse')}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleIdentifyFfprobe}
                  disabled={isRunning}
                >
                  {t('config.identify')}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Output Format */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">{t('config.outputFormat')}</span>
            </label>
            <select
              className="select select-bordered"
              value={config.outputFormat}
              onChange={(e) => setConfig({ ...config, outputFormat: e.target.value })}
              title={t('config.tooltip.outputFormat')}
              disabled={isRunning}
            >
              <option value="default">{t('config.format.default')}</option>
              <option value="flac">{t('config.format.flac')}</option>
              <option value="mp3">{t('config.format.mp3')}</option>
              <option value="alac">{t('config.format.alac')}</option>
            </select>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={config.noPreserveMetadata}
                  onChange={(e) =>
                    setConfig({ ...config, noPreserveMetadata: e.target.checked })
                  }
                  disabled={isRunning}
                />
                <span className="label-text">{t('config.noPreserveMetadata')}</span>
                <div
                  className="tooltip tooltip-right"
                  data-tip={t('config.tooltip.noPreserveMetadata')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 stroke-info-content"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={config.copyImages}
                  onChange={(e) => setConfig({ ...config, copyImages: e.target.checked })}
                  disabled={isRunning}
                />
                <span className="label-text">{t('config.copyImages')}</span>
                <div
                  className="tooltip tooltip-right"
                  data-tip={t('config.tooltip.copyImages')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 stroke-info-content"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Source Directory */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t('config.sourceDirectory')}</span>
            <span className="label-text-alt text-error">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('config.sourceDirectoryPlaceholder')}
              className="input input-bordered flex-1"
              value={config.sourceDir}
              onChange={(e) => setConfig({ ...config, sourceDir: e.target.value })}
              title={t('config.tooltip.sourceDirectory')}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleBrowseSource}
              disabled={isRunning}
            >
              {t('config.browse')}
            </button>
          </div>
        </div>

        {/* Target Directory */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t('config.targetDirectory')}</span>
            <span className="label-text-alt text-error">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('config.targetDirectoryPlaceholder')}
              className="input input-bordered flex-1"
              value={config.targetDir}
              onChange={(e) => setConfig({ ...config, targetDir: e.target.value })}
              title={t('config.tooltip.targetDirectory')}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleBrowseTarget}
              disabled={isRunning}
            >
              {t('config.browse')}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleStartTranscoding}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <span className="loading loading-spinner"></span>
                {t('config.transcoding')}
              </>
            ) : (
              t('config.startTranscoding')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigForm;
