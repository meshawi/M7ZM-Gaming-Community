import React from "react";
import { Card, Image, Tooltip, Checkbox } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { getTimeSinceRelease } from "./Codhelpers";

export const CodCard = ({ game }) => {
  const { t } = useTranslation();

  return (
    <Tooltip
      content={`${t("released")}: ${new Date(
        game.releaseDate
      ).toLocaleDateString()} (${getTimeSinceRelease(game.releaseDate)})`}
      showArrow={true}
    >
      <Card className="flex flex-col items-center p-4">
        <Image src={game.image} alt={game.name} className="mb-4" />
        <p className="font-bold text-lg">{game.name}</p>
        <p>{t("releaseDate")}: {new Date(game.releaseDate).toLocaleDateString()}</p>
      </Card>
    </Tooltip>
  );
};

export const Filters = ({ filter, setFilter }) => {
  const { t } = useTranslation();

  const handleDecadeFilterChange = (decade) => {
    setFilter((prevFilter) => {
      const updatedDecades = prevFilter.decades.includes(decade)
        ? prevFilter.decades.filter((d) => d !== decade)
        : [...prevFilter.decades, decade];
      return { ...prevFilter, decades: updatedDecades };
    });
  };

  const handleSeriesFilterChange = (series) => {
    setFilter((prevFilter) => {
      const updatedSeries = prevFilter.series.includes(series)
        ? prevFilter.series.filter((s) => s !== series)
        : [...prevFilter.series, series];
      return { ...prevFilter, series: updatedSeries };
    });
  };

  return (
    <>
      <div className="mb-4 flex gap-4">
        <Checkbox
          isSelected={filter.decades.includes("2000")}
          onChange={() => handleDecadeFilterChange("2000")}
        >
          {t("2000s")}
        </Checkbox>
        <Checkbox
          isSelected={filter.decades.includes("2010")}
          onChange={() => handleDecadeFilterChange("2010")}
        >
          {t("2010s")}
        </Checkbox>
        <Checkbox
          isSelected={filter.decades.includes("2020")}
          onChange={() => handleDecadeFilterChange("2020")}
        >
          {t("2020s")}
        </Checkbox>
      </div>

      <div className="mb-4 flex gap-4">
        <Checkbox
          isSelected={filter.series.includes("Modern Warfare")}
          onChange={() => handleSeriesFilterChange("Modern Warfare")}
        >
          {t("modernWarfareSeries")}
        </Checkbox>
        <Checkbox
          isSelected={filter.series.includes("Black Ops")}
          onChange={() => handleSeriesFilterChange("Black Ops")}
        >
          {t("blackOpsSeries")}
        </Checkbox>
        <Checkbox
          isSelected={filter.series.includes("Others")}
          onChange={() => handleSeriesFilterChange("Others")}
        >
          {t("othersSeries")}
        </Checkbox>
      </div>
    </>
  );
};
