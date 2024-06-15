// src/pages/News.js
import React, { useEffect, useState } from 'react';
import { Card, Spinner, Image } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const News = () => {
    const { t } = useTranslation();
    const [news, setNews] = useState({ br: [], stw: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch("https://fortnite-api.com/v2/news");
                const data = await response.json();

                if (data.status === 200) {
                    setNews({
                        br: data.data.br.motds || [],
                        stw: data.data.stw.messages || []
                    });
                } else {
                    setError(t('failedToFetchNewsData'));
                }
            } catch (err) {
                setError(t('fetchError'));
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [t]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('fortniteNews')}</h1>

            {loading ? (
                <div className="flex justify-center items-center mt-4">
                    <Spinner />
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-4">{t('battleRoyaleNews')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {news.br.map((item) => (
                            <Card key={item.id} className="flex flex-col items-center p-4">
                                <p className="font-bold text-lg">{item.title}</p>
                                <p>{item.body}</p>
                                {item.image && (
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            objectFit: "cover",
                                            marginBottom: "16px",
                                        }}
                                    />
                                )}
                            </Card>
                        ))}
                    </div>

                    <h2 className="text-xl font-bold mb-4">{t('saveTheWorldNews')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.stw.map((item, index) => (
                            <Card key={index} className="flex flex-col items-center p-4">
                                <p className="font-bold text-lg">{item.title}</p>
                                <p>{item.body}</p>
                                {item.image && (
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            objectFit: "cover",
                                            marginBottom: "16px",
                                        }}
                                    />
                                )}
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default News;
