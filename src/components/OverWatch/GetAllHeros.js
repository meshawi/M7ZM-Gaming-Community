import React, { useEffect, useState } from "react";
import {
  Card,
  Spinner,
  Checkbox,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from "@nextui-org/react";
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
  beam: ["Moira", "Symmetra", "Zarya","Winston"],
  melee: ["Brigitte", "Reinhardt"],
};

const GetAllHeros = () => {
  const { t } = useTranslation();
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ name: "", roles: [], types: [] });
  const [selectedHero, setSelectedHero] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await fetch("https://overfast-api.tekrop.fr//heroes");
        const data = await response.json();

        setHeroes(data);
        setFilteredHeroes(data);
      } catch (err) {
        setError(t("fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, [t]);

  const handleNameFilterChange = (e) => {
    const name = e.target.value.toLowerCase();
    setFilter((prevFilter) => ({ ...prevFilter, name }));
    applyFilters(name, filter.roles, filter.types);
  };

  const handleRoleFilterChange = (role, checked) => {
    const updatedRoles = checked
      ? [...filter.roles, role]
      : filter.roles.filter((r) => r !== role);
    setFilter((prevFilter) => ({ ...prevFilter, roles: updatedRoles }));
    applyFilters(filter.name, updatedRoles, filter.types);
  };

  const handleTypeFilterChange = (type, checked) => {
    const updatedTypes = checked
      ? [...filter.types, type]
      : filter.types.filter((t) => t !== type);
    setFilter((prevFilter) => ({ ...prevFilter, types: updatedTypes }));
    applyFilters(filter.name, filter.roles, updatedTypes);
  };

  const applyFilters = (name, roles, types) => {
    let filtered = heroes;
    if (name) {
      filtered = filtered.filter((hero) =>
        hero.name.toLowerCase().includes(name)
      );
    }
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

  const fetchHeroDetails = async (heroName) => {
    setLoading(true);
    setError(null);
    setSelectedHero(null);

    try {
      const response = await fetch(
        `https://overfast-api.tekrop.fr//heroes/${heroName.toLowerCase()}`
      );
      if (!response.ok) {
        throw new Error("Hero not found");
      }
      const data = await response.json();
      setSelectedHero(data);
      onOpen();
    } catch (err) {
      setError(t("fetchHeroError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("getAllHeros")}</h1>

      <div className="mb-4">
        <Input
          placeholder={t("searchByName")}
          fullWidth
          onChange={handleNameFilterChange}
          className="mb-4"
        />
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
        <p color="error" className="text-red-500 text-center">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {filteredHeroes.map((hero) => (
          <Card key={hero.key} className="flex flex-col items-center p-4">
            <img
              src={hero.portrait}
              alt={hero.name}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                marginBottom: "16px",
              }}
            />
            <p className="font-bold text-lg">{hero.name}</p>
            <p>{t(hero.role.charAt(0).toUpperCase() + hero.role.slice(1))}</p>
            <Button
              color="primary"
              variant="light"
              onPress={() => fetchHeroDetails(hero.name)}
              className="mt-2"
            >
              {t("viewDetails")}
            </Button>
          </Card>
        ))}
      </div>

      {selectedHero && (
        <Modal
          backdrop="opaque"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedHero.name}
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col items-center">
                    <Image
                      src={selectedHero.portrait}
                      alt={selectedHero.name}
                      width={150}
                      height={150}
                      objectFit="cover"
                      className="rounded-lg mb-4"
                    />
                    <p>{selectedHero.description}</p>
                    <p h4>
                      {t("role")}:{" "}
                      {t(selectedHero.role.charAt(0).toUpperCase() +
                        selectedHero.role.slice(1))}
                    </p>
                    <p h4>{t("location")}: {selectedHero.location}</p>
                    <p h4>{t("birthday")}: {selectedHero.birthday}</p>
                    <p h4>{t("age")}: {selectedHero.age}</p>
                    <p h4>{t("health")}: {selectedHero.hitpoints.health}</p>
                    <p h4>{t("armor")}: {selectedHero.hitpoints.armor}</p>
                    <p h4>{t("shields")}: {selectedHero.hitpoints.shields}</p>
                    <p h4>{t("totalHitpoints")}: {selectedHero.hitpoints.total}</p>
                    <p h3 className="font-bold mt-4">
                      {t("abilities")}
                    </p>
                    {selectedHero.abilities.map((ability) => (
                      <Card key={ability.name} className="my-2 w-full">
                        <div className="flex items-center space-x-4 p-2">
                          <Image
                            src={ability.icon}
                            alt={ability.name}
                            width={50}
                            height={50}
                            objectFit="cover"
                            className="rounded-lg"
                          />
                          <div>
                            <p h4 className="font-semibold">
                              {ability.name}
                            </p>
                            <p>{ability.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    {t("close")}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default GetAllHeros;
