import React, { useEffect, useState } from 'react';
import { Card, Spinner, Checkbox, Badge, Button } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const GetWorkshopCodes = () => {
    const { t } = useTranslation();
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tags, setTags] = useState([]);
    const [copiedCodes, setCopiedCodes] = useState({});

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("https://api.aleshawi.me/api/workshop-games", {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer 2|FGsWttTyB9YNk3XqhWrFrDV4rLLqkyqlh9vt3M0d3da3a308"
                    }
                });

                const data = await response.json();

                if (data.status) {
                    setGames(data.data.games);
                    setFilteredGames(data.data.games);
                    const uniqueTags = new Set();
                    data.data.games.forEach(game => {
                        game.tags.forEach(tag => uniqueTags.add(tag));
                    });
                    setTags([...uniqueTags]);
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

    const handleTagChange = (tag, checked) => {
        const updatedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter(t => t !== tag);
        setSelectedTags(updatedTags);
        applyFilters(updatedTags);
    };

    const applyFilters = (tags) => {
        if (tags.length === 0) {
            setFilteredGames(games);
        } else {
            const filtered = games.filter(game => 
                tags.some(tag => game.tags.includes(tag))
            );
            setFilteredGames(filtered);
        }
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCodes(prev => ({ ...prev, [code]: true }));
        setTimeout(() => {
            setCopiedCodes(prev => ({ ...prev, [code]: false }));
        }, 2000); // Reset after 2 seconds
    };

    return (
        <div className="container mx-auto p-4">
            <p className="text-2xl font-bold mb-4">{t("getWorkshopCodes")}</p>

            {loading ? (
                <div className="flex justify-center items-center mt-4">
                    <Spinner />
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <>
                    <div className="mb-4">
                        <p>{t("filterByTags")}:</p>
                        <div className="flex gap-4 flex-wrap">
                            {tags.map((tag) => (
                                <Checkbox
                                    key={tag}
                                    color="primary"
                                    onChange={(e) => handleTagChange(tag, e.target.checked)}
                                >
                                    {tag}
                                </Checkbox>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGames.map((game) => (
                            <Card key={game.id} className="flex flex-col items-center p-4">
                                <p className="font-bold text-lg">{game.title}</p>
                                <p>{game.description}</p>
                                <p className="font-bold mt-2">{t("workshopCode")}: {game.workshop_code}</p>
                                <Button 
                                    color={copiedCodes[game.workshop_code] ? "success" : "primary"} 
                                    variant="light"
                                    onPress={() => handleCopyCode(game.workshop_code)}
                                >
                                    {copiedCodes[game.workshop_code] ? t("copied") : t("copyCode")}
                                </Button>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {game.tags.map((tag, index) => (
                                        <Badge key={index} variant="flat" color="primary">{tag}</Badge>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default GetWorkshopCodes;
