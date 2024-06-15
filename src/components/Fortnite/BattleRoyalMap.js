// src/pages/BattleRoyalMap.js
import React, { useEffect, useState } from 'react';
import { Card, Spinner, Image } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const BattleRoyalMap = () => {
    const { t } = useTranslation();
    const [mapData, setMapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const response = await fetch("https://fortnite-api.com/v1/map");
                const data = await response.json();

                if (data.status === 200) {
                    setMapData(data.data);
                } else {
                    setError(t('failedToFetchMapData'));
                }
            } catch (err) {
                setError(t('fetchError'));
            } finally {
                setLoading(false);
            }
        };

        fetchMapData();
    }, [t]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('battleRoyaleMap')}</h1>

            {loading ? (
                <div className="flex justify-center items-center mt-4">
                    <Spinner />
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div>
                    {mapData && (
                        <>
                            <div className="flex justify-center mb-6">
                                <Image
                                    src={mapData.images.pois}
                                    alt={t('battleRoyaleMap')}
                                    width={800}
                                    height={800}
                                    objectFit="cover"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {mapData.pois.map((poi) => (
                                    <Card key={poi.id} className="flex flex-col items-center p-4">
                                        <p className="font-bold text-lg">{poi.name}</p>
                                        <p>{t('location')}:</p>
                                        <p>X: {poi.location.x}</p>
                                        <p>Y: {poi.location.y}</p>
                                        <p>Z: {poi.location.z}</p>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BattleRoyalMap;
