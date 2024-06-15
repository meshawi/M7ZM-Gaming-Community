// src/pages/ActiveEvents.js
import React, { useEffect, useState } from 'react';
import { Card, Spinner } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

const ActiveEvents = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://fortniteapi.io/v1/events/list/active', {
          headers: {
            // use your own API key from .env file FORTNITE_API_KEY
            Authorization: process.env.FORTNITE_API_KEY,
                    },
        });
        const data = await response.json();
        if (data.result) {
          setEvents(data.events);
        } else {
          setError(t('failedToFetchEvents'));
        }
      } catch (err) {
        setError(t('fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [t]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('activeEvents')}</h1>
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="p-4">
              <img
                src={event.tileImage}
                alt={event.name_line1}
                className="w-full h-40 object-cover mb-4"
              />
              <h2 className="font-bold text-lg">{event.name_line1}</h2>
              <p>{event.name_line2}</p>
              <p className="mt-2">
                <strong>{t('region')}:</strong> {event.region}
              </p>
              <p className="mt-2">
                <strong>{t('startTime')}:</strong>{' '}
                {new Date(event.beginTime).toLocaleString()}
              </p>
              <p className="mt-2">
                <strong>{t('endTime')}:</strong>{' '}
                {new Date(event.endTime).toLocaleString()}
              </p>
              <p className="mt-2">
                <strong>{t('description')}:</strong> {event.short_description}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveEvents;
