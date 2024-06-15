import React, { useState } from "react";
import { Button, Card, Input, Spinner } from "@nextui-org/react";
import { CardHeader, CardBody, CardFooter, Divider, Text } from "@nextui-org/react";

const GetLegendByName = () => {
  const [legendName, setLegendName] = useState("cassidy"); // Initial value
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://brawlhalla.fly.dev/v1/legends/name?legend_name=${legendName}`
      );
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

  const handleInputChange = (e) => {
    setLegendName(e.target.value);
    setError(null); // Clear error when user starts typing
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-4">Get Legend By Name</h1>
      </div>
      <Input
        label="Legend Name"
        bordered
        fullWidth
        color="primary"
        size="lg"
        value={legendName}
        clearable
        placeholder="Enter Legend Name"
        onChange={handleInputChange}
        type="text"
        className="w-full max-w-md mb-4"
        isInvalid={!!error}
        errorMessage={error}
      />
      <Button
        shadow
        color="primary"
        auto
        onPress={fetchData}
        disabled={loading}
        className="mb-4"
      >
        Fetch Data
      </Button>

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
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="p-md font-semibold">Name: {data.bio_name}</p>
              <p className="p-md">AKA: {data.bio_aka}</p>
              <p className="p-md">Weapon One: {data.weapon_one}</p>
              <p className="p-md">Weapon Two: {data.weapon_two}</p>
              <p className="p-md">Strength: {data.strength}</p>
              <p className="p-md">Dexterity: {data.dexterity}</p>
              <p className="p-md">Defense: {data.defense}</p>
              <p className="p-md">Speed: {data.speed}</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="p-md font-semibold">Bio Quote:</p>
            <p>{data.bio_quote}</p>
            <p className="p-md font-semibold">Bio:</p>
            <p>{data.bio_text}</p>
            <img src={data.thumbnail} alt={data.bio_name} className="mt-4" />
          </CardBody>
          <Divider />
          <CardFooter>
            <p>Bot Name: {data.bot_name}</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default GetLegendByName;
