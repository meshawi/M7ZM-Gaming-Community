import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Input, Spinner } from "@nextui-org/react";
import { CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";

const GloryBySteamID = () => {
  const { t } = useTranslation();
  const [steamId, setSteamId] = useState("76561198320003276"); // Initial value
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://brawlhalla.fly.dev/v1/glory/steamid?steam_id=${steamId}`
      );
      const result = await response.json();

      if (response.ok) {
        const { name, bestElo, eloReset, glory } = result.data;
        if (
          !name ||
          bestElo === 0 ||
          eloReset === 0 ||
          glory.wins === 0 ||
          glory.rating === 0
        ) {
          setError(t('enterValidSteamID'));
          setData(null);
        } else {
          setData(result.data);
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(t('fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSteamId(e.target.value);
    setError(null); // Clear error when user starts typing
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-4">{t('gloryBySteamID')}</h1>
      </div>
      <Input
        label={t('steamID')}
        bordered
        fullWidth
        color="primary"
        size="lg"
        value={steamId}
        clearable
        placeholder={t('enterSteamID')}
        onChange={handleInputChange}
        type="text"
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
        {t('fetchData')}
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
              <p className="p-md font-semibold">{t('name')}: {data.name}</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>{t('bestElo')}: {data.bestElo}</p>
            <p>{t('eloReset')}: {data.eloReset}</p>
            <p>{t('gloryWins')}: {data.glory.wins}</p>
            <p>{t('gloryRating')}: {data.glory.rating}</p>
          </CardBody>
          <Divider />
          <CardFooter>
            <p>{t('lastSynced')}: {new Date(data.lastSynced).toLocaleString()}</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default GloryBySteamID;
