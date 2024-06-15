// src/pages/Shop.js
import React, { useEffect, useState } from 'react';
import { Card, Spinner, Button } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

const Shop = () => {
  const { t } = useTranslation();
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchShopItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://fortniteapi.io/v2/shop', {
          headers: {
            // use your own API key from .env file FORTNITE_API_KEY
            Authorization: process.env.FORTNITE_API_KEY,
                    },
        });
        const data = await response.json();
        if (data.result) {
          setShopItems(data.shop);
        } else {
          setError(t('failedToFetchShopItems'));
        }
      } catch (err) {
        setError(t('fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchShopItems();
  }, [t]);

  const totalPages = Math.ceil(shopItems.length / itemsPerPage);
  const currentItems = shopItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('shop')}</h1>
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <Card key={item.mainId} className="p-4">
                <img
                  src={item.displayAssets[0].url}
                  alt={item.displayName}
                  className="w-full h-40 object-cover mb-4"
                />
                <h2 className="font-bold text-lg">{item.displayName}</h2>
                <p>{item.displayDescription}</p>
                <p className="mt-2">
                  <strong>{t('price')}:</strong> {item.price.finalPrice} V-Bucks
                </p>
                <p className="mt-2">
                  <strong>{t('rarity')}:</strong> {item.rarity.name}
                </p>
                {item.offerDates && (
                  <>
                    <p className="mt-2">
                      <strong>{t('availableFrom')}:</strong>{' '}
                      {new Date(item.offerDates.in).toLocaleString()}
                    </p>
                    <p className="mt-2">
                      <strong>{t('availableUntil')}:</strong>{' '}
                      {new Date(item.offerDates.out).toLocaleString()}
                    </p>
                  </>
                )}
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button disabled={currentPage === 1} onPress={handlePrevPage}>
              {t('previous')}
            </Button>
            <span>
              {t('page')} {currentPage} {t('of')} {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onPress={handleNextPage}
            >
              {t('next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
