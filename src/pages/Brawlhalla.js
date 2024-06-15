import React from "react";
import { useTranslation } from "react-i18next";
import { Tabs, Tab } from "@nextui-org/react";
import GloryByID from "../components/Brawlhalla/GloryByID";
import GloryBySteamID from "../components/Brawlhalla/GloryBySteamID";
import RankedByID from "../components/Brawlhalla/RankedByID";
import RankBySteamID from "../components/Brawlhalla/RankBySteamID";
import GetStatsByID from "../components/Brawlhalla/GetStatsByID";
import GetStatsBySteamID from "../components/Brawlhalla/GetStatsBySteamID";
import GetRanked1v1Data from "../components/Brawlhalla/GetRanked1v1Data";
import GetRanked2v2Data from "../components/Brawlhalla/GetRanked2v2Data";
import GetRankedSeasonalData from "../components/Brawlhalla/GetRankedSeasonalData";
import GetClanData from "../components/Brawlhalla/GetClanData";
import GetAllLegends from "../components/Brawlhalla/GetAllLegends";
import BHRandomCharacter from "../components/Brawlhalla/BHRandomCharacter";

const Brawlhalla = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('brawlhalla')}</h1>
      <Tabs placement="start">
        <Tab title={t('gloryByID')}>
          <GloryByID />
        </Tab>
        <Tab title={t('gloryBySteamID')}>
          <GloryBySteamID />
        </Tab>
        <Tab title={t('rankedByID')}>
          <RankedByID />
        </Tab>
        <Tab title={t('rankedBySteamID')}>
          <RankBySteamID />
        </Tab>
        <Tab title={t('getStatsByID')}>
          <GetStatsByID />
        </Tab>
        <Tab title={t('getStatsBySteamID')}>
          <GetStatsBySteamID />
        </Tab>
        <Tab title={t('getAllLegends')}>
          <GetAllLegends />
        </Tab>
        <Tab title={t('randomCharacter')}>
          <BHRandomCharacter />
        </Tab>
        <Tab title={t('getRanked1v1Data')}>
          <GetRanked1v1Data />
        </Tab>
        <Tab title={t('getRanked2v2Data')}>
          <GetRanked2v2Data />
        </Tab>
        <Tab title={t('getRankedSeasonalData')}>
          <GetRankedSeasonalData />
        </Tab>
        <Tab title={t('getClanData')}>
          <GetClanData />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Brawlhalla;
