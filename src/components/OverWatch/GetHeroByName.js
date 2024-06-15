import React, { useState } from 'react';
import { Button, Card, Input, Spinner, Image, Text } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const GetHeroByName = () => {
    const { t } = useTranslation();
    const [heroName, setHeroName] = useState('');
    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHero = async (name) => {
        setLoading(true);
        setError(null);
        setHero(null);

        try {
            const response = await fetch(`https://overfast-api.tekrop.fr//heroes/${name.toLowerCase()}`);
            if (!response.ok) {
                throw new Error("Hero not found");
            }
            const data = await response.json();
            setHero(data);
        } catch (err) {
            setError(t("fetchError"));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchHero(heroName);
    };

    return (
        <div className="container mx-auto p-4">
            <p h1 className="text-2xl font-bold mb-4">{t("getHeroByName")}</p>
            <form onSubmit={handleSubmit} className="mb-4">
                <Input
                    placeholder={t("enterHeroName")}
                    fullWidth
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    className="mb-4"
                />
                <Button type="submit" color="primary" auto>
                    {t("fetchHero")}
                </Button>
            </form>

            {loading && (
                <div className="flex justify-center items-center mt-4">
                    <Spinner />
                </div>
            )}
            {error && <p color="error" className="text-red-500 text-center">{error}</p>}
            {hero && (
                <Card className="flex flex-col items-center p-4 mt-4">
                    <Image
                        src={hero.portrait}
                        alt={hero.name}
                        width={150}
                        height={150}
                        objectFit="cover"
                        className="rounded-lg mb-4"
                    />
                    <p h2 className="font-bold">{hero.name}</p>
                    <p className="mb-2">{hero.description}</p>
                    <p h4>{t("role")}: {hero.role.charAt(0).toUpperCase() + hero.role.slice(1)}</p>
                    <p h4>{t("location")}: {hero.location}</p>
                    <p h4>{t("birthday")}: {hero.birthday}</p>
                    <p h4>{t("age")}: {hero.age}</p>
                    <p h4>{t("health")}: {hero.hitpoints.health}</p>
                    <p h4>{t("armor")}: {hero.hitpoints.armor}</p>
                    <p h4>{t("shields")}: {hero.hitpoints.shields}</p>
                    <p h4>{t("totalHitpoints")}: {hero.hitpoints.total}</p>
                    <p h3 className="font-bold mt-4">{t("abilities")}</p>
                    {hero.abilities.map((ability) => (
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
                                    <p h4 className="font-semibold">{ability.name}</p>
                                    <p>{ability.description}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </Card>
            )}
        </div>
    );
};

export default GetHeroByName;
