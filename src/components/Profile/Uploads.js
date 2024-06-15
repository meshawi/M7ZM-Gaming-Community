import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import UploadVideo from "../Uploads/UploadVideo";
import UploadImage from "../Uploads/UploadImage";
import { useTranslation } from 'react-i18next';

const Uploads = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-8 shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold text-center mb-6">
        {t('uploads_page')}
      </h1>
      <div className="p-6 rounded-lg shadow-inner">
        <Tabs placement="top" className="w-full flex justify-center mb-4">
          <Tab title={t('upload_video')} className="text-lg font-semibold">
            <div className="p-4">
              <UploadVideo />
            </div>
          </Tab>
          <Tab title={t('upload_image')} className="text-lg font-semibold">
            <div className="p-4">
              <UploadImage />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Uploads;
