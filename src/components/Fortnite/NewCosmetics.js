// src/pages/NewCosmetics.js
import React, { useEffect, useState } from 'react';
import { Card, Spinner, Image, Pagination } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const NewCosmetics = () => {
    const { t } = useTranslation();
    const [newCosmetics, setNewCosmetics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchNewCosmetics = async () => {
            try {
                const response = await fetch("https://fortnite-api.com/v2/cosmetics/br/new");
                const data = await response.json();

                if (data.status === 200) {
                    setNewCosmetics(data.data.items);
                } else {
                    setError(t('failedToFetchNewCosmetics'));
                }
            } catch (err) {
                setError(t('fetchError'));
            } finally {
                setLoading(false);
            }
        };

        fetchNewCosmetics();
    }, [t]);

    // Get current cosmetics
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNewCosmetics = newCosmetics.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('newFortniteCosmetics')}</h1>

            {loading ? (
                <div className="flex justify-center items-center mt-4">
                    <Spinner />
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentNewCosmetics.map((item) => (
                            <Card key={item.id} className="flex flex-col items-center p-4">
                                <Image
                                    src={item.images.icon}
                                    alt={item.name}
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        objectFit: "cover",
                                        marginBottom: "16px",
                                    }}
                                />
                                <p className="font-bold text-lg">{item.name}</p>
                                <p>{item.description}</p>
                                <p className="font-bold mt-2">{t('type')}: {item.type.displayValue}</p>
                                <p>{t('rarity')}: {item.rarity.displayValue}</p>
                                {item.series && (
                                    <p>{t('series')}: {item.series.value}</p>
                                )}
                                <p>{t('set')}: {item.set ? item.set.value : t('na')}</p>
                                <p>{t('introduced')}: {item.introduction.text}</p>
                                {item.variants && (
                                    <div className="mt-2">
                                        <p className="font-bold">{t('variants')}:</p>
                                        {item.variants.map((variant) => (
                                            <div key={variant.channel}>
                                                {variant.options.map((option) => (
                                                    <div key={option.tag} className="flex items-center gap-2">
                                                        <Image
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
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        <Pagination
                            total={Math.ceil(newCosmetics.length / itemsPerPage)}
                            initialPage={1}
                            page={currentPage}
                            onChange={(page) => handlePageChange(page)}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default NewCosmetics;
