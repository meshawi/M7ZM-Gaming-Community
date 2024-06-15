import React from "react";
import { useSelector } from "react-redux";
import { Tabs, Tab } from "@nextui-org/react";
import AdminUsersTable from "../components/Administration/AdminUsersTable";
import AdminVideosTable from "../components/Administration/AdminVideosTable";
import AdminImagesTable from "../components/Administration/AdminImagesTable";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const authorizationLevel = useSelector((state) => state.auth.authorizationLevel);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('admin_panel')}</h1>
      <Tabs
        placement="start"
        disabledKeys={authorizationLevel === 'Moderator' ? ["AdminUsersTable"] : []}
        aria-label={t('admin_options')}
      >
        <Tab key="AdminUsersTable" title={t('manage_users')}>
          <AdminUsersTable />
        </Tab>
        <Tab key="AdminVideosTable" title={t('manage_videos')}>
          <AdminVideosTable />
        </Tab>
        <Tab key="AdminImagesTable" title={t('manage_images')}>
          <AdminImagesTable />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
