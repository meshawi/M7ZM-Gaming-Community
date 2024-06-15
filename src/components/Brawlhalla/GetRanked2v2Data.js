import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table, Spinner } from "@nextui-org/react";
import { TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

const GetRanked2v2Data = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://brawlhalla.fly.dev/v1/utils/ranked2v2?region=eu&page=1`
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
        <h1 className="text-2xl font-bold mb-4">{t('getRanked2v2Data')}</h1>
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
          aria-label={t('ranked2v2DataTable')}
          css={{
            height: "auto",
            minWidth: "100%"
          }}
        >
          <TableHeader>
            <TableColumn>{t('rank')}</TableColumn>
            <TableColumn>{t('teamName')}</TableColumn>
            <TableColumn>{t('rating')}</TableColumn>
            <TableColumn>{t('games')}</TableColumn>
            <TableColumn>{t('wins')}</TableColumn>
            <TableColumn>{t('region')}</TableColumn>
          </TableHeader>
          <TableBody>
            {data.map((team) => (
              <TableRow key={team.teamname}>
                <TableCell>{team.rank}</TableCell>
                <TableCell>{team.teamname}</TableCell>
                <TableCell>{team.rating}</TableCell>
                <TableCell>{team.games}</TableCell>
                <TableCell>{team.wins}</TableCell>
                <TableCell>{team.region}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default GetRanked2v2Data;
