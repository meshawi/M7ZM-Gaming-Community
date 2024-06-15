// src/pages/Settings.js
import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../LanguageSwitcher";

const SettingsPage = () => {
  const { t } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const themeButtons = [
    { name: t("lightMode"), theme: "light" },
    { name: t("darkMode"), theme: "dark" },
    { name: t("purpleMode"), theme: "purple-dark" },
    { name: t("blackOrangeMode"), theme: "black-orange" },
    { name: t("bluePinkMode"), theme: "blue-pink" },
    { name: t("greenYellowMode"), theme: "green-yellow" },
    { name: t("sunsetGlowMode"), theme: "sunset-glow" },
    { name: t("midnightBlueMode"), theme: "midnight-blue" },
    { name: t("forestGreenMode"), theme: "forest-green" },
    { name: t("oceanBreezeMode"), theme: "ocean-breeze" },
    { name: t("sunnyDayMode"), theme: "sunny-day" },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center">
          <h2 className="text-2xl font-bold">{t('settings')}</h2>
          <p className="text-xl font-semibold mt-2">{t('themeSettings')}</p>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {themeButtons.map(({ name, theme }) => (
              <Tooltip key={theme} content={name} placement="top">
                <Button
                  auto
                  color="primary"
                  variant="bordered"
                  onClick={() => setTheme(theme)}
                >
                  {name}
                </Button>
              </Tooltip>
            ))}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="flex flex-col items-center">
          <p className="text-xl font-semibold">{t('languageSettings')}</p>
        </CardHeader>
        <Divider />
        <CardBody>
          <LanguageSwitcher />
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsPage;
