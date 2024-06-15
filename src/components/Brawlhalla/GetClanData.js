import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Input,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const GetClanData = () => {
  const { t } = useTranslation();
  const [clanId, setClanId] = useState("960634"); // Initial value
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://brawlhalla.fly.dev/v1/utils/clan?clan_id=${clanId}`
      );
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setClanId(e.target.value);
    setError(null); // Clear error when user starts typing
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-4">{t('getClanData')}</h1>
      </div>
      <Input
        label={t('clanID')}
        bordered
        fullWidth
        color="primary"
        size="lg"
        value={clanId}
        clearable
        placeholder={t('enterClanID')}
        onChange={handleInputChange}
        type="number"
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
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">{t('clan')}: {data.clan_name}</h2>
            <p>{t('clanXP')}: {data.clan_xp}</p>
            <p>{t('creationDate')}: {new Date(data.clan_create_date * 1000).toLocaleDateString()}</p>
          </div>
          <Table
            aria-label={t('clanMembersTable')}
            css={{
              height: "auto",
              minWidth: "100%",
            }}
          >
            <TableHeader>
              <TableColumn>{t('name')}</TableColumn>
              <TableColumn>{t('rank')}</TableColumn>
              <TableColumn>{t('joinDate')}</TableColumn>
              <TableColumn>{t('xp')}</TableColumn>
            </TableHeader>
            <TableBody>
              {data.clan.map((member) => (
                <TableRow key={member.brawlhalla_id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.rank}</TableCell>
                  <TableCell>{new Date(member.join_date * 1000).toLocaleDateString()}</TableCell>
                  <TableCell>{member.xp}</TableCell>
                </TableRow>
              ))} 
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default GetClanData;
