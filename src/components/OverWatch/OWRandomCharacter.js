import React, { useEffect, useState } from "react";
import { Card, Spinner, Checkbox, Button, Image } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const HERO_TYPES = {
  hitscan: [
    "Ashe",
    "Bastion",
    "Cassidy",
    "Reaper",
    "Soldier: 76",
    "Sombra",
    "Tracer",
    "Widowmaker",
  ],
  projectile: [
    "Ana",
    "Baptiste",
    "Doomfist",
    "Echo",
    "Genji",
    "Hanzo",
    "Junkrat",
    "Lucio",
    "Mei",
    "Orisa",
    "Pharah",
    "Roadhog",
    "Sigma",
    "Symmetra",
    "Torbjörn",
    "Zenyatta",
    "Zarya",
    "Venture"
  ],
  beam: ["Moira", "Symmetra", "Zarya", "Winston"],
  melee: ["Brigitte", "Reinhardt"],
};

const OWRandomCharacter = () => {
  const { t } = useTranslation();
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ roles: [], types: [] });
  const [randomHero, setRandomHero] = useState(null);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await fetch("https://overfast-api.tekrop.fr/heroes");
        const data = await response.json();

        setHeroes(data);
        setFilteredHeroes(data);
      } catch (err) {
        setError(t("fetchDataError"));
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, [t]);

  const handleRoleFilterChange = (role, checked) => {
    const updatedRoles = checked
      ? [...filter.roles, role]
      : filter.roles.filter((r) => r !== role);
    setFilter((prevFilter) => ({ ...prevFilter, roles: updatedRoles }));
    applyFilters(updatedRoles, filter.types);
  };

  const handleTypeFilterChange = (type, checked) => {
    const updatedTypes = checked
      ? [...filter.types, type]
      : filter.types.filter((t) => t !== type);
    setFilter((prevFilter) => ({ ...prevFilter, types: updatedTypes }));
    applyFilters(filter.roles, updatedTypes);
  };

  const applyFilters = (roles, types) => {
    let filtered = heroes;
    if (roles.length > 0) {
      filtered = filtered.filter((hero) => roles.includes(hero.role));
    }
    if (types.length > 0) {
      filtered = filtered.filter((hero) =>
        types.some((type) => HERO_TYPES[type].includes(hero.name))
      );
    }
    setFilteredHeroes(filtered);
  };

  const getRandomHero = () => {
    if (filteredHeroes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredHeroes.length);
      setRandomHero(filteredHeroes[randomIndex]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("overwatchRandomHeroWheel")}</h1>

      <div className="mb-4">
        <div className="flex gap-4">
          <Checkbox
            color="primary"
            onChange={(e) => handleRoleFilterChange("damage", e.target.checked)}
          >
            {t("damage")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleRoleFilterChange("support", e.target.checked)
            }
          >
            {t("support")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) => handleRoleFilterChange("tank", e.target.checked)}
          >
            {t("tank")}
          </Checkbox>
        </div>
        <div className="flex gap-4 mt-4">
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleTypeFilterChange("hitscan", e.target.checked)
            }
          >
            {t("hitscan")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleTypeFilterChange("projectile", e.target.checked)
            }
          >
            {t("projectile")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) => handleTypeFilterChange("beam", e.target.checked)}
          >
            {t("beam")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) => handleTypeFilterChange("melee", e.target.checked)}
          >
            {t("melee")}
          </Checkbox>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      )}
      {error && (
        <p className="text-red-500 text-center">
          {error}
        </p>
      )}
      <Button color="primary" onPress={getRandomHero}>
        {t("getRandomHero")}
      </Button>

      {randomHero && (
        <Card className="flex flex-col items-center p-4 mt-6">
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
          <p>
            {t("type")}:{" "}
            {Object.keys(HERO_TYPES).find((type) =>
              HERO_TYPES[type].includes(randomHero.name)
            )}
          </p>
        </Card>
      )}
    </div>
  );
};

export default OWRandomCharacter;
