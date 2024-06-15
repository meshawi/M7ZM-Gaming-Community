import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

const GetAllLegends = () => {
  const { t } = useTranslation();
  const [legends, setLegends] = useState([]);
  const [filteredLegends, setFilteredLegends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLegend, setSelectedLegend] = useState(null);
  const [selectedWeapons, setSelectedWeapons] = useState([]);
  const [selectedStat, setSelectedStat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
    applyFilters(updatedWeapons, selectedStat, searchTerm);
  };

  const handleStatFilterChange = (stat, checked) => {
    const updatedStat = checked ? stat : null;
    setSelectedStat(updatedStat);
    applyFilters(selectedWeapons, updatedStat, searchTerm);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(selectedWeapons, selectedStat, term);
  };

  const applyFilters = (weapons, stat, term) => {
    let filtered = legends;

    if (weapons.length > 0) {
      filtered = filtered.filter(
        (legend) =>
          weapons.includes(legend.weapon_one) ||
          weapons.includes(legend.weapon_two)
      );
    }

    if (stat) {
      filtered = filtered.sort(
        (a, b) =>
          parseInt(b[stat.toLowerCase()]) - parseInt(a[stat.toLowerCase()])
      );
    }

    if (term) {
      filtered = filtered.filter((legend) =>
        legend.bio_name.toLowerCase().includes(term)
      );
    }

    setFilteredLegends(filtered);
  };

  const fetchLegendDetails = async (legend) => {
    setSelectedLegend(legend);
    onOpen();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('brawlhallaLegends')}</h1>

      <div className="mb-4">
        <Input
          placeholder={t('searchByName')}
          fullWidth
          onChange={handleSearchChange}
          className="mb-4"
        />
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
        <p>{t('filterByStats')}</p>
        <div className="flex gap-4 flex-wrap mt-4">
          {["Strength", "Dexterity", "Defense", "Speed"].map((stat) => (
            <Checkbox
              key={stat}
              color="primary"
              onChange={(e) => handleStatFilterChange(stat, e.target.checked)}
              isChecked={selectedStat === stat}
            >
              {stat}
            </Checkbox>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredLegends.map((legend) => (
            <Card
              key={legend.legend_id}
              className="flex flex-col items-center p-4"
            >
              <Image
                src={legend.thumbnail}
                alt={legend.bio_name}
                width={150}
                height={150}
                objectFit="cover"
                className="rounded-lg mb-4"
              />
              <p className="font-bold text-lg">{legend.bio_name}</p>
              <p>{t('strength')}: {legend.strength}</p>
              <p>{t('dexterity')}: {legend.dexterity}</p>
              <p>{t('defense')}: {legend.defense}</p>
              <p>{t('speed')}: {legend.speed}</p>
              <p>
                {t('weapons')}: {legend.weapon_one} / {legend.weapon_two}
              </p>
              <Button
                color="primary"
                variant="light"
                onPress={() => fetchLegendDetails(legend)}
                className="mt-2"
              >
                {t('viewDetails')}
              </Button>
            </Card>
          ))}
        </div>
      )}

      {selectedLegend && (
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
                  {selectedLegend.bio_name}
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col items-center">
                    <Image
                      src={selectedLegend.thumbnail}
                      alt={selectedLegend.bio_name}
                      width={150}
                      height={150}
                      objectFit="cover"
                      className="rounded-lg mb-4"
                    />
                    <p>{selectedLegend.bio_aka}</p>
                    <p>{t('strength')}: {selectedLegend.strength}</p>
                    <p>{t('dexterity')}: {selectedLegend.dexterity}</p>
                    <p>{t('defense')}: {selectedLegend.defense}</p>
                    <p>{t('speed')}: {selectedLegend.speed}</p>
                    <p>
                      {t('weapons')}: {selectedLegend.weapon_one} /{" "}
                      {selectedLegend.weapon_two}
                    </p>
                    <p>{selectedLegend.bio_quote}</p>
                    <p>{selectedLegend.bio_quote_from}</p>
                    <p>{selectedLegend.bio_text}</p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    {t('close')}
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

export default GetAllLegends;
