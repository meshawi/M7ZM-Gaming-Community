import React, { useState, useEffect } from "react";
import {
CardBody,
  Card,
  Spinner,
  Accordion,
  AccordionItem,
  Pagination,
} from "@nextui-org/react";

const GetAllLegends = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://brawlhalla.fly.dev/v1/legends/all");
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentData = data
    ? data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-4">All Legends</h1>
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center mt-4 text-red-500">
          {error}
        </div>
      )}

      {data && (
        <Card className="w-full max-w-md mt-4">
          <CardBody>
            <p className="p-md font-semibold">Legends:</p>
            <Accordion variant="shadow">
              {currentData.map((legend, index) => (
                <AccordionItem
                  key={index}
                  aria-label={`Legend ${legend.legend_name_key}`}
                  title={`Legend: ${legend.bio_name}`}
                >
                  <p>AKA: {legend.bio_aka}</p>
                  <p>Weapon One: {legend.weapon_one}</p>
                  <p>Weapon Two: {legend.weapon_two}</p>
                  <p>Strength: {legend.strength}</p>
                  <p>Dexterity: {legend.dexterity}</p>
                  <p>Defense: {legend.defense}</p>
                  <p>Speed: {legend.speed}</p>
                  <p>Quote: {legend.bio_quote}</p>
                  <p>Bio: {legend.bio_text}</p>
                  <img src={legend.thumbnail} alt={legend.bio_name} />
                </AccordionItem>
              ))}
            </Accordion>
            <Pagination
              total={Math.ceil(data.length / itemsPerPage)}
              initialPage={1}
              page={currentPage}
              onChange={handlePageChange}
              className="mt-4"
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default GetAllLegends;
