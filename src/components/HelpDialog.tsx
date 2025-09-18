import { useTranslation } from 'react-i18next';
import { X, Github, ExternalLink } from 'lucide-react';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-xl font-semibold text-gray-900'>
            {t('help.title')}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className='p-2 hover:bg-gray-100 rounded-md'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-6 space-y-6'>
          {/* About Lilt GUI */}
          <section>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {t('help.about.title')}
            </h3>
            <p className='text-gray-600 mb-3'>{t('help.about.description')}</p>
          </section>

          {/* About Lilt */}
          <section>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {t('help.lilt.title')}
            </h3>
            <p className='text-gray-600 mb-3'>{t('help.lilt.description')}</p>
          </section>

          {/* How to Use */}
          <section>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {t('help.usage.title')}
            </h3>
            <ul className='list-decimal list-inside space-y-1 text-gray-600'>
              {(t('help.usage.steps', { returnObjects: true }) as string[]).map(
                (step: string, index: number) => (
                  <li key={index}>{step}</li>
                ),
              )}
            </ul>
          </section>

          {/* Author */}
          <section>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {t('help.author.title')}
            </h3>
            <p className='text-gray-600 mb-3'>{t('help.author.description')}</p>
            <div className='flex space-x-4'>
              <a
                href='https://github.com/Ardakilic/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2 text-blue-600 hover:text-blue-800'
              >
                <Github className='w-4 h-4' />
                <span>{t('help.author.github')}</span>
                <ExternalLink className='w-3 h-3' />
              </a>
            </div>
          </section>
        </div>

        <div className='border-t p-6'>
          <button
            onClick={() => onOpenChange(false)}
            className='w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpDialog;
