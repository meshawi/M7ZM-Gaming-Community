import React, { useEffect, useState } from 'react';
import { Card, Spinner, Image } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const GetUtillData = () => {
    const { t } = useTranslation();
    const [roles, setRoles] = useState([]);
    const [gamemodes, setGamemodes] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [loadingGamemodes, setLoadingGamemodes] = useState(true);
    const [errorRoles, setErrorRoles] = useState(null);
    const [errorGamemodes, setErrorGamemodes] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch("https://overfast-api.tekrop.fr/roles");
                const data = await response.json();

                setRoles(data);
            } catch (err) {
                setErrorRoles(t("fetchRolesError"));
            } finally {
                setLoadingRoles(false);
            }
        };

        const fetchGamemodes = async () => {
            try {
                const response = await fetch("https://overfast-api.tekrop.fr/gamemodes");
                const data = await response.json();

                setGamemodes(data);
            } catch (err) {
                setErrorGamemodes(t("fetchGamemodesError"));
            } finally {
                setLoadingGamemodes(false);
            }
        };

        fetchRoles();
        fetchGamemodes();
    }, [t]);

    return (
        <div className="container mx-auto p-4">
            <p className="text-2xl font-bold mb-4">{t("getUtilData")}</p>

            <div className="mb-8">
                <p className="text-xl font-bold mb-4">{t("roles")}</p>
                {loadingRoles ? (
                    <div className="flex justify-center items-center mt-4">
                        <Spinner />
                    </div>
                ) : errorRoles ? (
                    <p className="text-red-500 text-center">{errorRoles}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roles.map((role) => (
                            <Card key={role.key} className="flex flex-col items-center p-4">
                                <Image 
                                    src={role.icon} 
                                    alt={role.name} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginBottom: '16px' }}
                                />
                                <p className="font-bold text-lg">{role.name}</p>
                                <p>{role.description}</p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <p className="text-xl font-bold mb-4">{t("gameModes")}</p>
                {loadingGamemodes ? (
                    <div className="flex justify-center items-center mt-4">
                        <Spinner />
                    </div>
                ) : errorGamemodes ? (
                    <p className="text-red-500 text-center">{errorGamemodes}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gamemodes.map((gamemode) => (
                            <Card key={gamemode.key} className="flex flex-col items-center p-4">
                                <Image 
                                    src={gamemode.icon} 
                                    alt={gamemode.name} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginBottom: '16px' }}
                                />
                                <p className="font-bold p-lg">{gamemode.name}</p>
                                <p>{gamemode.description}</p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GetUtillData;
