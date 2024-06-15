// src/components/LanguageSwitcher.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@nextui-org/react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-4 mt-4 justify-center">
      <Button color='danger' variant="light" auto light onClick={() => changeLanguage('en')}>English</Button>
      <Button color='danger' variant="light" auto light onClick={() => changeLanguage('ar')}>العربية</Button>
      <Button color='danger' variant="light" auto light onClick={() => changeLanguage('es')}>Español</Button>
      <Button color='danger' variant="light" auto light onClick={() => changeLanguage('fr')}>Français</Button>
      <Button color='danger' variant="light" auto light onClick={() => changeLanguage('ru')}>Русский</Button>
    </div>
  );
};

export default LanguageSwitcher;
