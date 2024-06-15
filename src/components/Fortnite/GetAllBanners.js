// src/pages/GetAllBanners.js
import React, { useEffect, useState } from 'react';
import { Card, Spinner, Input } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const GetAllBanners = () => {
    const { t } = useTranslation();
    const [banners, setBanners] = useState([]);
    const [filteredBanners, setFilteredBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch("https://fortnite-api.com/v1/banners");
                const data = await response.json();

                if (data.status === 200) {
                    setBanners(data.data);
                    setFilteredBanners(data.data);
                } else {
                    setError(t('failedToFetchBanners'));
                }
            } catch (err) {
                setError(t('fetchError'));
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, [t]);

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        if (term === '') {
            setFilteredBanners(banners);
        } else {
            const filtered = banners.filter((banner) =>
                banner.name.toLowerCase().includes(term) ||
                banner.devName.toLowerCase().includes(term)
            );
            setFilteredBanners(filtered);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('getAllBanners')}</h1>

            <div className="mb-4">
                <Input
                    placeholder={t('searchByName')}
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mb-4"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center mt-4">
                    <Spinner />
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBanners.map((banner) => (
                        <Card key={banner.id} className="flex flex-col items-center p-4">
                            <img
                                src={banner.images.icon}
                                alt={banner.name}
                                style={{ width: '150px', height: '150px', objectFit: 'cover', marginBottom: '16px' }}
                            />
                            <p className="font-bold text-lg">{banner.name}</p>
                            <p>{banner.description}</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GetAllBanners;
