import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import GetAllHeros from "../components/OverWatch/GetAllHeros";
import GetHeroByName from "../components/OverWatch/GetHeroByName";
import GetAllMaps from "../components/OverWatch/GetAllMaps";
import GetUtillData from "../components/OverWatch/GetUtillData";
import GetWorkshopCodes from "../components/OverWatch/GetWorkshopCodes";
import OWRandomCharacter from "../components/OverWatch/OWRandomCharacter";
import Composition from "../components/OverWatch/Composition";

const OverWatch = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("overwatch")}</h1>
      <Tabs placement="start">
        <Tab title={t("getAllHeros")}>
          <GetAllHeros />
        </Tab>
        <Tab title={t("getHeroByName")}>
          <GetHeroByName />
        </Tab>
        <Tab title={t("getAllMaps")}>
          <GetAllMaps />
        </Tab>
        <Tab title={t("getUtillData")}>
          <GetUtillData />
        </Tab>
        <Tab title={t("getWorkshopCodes")}>
          <GetWorkshopCodes />
        </Tab>
        <Tab title={t("randomHero")}>
          <OWRandomCharacter />
        </Tab>
        <Tab title={t("compositions")}>
          <Composition />
        </Tab>
      </Tabs>
    </div>
  );
};

export default OverWatch;
