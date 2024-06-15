// src/pages/TwitchDrops.js
import React, { useEffect, useState } from "react";
import { Card, Spinner, Button } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const TwitchDrops = () => {
  const { t } = useTranslation();
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ACTIVE");

  useEffect(() => {
    const fetchDrops = async () => {
      setLoading(true);
      try {
        const url =
          filter === "ACTIVE"
            ? "https://fortniteapi.io/v1/twitch/drops?status=ACTIVE"
            : "https://fortniteapi.io/v1/twitch/drops";
        const response = await fetch(url, {
          headers: {
            // use your own API key from .env file FORTNITE_API_KEY
            Authorization: process.env.FORTNITE_API_KEY,          },
        });
        const data = await response.json();
        if (data.result) {
          setDrops(data.drops);
        } else {
          setError(t('failedToFetchDrops'));
        }
      } catch (err) {
        setError(t('fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchDrops();
  }, [filter, t]);

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('twitchDrops')}</h1>
      <div className="flex gap-4 mb-4">
        <Button
          onClick={() => handleFilterChange("ALL")}
          disabled={filter === "ALL"}
        >
          {t('allDrops')}
        </Button>
        <Button
          onClick={() => handleFilterChange("ACTIVE")}
          disabled={filter === "ACTIVE"}
        >
          {t('activeDrops')}
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drops.map((drop) => (
            <Card key={drop.dropUUID} className="p-4">
              <img
                src={drop.gameArtUrl}
                alt={drop.name}
                className="w-full h-40 object-cover mb-4"
              />
              <h2 className="font-bold text-lg">{drop.name}</h2>
              <p>{drop.description}</p>
              <p className="mt-2">
                <strong>{t('status')}:</strong> {drop.status}
              </p>
              <p className="mt-2">
                <strong>{t('startDate')}:</strong>{" "}
                {new Date(drop.startDate).toLocaleString()}
              </p>
              <p className="mt-2">
                <strong>{t('endDate')}:</strong>{" "}
                {new Date(drop.endDate).toLocaleString()}
              </p>
              {drop.detailsURL && (
                <a
                  href={drop.detailsURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-blue-500"
                >
                  {t('moreDetails')}
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TwitchDrops;
