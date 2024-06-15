import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Spinner, Checkbox, Button, Image } from "@nextui-org/react";

const BHRandomCharacter = () => {
  const { t } = useTranslation();
  const [legends, setLegends] = useState([]);
  const [filteredLegends, setFilteredLegends] = useState([]);
  const [randomLegend, setRandomLegend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeapons, setSelectedWeapons] = useState([]);

  useEffect(() => {
    const fetchLegends = async () => {
      try {
        const response = await fetch(
          "https://brawlhalla.fly.dev/v1/legends/all"
        );
        const data = await response.json();

        if (data.statusCode === 200) {
          setLegends(data.data);
          setFilteredLegends(data.data);
        } else {
          setError(t("fetchFailed"));
        }
      } catch (err) {
        setError(t("fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchLegends();
  }, [t]);

  const handleWeaponFilterChange = (weapon, checked) => {
    const updatedWeapons = checked
      ? [...selectedWeapons, weapon]
      : selectedWeapons.filter((w) => w !== weapon);
    setSelectedWeapons(updatedWeapons);
    applyFilters(updatedWeapons);
  };

  const applyFilters = (weapons) => {
    let filtered = legends;

    if (weapons.length > 0) {
      filtered = filtered.filter(
        (legend) =>
          weapons.includes(legend.weapon_one) ||
          weapons.includes(legend.weapon_two)
      );
    }

    setFilteredLegends(filtered);
    setRandomLegend(null);
  };

  const getRandomLegend = () => {
    if (filteredLegends.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredLegends.length);
      setRandomLegend(filteredLegends[randomIndex]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('bhRandomCharacter')}</h1>

      <div className="mb-4">
        <p>{t('filterByWeapons')}</p>
        <div className="flex gap-4 flex-wrap">
          {[
            "Hammer",
            "Sword",
            "Pistol",
            "RocketLance",
            "Spear",
            "Katar",
            "Bow",
            "Axe",
            "Orb",
            "Boots",
            "Cannon",
            "Fists",
            "Scythe",
          ].map((weapon) => (
            <Checkbox
              key={weapon}
              color="primary"
              onChange={(e) =>
                handleWeaponFilterChange(weapon, e.target.checked)
              }
            >
              {weapon}
            </Checkbox>
          ))}
        </div>
        <Button color="primary" onPress={getRandomLegend} className="mt-4">
          {t('getRandomCharacter')}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        randomLegend && (
          <Card className="flex flex-col items-center p-4">
            <Image
              src={randomLegend.thumbnail}
              alt={randomLegend.bio_name}
              width={150}
              height={150}
              objectFit="cover"
              className="rounded-lg mb-4"
            />
            <p className="font-bold text-lg">{randomLegend.bio_name}</p>
            <p>{t('strength')}: {randomLegend.strength}</p>
            <p>{t('dexterity')}: {randomLegend.dexterity}</p>
            <p>{t('defense')}: {randomLegend.defense}</p>
            <p>{t('speed')}: {randomLegend.speed}</p>
            <p>
              {t('weapons')}: {randomLegend.weapon_one} / {randomLegend.weapon_two}
            </p>
          </Card>
        )
      )}
    </div>
  );
};

export default BHRandomCharacter;
