import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
  Spinner,
  Checkbox,
} from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const SuadiDealAllCard = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ types: [], landFamilies: [] });
  const [selectedCard, setSelectedCard] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const LAND_FAMILIES = [
    t('riyadh'),
    t('albaha'),
    t('eastern'),
    t('taif'),
    t('qassim'),
    t('madinah'),
    t('tabuk'),
    t('jazan'),
    t('jeddah'),
    t('hail'),
    t('asir'),
    t('mecca'),
  ];

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("https://api.aleshawi.me/api/sd-cards", {
          headers: {
            Authorization:
              "Bearer 2|FGsWttTyB9YNk3XqhWrFrDV4rLLqkyqlh9vt3M0d3da3a308",
          },
        });
        const data = await response.json();
        setCards(data.data);
        setFilteredCards(data.data);
      } catch (err) {
        setError(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [t]);

  const handleTypeFilterChange = (type, checked) => {
    const updatedTypes = checked
      ? [...filter.types, type]
      : filter.types.filter((t) => t !== type);
    setFilter((prevFilter) => ({ ...prevFilter, types: updatedTypes }));
    applyFilters(filter.name, updatedTypes, filter.landFamilies);
  };

  const handleLandFamilyFilterChange = (family, checked) => {
    const updatedLandFamilies = checked
      ? [...filter.landFamilies, family]
      : filter.landFamilies.filter((f) => f !== family);
    setFilter((prevFilter) => ({
      ...prevFilter,
      landFamilies: updatedLandFamilies,
    }));
    applyFilters(filter.name, filter.types, updatedLandFamilies);
  };

  const applyFilters = (name, types, landFamilies) => {
    let filtered = cards;
    if (name) {
      filtered = filtered.filter(
        (card) =>
          card.cardName &&
          card.cardName.localeCompare(name, undefined, {
            sensitivity: "base",
          }) === 0
      );
    }
    if (types.length > 0) {
      filtered = filtered.filter((card) => types.includes(card.cardType));
    }
    if (types.includes("land") && landFamilies.length > 0) {
      filtered = filtered.filter((card) =>
        landFamilies.includes(card.landFamily)
      );
    }
    setFilteredCards(filtered);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    onOpen();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('saudiDealCards')}</h1>

      <div className="mb-4">
        <div className="flex gap-4 flex-wrap">
          {[
            "action",
            "rejection",
            "building",
            "dues",
            "land",
            "rental",
            "money",
            "realestate",
            "other",
          ].map((type) => (
            <Checkbox
              key={type}
              color="primary"
              onChange={(e) => handleTypeFilterChange(type, e.target.checked)}
            >
              {t(type)}
            </Checkbox>
          ))}
        </div>
        {filter.types.includes("land") && (
          <div className="flex gap-4 flex-wrap mt-4">
            {LAND_FAMILIES.map((family) => (
              <Checkbox
                key={family}
                color="primary"
                onChange={(e) =>
                  handleLandFamilyFilterChange(family, e.target.checked)
                }
              >
                {family}
              </Checkbox>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <Card key={card.cardID} className="flex flex-col items-center p-4">
              <img
                src={card.cardImage}
                alt={card.cardName}
                style={{
                  width: "150px",
                  height: "230px",
                  objectFit: "cover",
                  marginBottom: "16px",
                }}
              />
              <p className="font-bold text-lg">{card.cardName}</p>
              <Button
                color="primary"
                variant="light"
                onPress={() => handleCardClick(card)}
                className="mt-2"
              >
                {t('showDetails')}
              </Button>
            </Card>
          ))}
        </div>
      )}

      {selectedCard && (
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
                  {selectedCard.cardName}
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col items-center">
                    <Image
                      src={selectedCard.cardImage}
                      alt={selectedCard.cardName}
                      width={150}
                      height={150}
                      objectFit="cover"
                      className="rounded-lg mb-4"
                    />
                    <p>{selectedCard.cardDescription}</p>
                    <p className="text-sm">{t('type')}: {selectedCard.cardType}</p>
                    <p className="text-sm">{t('copies')}: {selectedCard.cardCopies}</p>
                    {selectedCard.cardType === "land" && (
                      <>
                        {selectedCard.landFamily && (
                          <p className="text-sm">
                            {t('landFamily')}: {selectedCard.landFamily}
                          </p>
                        )}
                        {selectedCard.numberOfCardsToComplete && (
                          <p className="text-sm">
                            {t('numberOfCardsToComplete')}:{" "}
                            {selectedCard.numberOfCardsToComplete}
                          </p>
                        )}
                        {selectedCard.valuesOfBuildings && (
                          <div className="text-sm">
                            <p>{t('buildingValues')}:</p>
                            <ul>
                              <li>
                                {t('buildingOne')}:{" "}
                                {selectedCard.valuesOfBuildings.buildingOne}
                              </li>
                              <li>
                                {t('buildingTwo')}:{" "}
                                {selectedCard.valuesOfBuildings.buildingTwo}
                              </li>
                              <li>
                                {t('buildingThree')}:{" "}
                                {selectedCard.valuesOfBuildings.buildingThree}
                              </li>
                              <li>
                                {t('maxBuildValue')}:{" "}
                                {selectedCard.valuesOfBuildings.maxBuildValue}
                              </li>
                            </ul>
                          </div>
                        )}
                        {selectedCard.landDetails &&
                          Object.keys(selectedCard.landDetails).map((key) => (
                            <div key={key} className="text-sm">
                              <p>
                                {selectedCard.landDetails[key].landFamily} -{" "}
                                {selectedCard.landDetails[key].landName}
                              </p>
                              <p>
                                {t('numberOfCardsToComplete')}:{" "}
                                {
                                  selectedCard.landDetails[key]
                                    .numberOfCardsToComplete
                                }
                              </p>
                              <div>
                                <p>{t('buildingValues')}:</p>
                                <ul>
                                  <li>
                                    {t('buildingOne')}:{" "}
                                    {
                                      selectedCard.landDetails[key]
                                        .valuesOfBuildings.buildingOne
                                    }
                                  </li>
                                  <li>
                                    {t('buildingTwo')}:{" "}
                                    {
                                      selectedCard.landDetails[key]
                                        .valuesOfBuildings.buildingTwo
                                    }
                                  </li>
                                  {selectedCard.landDetails[key]
                                    .valuesOfBuildings.buildingThree && (
                                    <li>
                                      {t('buildingThree')}:{" "}
                                      {
                                        selectedCard.landDetails[key]
                                          .valuesOfBuildings.buildingThree
                                      }
                                    </li>
                                  )}
                                  {selectedCard.landDetails[key]
                                    .valuesOfBuildings.buildingFour && (
                                    <li>
                                      {t('buildingFour')}:{" "}
                                      {
                                        selectedCard.landDetails[key]
                                          .valuesOfBuildings.buildingFour
                                      }
                                    </li>
                                  )}
                                  <li>
                                    {t('maxBuildValue')}:{" "}
                                    {
                                      selectedCard.landDetails[key]
                                        .valuesOfBuildings.maxBuildValue
                                    }
                                  </li>
                                </ul>
                              </div>
                            </div>
                          ))}
                      </>
                    )}
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

export default SuadiDealAllCard;
