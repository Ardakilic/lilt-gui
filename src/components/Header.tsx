import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Languages, Github } from 'lucide-react';

interface HeaderProps {
  onHelpClick: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

function Header({ onHelpClick }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setLanguageMenuOpen(false);
  };

  const currentLanguage =
    LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  return (
    <header
      className='bg-white shadow-sm border-b border-gray-200'
      data-testid='app-header'
    >
      <div className='container mx-auto px-4 py-4 max-w-6xl'>
        <div className='flex items-center justify-between'>
          {/* Logo and Title */}
          <div className='flex items-center space-x-3'>
            <img
              src='/lilt-assets/logo-circle.png'
              alt='Lilt Logo'
              className='w-10 h-10'
            />
            <div>
              <h1 className='text-xl font-bold text-gray-900'>
                {t('app.title')}
              </h1>
              <p className='text-sm text-gray-600'>{t('app.description')}</p>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center space-x-2'>
            {/* Language Selector */}
            <div className='relative'>
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className='flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                aria-label={t('navigation.language')}
              >
                <Languages className='w-4 h-4' />
                <span>{currentLanguage.nativeName}</span>
              </button>

              {languageMenuOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50'>
                  <div className='py-1'>
                    {LANGUAGES.map(language => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                          i18n.language === language.code
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        <div>
                          <div className='font-medium'>
                            {language.nativeName}
                          </div>
                          <div className='text-xs text-gray-500'>
                            {language.name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* GitHub Link */}
            <a
              href='https://github.com/Ardakilic/'
              target='_blank'
              rel='noopener noreferrer'
              className='p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              aria-label='GitHub Profile'
            >
              <Github className='w-4 h-4' />
            </a>

            {/* Help Button */}
            <button
              onClick={onHelpClick}
              className='flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              aria-label={t('navigation.help')}
            >
              <HelpCircle className='w-4 h-4' />
              <span>{t('navigation.help')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Close language menu when clicking outside */}
      {languageMenuOpen && (
        <div
          className='fixed inset-0 z-40'
          onClick={() => setLanguageMenuOpen(false)}
        />
      )}
    </header>
  );
}

export default Header;
