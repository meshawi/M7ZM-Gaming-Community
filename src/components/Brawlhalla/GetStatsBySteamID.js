import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Input,
  Spinner,
  Accordion,
  AccordionItem,
  Pagination,
} from "@nextui-org/react";
import { CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";

const GetStatsBySteamID = () => {
  const { t } = useTranslation();
  const [steamId, setSteamId] = useState("76561198320003276"); // Initial value
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://brawlhalla.fly.dev/v1/stats/steamid?steam_id=${steamId}`
      );
      const result = await response.json();

      if (response.ok) {
        const { name, legends } = result.data;
        if (!name) {
          setError(t("enterValidSteamID"));
          setData(null);
        } else {
          setData(result.data);
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSteamId(e.target.value);
    setError(null); // Clear error when user starts typing
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentData = data
    ? data.legends.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-4">{t("getStatsBySteamID")}</h1>
      </div>
      <Input
        label={t("steamID")}
        bordered
        fullWidth
        color="primary"
        size="lg"
        value={steamId}
        clearable
        placeholder={t("enterSteamID")}
        onChange={handleInputChange}
        type="number"
        className="w-full max-w-md mb-4"
        isInvalid={!!error}
        errorMessage={error}
      />
      <Button
        shadow
        color="primary"
        auto
        onPress={fetchData}
        disabled={loading}
        className="mb-4"
      >
        {t("fetchData")}
      </Button>

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      )}

      {data && (
        <Card className="w-full max-w-md mt-4">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="p-md font-semibold">
                {t("name")}: {data.name}
              </p>
              <p className="p-md">
                {t("level")}: {data.level}
              </p>
              <p className="p-md">
                {t("xp")}: {data.xp}
              </p>
              <p className="p-md">
                {t("games")}: {data.games}
              </p>
              <p className="p-md">
                {t("wins")}: {data.wins}
              </p>
              <p className="p-md">
                {t("clan")}: {data.clan.clan_name}
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="p-md font-semibold">{t("legends")}:</p>
            <Accordion variant="shadow">
              {currentData.map((legend, index) => (
                <AccordionItem
                  key={index}
                  aria-label={`${t("legend")} ${legend.legend_name_key}`}
                  title={`${t("legend")}: ${legend.legend_name_key}`}
                >
                  <p>
                    {t("damageDealt")}: {legend.damagedealt}
                  </p>
                  <p>
                    {t("damageTaken")}: {legend.damagetaken}
                  </p>
                  <p>
                    {t("kos")}: {legend.kos}
                  </p>
                  <p>
                    {t("falls")}: {legend.falls}
                  </p>
                  <p>
                    {t("suicides")}: {legend.suicides}
                  </p>
                  <p>
                    {t("teamKos")}: {legend.teamkos}
                  </p>
                  <p>
                    {t("games")}: {legend.games}
                  </p>
                  <p>
                    {t("wins")}: {legend.wins}
                  </p>
                </AccordionItem>
              ))}
            </Accordion>
            <Pagination
              total={Math.ceil(data.legends.length / itemsPerPage)}
              initialPage={1}
              page={currentPage}
              onChange={handlePageChange}
              className="mt-4"
            />
          </CardBody>
          <Divider />
          <CardFooter>
            <p>
              {t("lastSynced")}: {new Date(data.lastSynced).toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default GetStatsBySteamID;
