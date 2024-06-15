import React from 'react';
import { Tabs, Tab } from "@nextui-org/react";
import ExploreVideos from '../components/Explore/ExploreVideos';
import ExploreImages from '../components/Explore/ExploreImages';
import { useTranslation } from 'react-i18next';

const Explore = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('explore_page')}</h1>
            <Tabs placement="start">
                <Tab title={t('explore_videos')}>
                    <ExploreVideos />
                </Tab>
                <Tab title={t('explore_images')}>
                    <ExploreImages />
                </Tab>
            </Tabs>
        </div>
    );
}

export default Explore;
