// src/pages/CosmeticsByID.js
import React, { useState } from 'react';
import { Card, Spinner, Input, Button } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const CosmeticsByID = () => {
    const { t } = useTranslation();
    const [cosmeticID, setCosmeticID] = useState('');
    const [cosmetic, setCosmetic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setCosmeticID(e.target.value);
    };

    const fetchCosmeticByID = async () => {
        if (!cosmeticID) return;

        setLoading(true);
        setError(null);
        setCosmetic(null);

        try {
            const response = await fetch(`https://fortnite-api.com/v2/cosmetics/br/${cosmeticID}`);
            const data = await response.json();

            if (data.status === 200) {
                setCosmetic(data.data);
            } else {
                setError(t('failedToFetchCosmeticData'));
            }
        } catch (err) {
            setError(t('fetchError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('cosmeticsByID')}</h1>
            
            <div className="flex items-center gap-4 mb-4">
                <Input 
                    placeholder={t('enterCosmeticID')}
                    value={cosmeticID}
                    onChange={handleInputChange}
                    fullWidth
                />
                <Button onPress={fetchCosmeticByID} color="primary">{t('fetch')}</Button>
            </div>

            {loading && (
                <div className="flex justify-center items-center mt-4">
                    <Spinner />
                </div>
            )}

            {error && (
                <p className="text-red-500 text-center">{error}</p>
            )}

            {cosmetic && (
                <Card className="flex flex-col items-center p-4">
                    <img
                        src={cosmetic.images.icon}
                        alt={cosmetic.name}
                        style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            marginBottom: "16px",
                        }}
                    />
                    <p className="font-bold text-lg">{cosmetic.name}</p>
                    <p>{cosmetic.description}</p>
                    <p className="font-bold mt-2">{t('type')}: {cosmetic.type.displayValue}</p>
                    <p>{t('rarity')}: {cosmetic.rarity.displayValue}</p>
                    {cosmetic.series && (
                        <p>{t('series')}: {cosmetic.series.value}</p>
                    )}
                    <p>{t('set')}: {cosmetic.set ? cosmetic.set.value : t('nA')}</p>
                    <p>{t('introduced')}: {cosmetic.introduction.text}</p>
                    {cosmetic.variants && (
                        <div className="mt-2">
                            <p className="font-bold">{t('variants')}:</p>
                            {cosmetic.variants.map((variant) => (
                                <div key={variant.channel}>
                                    {variant.options.map((option) => (
                                        <div key={option.tag} className="flex items-center gap-2">
                                            <img
                                                src={option.image}
                                                alt={option.name}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <p>{option.name}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default CosmeticsByID;
