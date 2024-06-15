// src/pages/SaudiDealInstructions.js
import React, { useEffect, useState } from "react";
import { Tabs, Tab, Card, Spinner } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const SaudiDealInstructions = () => {
  const { t } = useTranslation();
  const [instructions, setInstructions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch(
          "https://api.aleshawi.me/api/sd-instructions",
          {
            headers: {
              Authorization:
                "Bearer 2|FGsWttTyB9YNk3XqhWrFrDV4rLLqkyqlh9vt3M0d3da3a308",
            },
          }
        );
        const data = await response.json();
        setInstructions(data.data.GameInstructions[0]);
      } catch (err) {
        setError(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [t]);

  const renderContent = (content) => {
    if (typeof content === "string") {
      return <p>{content}</p>;
    }
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <div key={index}>{renderContent(item)}</div>
      ));
    }
    if (typeof content === "object") {
      return Object.entries(content).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {renderContent(value)}
        </div>
      ));
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-4">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('saudiDealInstructions')}</h1>
      {instructions && (
        <Tabs>
          {Object.keys(instructions).map((section) => (
            <Tab key={section} title={t(section)}>
              {instructions[section].map((item, index) => (
                <Card key={index} className="my-4">
                  <div className="p-4">{renderContent(item)}</div>
                </Card>
              ))}
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default SaudiDealInstructions;
