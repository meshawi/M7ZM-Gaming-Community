import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table, Spinner } from "@nextui-org/react";
import { TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

const GetRanked1v1Data = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://brawlhalla.fly.dev/v1/utils/ranked1v1?region=eu&page=1`
      );
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(t('fetchError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-4">{t('getRanked1v1Data')}</h1>
      </div>
      <Button
        shadow
        color="primary"
        auto
        onPress={fetchData}
        disabled={loading}
        className="mb-4"
      >
        {t('fetchData')}
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
        <Table
          aria-label={t('ranked1v1DataTable')}
          css={{
            height: "auto",
            minWidth: "100%",
          }}
        >
          <TableHeader>
            <TableColumn>{t('rank')}</TableColumn>
            <TableColumn>{t('name')}</TableColumn>
            <TableColumn>{t('rating')}</TableColumn>
            <TableColumn>{t('games')}</TableColumn>
            <TableColumn>{t('wins')}</TableColumn>
            <TableColumn>{t('region')}</TableColumn>
          </TableHeader>
          <TableBody>
            {data.map((player) => (
              <TableRow key={player.brawlhalla_id}>
                <TableCell>{player.rank}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.rating}</TableCell>
                <TableCell>{player.games}</TableCell>
                <TableCell>{player.wins}</TableCell>
                <TableCell>{player.region}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default GetRanked1v1Data;
