import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Image, Avatar, Tooltip, Button, Divider } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.reason || t('default_not_found_message');

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="py-4 max-w-md mx-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <div className="flex items-center gap-4">
            <Avatar isBordered color="danger" src="/images/logo.png" />
            <div>
              <p className="text uppercase font-bold">{t('apology_page')}</p>
              <small className="text-default-500"> {t('error')}</small>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-visible py-2 flex flex-col items-center">
          <Image
            alt={t('not_found_image_alt')}
            className="object-cover rounded-xl mb-4"
            src="/images/error.png"
            width={270}
          />
          <Divider className="my-4" />
          <p className="text-lg text-center text mb-6">
            {message}
          </p>
          <Tooltip color="warning" content={t('tooltip_homepage')} delay={1000}>
            <Button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleGoHome}
            >
              {t('go_to_homepage')}
            </Button>
          </Tooltip>
        </CardBody>
      </Card>
    </div>
  );
};

export default NotFound;
