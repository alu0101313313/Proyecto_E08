'use client';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { FlagEN, FlagES } from './Flags';
export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('es')}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          locale === 'es'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        ES
      </button>
    </div>
  );
}
