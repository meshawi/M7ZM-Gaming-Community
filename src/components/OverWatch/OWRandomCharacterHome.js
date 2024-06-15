// src/components/OWRandomCharacterHome.js
import React, { useEffect, useState } from "react";
import { Card, Spinner, Button, Image } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const OWRandomCharacterHome = () => {
  const { t } = useTranslation();
  const [heroes, setHeroes] = useState([]);
  const [randomHero, setRandomHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await fetch("https://overfast-api.tekrop.fr/heroes");
        const data = await response.json();
        setHeroes(data);
      } catch (err) {
        setError(t("fetchDataError"));
      } finally {
        setLoading(false);
      }
    };
    fetchHeroes();
  }, [t]);

  const getRandomHero = () => {
    if (heroes.length > 0) {
      const randomIndex = Math.floor(Math.random() * heroes.length);
      setRandomHero(heroes[randomIndex]);
    }
  };

  useEffect(() => {
    if (heroes.length > 0) {
      getRandomHero();
    }
  }, [heroes]);

  return (
    <Card className="flex flex-col items-center p-4 mt-6">
      <h2 className="font-bold mb-4">{t("randomOverwatchHero")}</h2>

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && randomHero && (
        <>
          <Image
            src={randomHero.portrait}
            alt={randomHero.name}
            width={150}
            height={150}
            objectFit="cover"
            className="rounded-lg mb-4"
          />
          <p className="font-bold text-lg">{randomHero.name}</p>
          <p>
            {t("role")}:{" "}
            {randomHero.role.charAt(0).toUpperCase() + randomHero.role.slice(1)}
          </p>
        </>
      )}
    </Card>
  );
};

export default OWRandomCharacterHome;
