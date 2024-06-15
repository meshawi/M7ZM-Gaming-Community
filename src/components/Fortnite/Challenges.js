// src/pages/Challenges.js
import React, { useEffect, useState } from 'react';
import { Card, Spinner, Accordion, AccordionItem } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

const Challenges = () => {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://fortniteapi.io/v3/challenges', {
          headers: {
            // use your own API key from .env file FORTNITE_API_KEY
            Authorization: process.env.FORTNITE_API_KEY,
          },
        });
        const data = await response.json();
        if (data.result) {
          setChallenges(data.bundles);
        } else {
          setError(t('failedToFetchChallenges'));
        }
      } catch (err) {
        setError(t('fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [t]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('challenges')}</h1>
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((bundle) => (
            <Card key={bundle.tag} className="p-4">
              <img
                src={bundle.image}
                alt={bundle.name}
                className="w-full h-30 object-cover mb-4"
              />
              <h2 className="font-bold text-lg">{bundle.name}</h2>
              <Accordion>
                {bundle.bundles.map((subBundle) => (
                  <AccordionItem title={subBundle.name} key={subBundle.id}>
                    {subBundle.quests.map((quest) => (
                      <div key={quest.id} className="mb-4">
                        <p className="font-medium">{quest.name}</p>
                        <p className="text-sm">{quest.shortDescription}</p>
                        {quest.reward.items.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold">{t('reward')}:</p>
                            {quest.reward.items.map((item) => (
                              <div key={item.id} className="flex items-center">
                                <img
                                  src={item.images.icon}
                                  alt={item.name}
                                  className="w-10 h-10 object-cover mr-2"
                                />
                                <p>{item.name}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Challenges;
