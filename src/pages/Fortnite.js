// src/pages/Fortnite.js
import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import GetAllBanners from "../components/Fortnite/GetAllBanners";
import BattleRoyalMap from "../components/Fortnite/BattleRoyalMap";
import STWNews from "../components/Fortnite/STWNews";
import BRNews from "../components/Fortnite/BRNews";
import News from "../components/Fortnite/News";
import Cosmetics from "../components/Fortnite/Cosmetics";
import NewCosmetics from "../components/Fortnite/NewCosmetics";
import CosmeticsByID from "../components/Fortnite/CosmeticsByID";
import CreatorCode from "../components/Fortnite/CreatorCode";
import TwitchDrops from "../components/Fortnite/TwitchDrops";
import Shop from "../components/Fortnite/Shop";
import ActiveEvents from "../components/Fortnite/ActiveEvents";
import Challenges from "../components/Fortnite/Challenges";
import { useTranslation } from 'react-i18next';

const Fortnite = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("fortnite")}</h1>
      <Tabs placement="start">
        <Tab title={t("allBanners")}>
          <GetAllBanners />
        </Tab>
        <Tab title={t("battleRoyalMap")}>
          <BattleRoyalMap />
        </Tab>
        <Tab title={t("stwNews")}>
          <STWNews />
        </Tab>
        <Tab title={t("brNews")}>
          <BRNews />
        </Tab>
        <Tab title={t("news")}>
          <News />
        </Tab>
        <Tab title={t("cosmetics")}>
          <Cosmetics />
        </Tab>
        <Tab title={t("newCosmetics")}>
          <NewCosmetics />
        </Tab>
        <Tab title={t("cosmeticsById")}>
          <CosmeticsByID />
        </Tab>
        <Tab title={t("creatorCode")}>
          <CreatorCode />
        </Tab>
        <Tab title={t("twitchDrops")}>
          <TwitchDrops />
        </Tab>
        <Tab title={t("shop")}>
          <Shop />
        </Tab>
        <Tab title={t("activeEvents")}>
          <ActiveEvents />
        </Tab>
        <Tab title={t("challenges")}>
          <Challenges />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Fortnite;
