import { useTranslation } from 'react-i18next';
import { GetVersion, OpenURL } from '../../wailsjs/go/main/App';
import type { main } from '../../wailsjs/go/models';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onSaveConfig: (config: main.ConfigData) => void;
  currentLanguage: string;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

function Header({ onSaveConfig, currentLanguage }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [version, setVersion] = useState('');

  useEffect(() => {
    GetVersion().then(setVersion).catch(console.error);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    onSaveConfig({
      language: langCode,
      lastConfig: {
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
      },
    });
  };

  const handleDownloadLilt = () => {
    OpenURL('https://github.com/Ardakilic/lilt/releases/latest').catch(console.error);
  };

  const handleHelp = () => {
    const modal = document.getElementById('help_modal') as HTMLDialogElement;
    modal?.showModal();
  };

  return (
    <>
      <div className="navbar bg-base-200 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">
            🎵 {t('app.title')} <span className="text-sm opacity-70">v{version}</span>
          </a>
        </div>
        <div className="flex-none gap-2">
          <button type="button" className="btn btn-outline btn-sm" onClick={handleHelp}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {t('header.help')}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleDownloadLilt}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {t('header.downloadLilt')}
          </button>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              {LANGUAGES.find((l) => l.code === currentLanguage)?.flag}
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {LANGUAGES.map((lang) => (
                <li key={lang.code}>
                  <a
                    onClick={() => handleLanguageChange(lang.code)}
                    className={currentLanguage === lang.code ? 'active' : ''}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <dialog id="help_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">{t('help.title')}</h3>
          <div className="prose">
            <p>{t('help.description')}</p>
            <h4>{t('help.whatIsLilt')}</h4>
            <p>{t('help.liltDescription')}</p>
            <h4>{t('help.features')}</h4>
            <ul>
              <li>{t('help.feature1')}</li>
              <li>{t('help.feature2')}</li>
              <li>{t('help.feature3')}</li>
              <li>{t('help.feature4')}</li>
            </ul>
            <h4>{t('help.author')}</h4>
            <p>
              {t('help.authorInfo')}{' '}
              <a
                href="https://github.com/Ardakilic"
                className="link link-primary"
                onClick={(e) => {
                  e.preventDefault();
                  OpenURL('https://github.com/Ardakilic');
                }}
              >
                github.com/Ardakilic
              </a>
            </p>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button type="button" className="btn">
                {t('help.close')}
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button">close</button>
        </form>
      </dialog>
    </>
  );
}

export default Header;
