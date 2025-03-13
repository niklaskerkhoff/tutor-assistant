import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

/**
 * Applies internationalization
 *
 * @param texts to be translated, requires the format:
 *  {
 *      textKey1: {
 *          "en": "value",
 *          "de": "value",
 *          ...
 *      },
 *      ...
 *  }
 */
export function configureI18n(texts: any) {

    function restructureTranslations(texts: any) {
        const result = {} as any

        Object.keys(texts).forEach(key => {
            Object.keys(texts[key]).forEach(lang => {
                if (!result[lang]) {
                    result[lang] = { translation: {} }
                }
                result[lang].translation[key] = texts[key][lang]
            })
        })

        return result
    }

    i18n
        .use(initReactI18next)
        .use(LanguageDetector)
        .init({
            resources: restructureTranslations(texts),
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
            },
        })
}
