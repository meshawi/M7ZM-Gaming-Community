import React, { useEffect, useState } from "react";
import { Card, Spinner, Checkbox, Text, Image } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const GetAllMaps = () => {
  const { t } = useTranslation();
  const [maps, setMaps] = useState([]);
  const [filteredMaps, setFilteredMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ gamemodes: [] });

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await fetch("https://overfast-api.tekrop.fr/maps");
        const data = await response.json();

        setMaps(data);
        setFilteredMaps(data);
      } catch (err) {
        setError(t("fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, [t]);

  const handleGamemodeFilterChange = (gamemode, checked) => {
    const updatedGamemodes = checked
      ? [...filter.gamemodes, gamemode]
      : filter.gamemodes.filter((gm) => gm !== gamemode);
    setFilter({ gamemodes: updatedGamemodes });
    applyFilters(updatedGamemodes);
  };

  const applyFilters = (gamemodes) => {
    let filtered = maps;
    if (gamemodes.length > 0) {
      filtered = filtered.filter((map) =>
        gamemodes.some((gm) => map.gamemodes.includes(gm))
      );
    }
    setFilteredMaps(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <p className="text-2xl font-bold mb-4">
        {t("getAllMaps")}
      </p>

      <div className="mb-4">
        <div className="flex gap-4">
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleGamemodeFilterChange("assault", e.target.checked)
            }
          >
            {t("assault")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleGamemodeFilterChange("capture-the-flag", e.target.checked)
            }
          >
            {t("captureTheFlag")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleGamemodeFilterChange("control", e.target.checked)
            }
          >
            {t("control")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleGamemodeFilterChange("deathmatch", e.target.checked)
            }
          >
            {t("deathmatch")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleGamemodeFilterChange("team-deathmatch", e.target.checked)
            }
          >
            {t("teamDeathmatch")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleGamemodeFilterChange("elimination", e.target.checked)
            }
          >
            {t("elimination")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleGamemodeFilterChange("escort", e.target.checked)
            }
          >
            {t("escort")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleGamemodeFilterChange("hybrid", e.target.checked)
            }
          >
            {t("hybrid")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleGamemodeFilterChange("push", e.target.checked)
            }
          >
            {t("push")}
          </Checkbox>
          <Checkbox
            color="primary"
            onChange={(e) =>
              handleGamemodeFilterChange("flashpoint", e.target.checked)
            }
          >
            {t("flashpoint")}
          </Checkbox>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      )}
      {error && (
        <p color="error" className="text-red-500 text-center">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaps.map((map) => (
          <Card key={map.name} className="flex flex-col items-center p-4">
            <img
              src={map.screenshot}
              alt={map.name}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                marginBottom: "16px",
              }}
            />
            <p className="font-bold text-lg">{map.name}</p>
            <p>{map.location}</p>
            <p>{t("gamemodes")}: {map.gamemodes.join(", ")}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GetAllMaps;
