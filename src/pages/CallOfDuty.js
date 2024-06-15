import React, { useEffect, useState } from "react";
import { Input, Spinner } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import {
  fetchGamesFromAPI,
  getSeries,
} from "../components/CallOfDuty/Codhelpers";
import { Filters, CodCard } from "../components/CallOfDuty/CodCard";

const CallOfDuty = () => {
  const { t } = useTranslation();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ name: "", decades: [], series: [] });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await fetchGamesFromAPI();
        if (data.status) {
          setGames(data.data);
          setFilteredGames(data.data);
        } else {
          setError(t("fetchGamesError"));
        }
      } catch (err) {
        setError(t("fetchDataError"));
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [t]);

  const applyFilters = (name, decades, series) => {
    let filtered = games;
    if (name) {
      filtered = filtered.filter((game) =>
        game.name.toLowerCase().includes(name)
      );
    }
    if (decades.length > 0) {
      filtered = filtered.filter((game) => {
        const releaseYear = new Date(game.releaseDate).getFullYear();
        return decades.some((decade) => {
          const startYear = parseInt(decade, 10);
          const endYear = startYear + 9;
          return releaseYear >= startYear && releaseYear <= endYear;
        });
      });
    }
    if (series.length > 0) {
      filtered = filtered.filter((game) =>
        series.includes(getSeries(game.name))
      );
    }
    setFilteredGames(filtered);
  };

  useEffect(() => {
    applyFilters(filter.name, filter.decades, filter.series);
  }, [filter, games]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("callOfDutyGames")}</h1>

      <div className="mb-4">
        <Input
          placeholder={t("filterByName")}
          fullWidth
          onChange={(e) =>
            setFilter({ ...filter, name: e.target.value.toLowerCase() })
          }
          className="mb-4"
        />
      </div>

      <Filters filter={filter} setFilter={setFilter} />

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <CodCard key={game.cod} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CallOfDuty;
