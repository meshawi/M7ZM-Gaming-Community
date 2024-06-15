import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Input, Spinner, Accordion, AccordionItem, Pagination } from "@nextui-org/react";
import { CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";

const RankedByID = () => {
  const { t } = useTranslation();
  const [brawlhallaId, setBrawlhallaId] = useState("3145331"); // Initial value
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
        `https://brawlhalla.fly.dev/v1/ranked/id?brawlhalla_id=${brawlhallaId}`
      );
      const result = await response.json();

      if (response.ok) {
        const {
          name,
          global_rank,
          region_rank,
          legends,
          rating,
          peak_rating,
          tier,
          wins,
          games,
        } = result.data;
        if (!name) {
          setError(t('enterValidID'));
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
    setBrawlhallaId(e.target.value);
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
        <h1 className="text-2xl font-bold mb-4">{t('rankedByID')}</h1>
      </div>
      <Input
        label={t('brawlhallaID')}
        bordered
        fullWidth
        color="primary"
        size="lg"
        value={brawlhallaId}
        clearable
        placeholder={t('enterBrawlhallaID')}
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
              <p className="p-md">{t('globalRank')}: {data.global_rank}</p>
              <p className="p-md">{t('regionRank')}: {data.region_rank}</p>
              <p>{t('rating')}: {data.rating}</p>
              <p>{t('peakRating')}: {data.peak_rating}</p>
              <p>{t('tier')}: {data.tier}</p>
              <p>{t('wins')}: {data.wins}</p>
              <p>{t('games')}: {data.games}</p>
              <p>{t('region')}: {data.region}</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="p-md font-semibold">{t('legends')}:</p>
            <Accordion variant="shadow">
              {currentData.map((legend, index) => (
                <AccordionItem
                  key={index}
                  aria-label={`${t('legend')} ${legend.legend_name_key}`}
                  title={`${t('legend')}: ${legend.legend_name_key}`}
                >
                  <p>{t('rating')}: {legend.rating}</p>
                  <p>{t('peakRating')}: {legend.peak_rating}</p>
                  <p>{t('tier')}: {legend.tier}</p>
                  <p>{t('wins')}: {legend.wins}</p>
                  <p>{t('games')}: {legend.games}</p>
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
            <p>{t('lastSynced')}: {new Date(data.lastSynced).toLocaleString()}</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default RankedByID;
