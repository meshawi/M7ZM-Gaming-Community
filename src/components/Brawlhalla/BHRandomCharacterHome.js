import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Spinner, Image } from "@nextui-org/react";
import legendsData from "../../data/AllBrawllLegends.json"; // Import the JSON data

const BHRandomCharacterHome = () => {
  const { t } = useTranslation();
  const [randomLegend, setRandomLegend] = useState(null);

  useEffect(() => {
    const getRandomLegend = () => {
      if (legendsData.length > 0) {
        const randomIndex = Math.floor(Math.random() * legendsData.length);
        setRandomLegend(legendsData[randomIndex]);
      }
    };

    getRandomLegend();
  }, []);

  return (
    <Card className="flex flex-col items-center p-4 mt-6">
      <h2 className="font-bold mb-4">{t('randomBrawlhallaLegend')}</h2>
      {randomLegend ? (
        <>
          <Image
            src={`/brawlhalla_images/${randomLegend.thumbnail}`} // Use the image from the public folder
            alt={randomLegend.bio_name}
            width={150}
            height={150}
            objectFit="cover"
            className="rounded-lg mb-4"
          />
          <p className="font-bold text-lg">{randomLegend.bio_name}</p>
          <p>
            {t('weapons')}: {randomLegend.weapon_one} / {randomLegend.weapon_two}
          </p>
        </>
      ) : (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      )}
    </Card>
  );
};

export default BHRandomCharacterHome;
