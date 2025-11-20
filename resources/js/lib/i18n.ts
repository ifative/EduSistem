import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enCommon from '@/locales/en/common.json';
import enAdmin from '@/locales/en/admin.json';
import enPpdb from '@/locales/en/ppdb.json';
import idCommon from '@/locales/id/common.json';
import idAdmin from '@/locales/id/admin.json';
import idPpdb from '@/locales/id/ppdb.json';

const resources = {
    en: {
        common: enCommon,
        admin: enAdmin,
        ppdb: enPpdb,
    },
    id: {
        common: idCommon,
        admin: idAdmin,
        ppdb: idPpdb,
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'id',
        fallbackLng: 'id',
        defaultNS: 'common',
        ns: ['common', 'admin', 'ppdb'],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
