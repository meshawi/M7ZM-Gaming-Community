// src/pages/CreatorCode.js
import React, { useState } from 'react';
import { Card, Spinner, Input, Button } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const CreatorCode = () => {
    const { t } = useTranslation();
    const [creatorName, setCreatorName] = useState('');
    const [creatorCode, setCreatorCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setCreatorName(e.target.value);
    };

    const fetchCreatorCode = async () => {
        if (!creatorName) return;

        setLoading(true);
        setError(null);
        setCreatorCode(null);

        try {
            const response = await fetch(`https://fortnite-api.com/v2/creatorcode/?name=${creatorName}`);
            const data = await response.json();

            if (data.status === 200) {
                setCreatorCode(data.data);
            } else {
                setError(t('failedToFetchCreatorCodeData'));
            }
        } catch (err) {
            setError(t('fetchError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('creatorCode')}</h1>
            
            <div className="flex items-center gap-4 mb-4">
                <Input 
                    placeholder={t('enterCreatorName')}
                    value={creatorName}
                    onChange={handleInputChange}
                    fullWidth
                />
                <Button onPress={fetchCreatorCode} color="primary">{t('fetch')}</Button>
            </div>

            {loading && (
                <div className="flex justify-center items-center mt-4">
                    <Spinner />
                </div>
            )}

            {error && (
                <p className="text-red-500 text-center">{error}</p>
            )}

            {creatorCode && (
                <Card className="flex flex-col items-center p-4">
                    <p className="font-bold text-lg">{t('creatorName')}: {creatorCode.account.name}</p>
                    <p>{t('creatorCode')}: {creatorCode.code}</p>
                    <p>{t('status')}: {creatorCode.status}</p>
                    <p>{t('verified')}: {creatorCode.verified ? t('yes') : t('no')}</p>
                </Card>
            )}
        </div>
    );
};

export default CreatorCode;
