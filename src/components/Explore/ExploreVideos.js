import React, { useEffect, useState } from "react";
import { Input, Spinner, Card, CardHeader, CardBody, Image, Avatar, Chip, CheckboxGroup, Checkbox, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const fetchVideosFromAPI = async () => {
  try {
    const response = await fetch("https://api.aleshawi.me/api/all-public-videos");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return { status: false };
  }
};

const ExploreVideos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ tags: [] });
  const [availableTags, setAvailableTags] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await fetchVideosFromAPI();
        if (data.status) {
          setVideos(data.data);
          setFilteredVideos(data.data);
          extractTags(data.data);
        } else {
          setError(t('fetch_failed'));
        }
      } catch (err) {
        setError(t('fetch_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [t]);

  const extractTags = (videos) => {
    const tags = new Set();
    videos.forEach((video) => {
      video.tags.forEach((tag) => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));
  };

  const applyFilters = (tags) => {
    let filtered = videos;
    if (tags.length > 0) {
      filtered = filtered.filter((video) =>
        video.tags.some((tag) => tags.includes(tag))
      );
    }
    setFilteredVideos(filtered);
  };

  useEffect(() => {
    applyFilters(filter.tags);
  }, [filter, videos]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('explore_videos')}</h1>

      <div className="mb-4">
        <CheckboxGroup
          label={t('filter_by_tags')}
          orientation="horizontal"
          color="secondary"
          onChange={(values) => setFilter({ ...filter, tags: values })}
        >
          {availableTags.map((tag) => (
            <Checkbox key={tag} value={tag}>{tag}</Checkbox>
          ))}
        </CheckboxGroup>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.video_id} className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <div className="flex items-center gap-2">
                  <Avatar isBordered src={video.profile_picture} />
                  <div>
                    <h4 className="font-bold text-large">{video.username}</h4>
                    <p className="text-tiny">{new Date(video.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <h4 className="font-bold text-large mt-2">{video.title}</h4>
                <small className="text-default-500">{video.description}</small>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  alt={t('video_thumbnail')}
                  className="object-cover rounded-xl"
                  src={video.thumbnail_path}
                  width={270}
                />
                <div className="flex gap-2 mt-2">
                  {video.tags.map((tag, index) => (
                    <Chip key={index} color="primary">
                      {tag}
                    </Chip>
                  ))}
                </div>
                <Button
                  color="primary"
                  variant="bordered"
                  className="mt-4"
                  onClick={() => navigate(`/watchvideo/${video.video_id}`)}
                >
                  {t('watch_video')}
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreVideos;
