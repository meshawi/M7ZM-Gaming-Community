// src/pages/SaudiDeal.js
import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import SuadiDealAllCard from "../components/SaudiDeal/SuadiDealAllCard";
import SaudiDealInstructions from "../components/SaudiDeal/SaudiDealInstructions";
import { useTranslation } from 'react-i18next';

const SaudiDeal = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('saudiDeal')}</h1>
      <Tabs placement="start">
        <Tab title={t('saudiDealAllCard')}>
          <SuadiDealAllCard />
        </Tab>
        <Tab title={t('saudiDealInstructions')}>
          <SaudiDealInstructions />
        </Tab>
      </Tabs>
    </div>
  );
};

export default SaudiDeal;
