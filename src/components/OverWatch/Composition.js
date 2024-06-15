import React, { useEffect, useState } from 'react';
import { Card, Spinner, Checkbox, Image } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const COMPOSITIONS = {
    Dive: {
        Tanks: ["Winston", "D.Va", "Wrecking Ball","Doomfist"],
        DPS: ["Tracer", "Genji", "Sombra", "Echo","Sojourn","Pharah"],
        Supports: ["Moira", "Lúcio", "Mercy", "Ana","Brigitte","Kiriko"]
    },
    Brawl: {
        Tanks: ["Reinhardt", "Junker Queen","Zarya","Mauga","Orisa", "Roadhog","Ramattra"],
        DPS: ["Venture", "Symmetra", "Mei", "Reaper", "Torbjörn", "Bastion", "Junkrat"],
        Supports: ["Ana", "Baptiste", "Brigitte", "Lúcio", "Moira", "Lifeweaver"]
    },
    Poke: {
        Tanks: ["Sigma", "Ramattra", "Roadhog"],
        DPS: ["Ashe", "Hanzo", "Widowmaker", "Pharah", "Soldier: 76", "Sojourn", "Symmetra", "Mei", "Torbjörn"],
        Supports: ["Kiriko", "Zenyatta", "Mercy", "Illari", "Ana", "Baptiste"]
    }
};

const ROLES = ["Tanks", "DPS", "Supports"];

const Composition = () => {
    const { t } = useTranslation();
    const [heroes, setHeroes] = useState([]);
    const [filteredCompositions, setFilteredCompositions] = useState(Object.keys(COMPOSITIONS));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCompositions, setSelectedCompositions] = useState(Object.keys(COMPOSITIONS));
    const [selectedRoles, setSelectedRoles] = useState(ROLES);

    useEffect(() => {
        const fetchHeroes = async () => {
            try {
                const response = await fetch("https://overfast-api.tekrop.fr//heroes");
                const data = await response.json();
                setHeroes(data);
            } catch (err) {
                setError(t("fetchError"));
            } finally {
                setLoading(false);
            }
        };

        fetchHeroes();
    }, [t]);

    const handleCompositionFilterChange = (composition, checked) => {
        const updatedCompositions = checked
            ? [...selectedCompositions, composition]
            : selectedCompositions.filter((comp) => comp !== composition);
        setSelectedCompositions(updatedCompositions);
        setFilteredCompositions(updatedCompositions);
    };

    const handleRoleFilterChange = (role, checked) => {
        const updatedRoles = checked
            ? [...selectedRoles, role]
            : selectedRoles.filter((r) => r !== role);
        setSelectedRoles(updatedRoles);
    };

    const getHeroDetails = (name) => {
        return heroes.find((hero) => hero.name.toLowerCase() === name.toLowerCase());
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t("compositions")}</h1>

            <div className="mb-4">
                <p>{t("filterByComposition")}:</p>
                <div className="flex gap-4 flex-wrap mb-4">
                    {Object.keys(COMPOSITIONS).map((composition) => (
                        <Checkbox
                            key={composition}
                            color="primary"
                            isSelected={selectedCompositions.includes(composition)}
                            onChange={(e) => handleCompositionFilterChange(composition, e.target.checked)}
                        >
                            {t(composition)}
                        </Checkbox>
                    ))}
                </div>
                <p>{t("filterByRole")}:</p>
                <div className="flex gap-4 flex-wrap">
                    {ROLES.map((role) => (
                        <Checkbox
                            key={role}
                            color="primary"
                            isSelected={selectedRoles.includes(role)}
                            onChange={(e) => handleRoleFilterChange(role, e.target.checked)}
                        >
                            {t(role)}
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
                filteredCompositions.map((composition) => (
                    <div key={composition} className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">{t(composition)} {t("composition")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.entries(COMPOSITIONS[composition])
                                .filter(([role]) => selectedRoles.includes(role))
                                .map(([role, heroNames]) => (
                                    heroNames.map((heroName) => {
                                        const hero = getHeroDetails(heroName);
                                        if (!hero) return null;
                                        return (
                                            <Card key={hero.key} className="flex flex-col items-center p-4">
                                                <Image
                                                    src={hero.portrait}
                                                    alt={hero.name}
                                                    width={100}
                                                    height={100}
                                                    objectFit="cover"
                                                    className="rounded-lg mb-4"
                                                />
                                                <p className="font-bold text-lg">{hero.name}</p>
                                                <p>{t(hero.role.charAt(0).toUpperCase() + hero.role.slice(1))}</p>
                                            </Card>
                                        );
                                    })
                                ))
                            }
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Composition;
