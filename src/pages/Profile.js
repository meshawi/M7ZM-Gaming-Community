import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import MyVideos from "../components/Profile/MyVideos";
import MyImages from "../components/Profile/MyImages";
import EditProfile from "../components/Profile/EditProfile";
import Uploads from "../components/Profile/Uploads";
import SettingsPage from "../components/Profile/Settings";
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('my_profile')}</h1>
      <Tabs placement="start">
        <Tab title={t('edit_profile')}>
          <EditProfile />
        </Tab>
        <Tab title={t('my_videos')}>
          <MyVideos />
        </Tab>
        <Tab title={t('my_images')}>
          <MyImages />
        </Tab>
        <Tab title={t('uploads')}>
          <Uploads />
        </Tab>
        <Tab title={t('settings')}>
          <SettingsPage />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Profile;
