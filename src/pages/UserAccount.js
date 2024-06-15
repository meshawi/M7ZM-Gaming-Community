import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Chip,
  Progress,
  Tabs,
  Tab,
  Image,
  Skeleton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { GalleryIcon } from "../components/icons/GalleryIcon";
import { VideoIcon } from "../components/icons/VideoIcon";
import { HeartIcon } from "../components/icons/HeartIcon";
import { LockIcon } from "../components/icons/LockIcon";
import { CopyDocumentIcon } from "../components/icons/CopyDocumentIcon";
import { useNavigate, useParams } from "react-router-dom";

const UserAccountPage = ({ mode = "view-profile", username: propUsername }) => {
  const { t } = useTranslation();
  const { username: paramUsername } = useParams();
  const username = propUsername || paramUsername;
  const [userData, setUserData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [archived, setArchived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, videoRes, photoRes, favoriteRes, archivedRes] =
          await Promise.all([
            fetch(`https://api.aleshawi.me/api/m7zm_user/${username}`),
            fetch(
              `https://api.aleshawi.me/api/user/${username}/videos/open-public`
            ),
            fetch(
              `https://api.aleshawi.me/api/user/${username}/images/open-public`
            ),
            fetch(`https://api.aleshawi.me/api/user/${username}/favorite-videos`),
            fetch(`https://api.aleshawi.me/api/user/${username}/archived-media`),
          ]);

        const userData = await userRes.json();
        const videoData = await videoRes.json();
        const photoData = await photoRes.json();
        const favoriteData = await favoriteRes.json();
        const archivedData = await archivedRes.json();

        setUserData(userData.data || {});
        setVideos(videoData.data || []);
        setPhotos(photoData.data || []);
        setFavorites(favoriteData.data || []);
        setArchived(archivedData.data || {});
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    if (
      mode === "view-profile" &&
      userData &&
      userData.profile_visibility === "private"
    ) {
      navigate("/not-found", {
        state: { reason: t("notFound_profilePrivate") },
      });
    }
  }, [mode, userData, navigate, t]);

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    onOpen();
  };

  const renderModalContent = () => {
    if (!selectedMedia) return null;

    return (
      <>
        <ModalHeader className="flex flex-col gap-1">
          {selectedMedia.title}
        </ModalHeader>
        <ModalBody>
          {selectedMedia.video_path ? (
            <video controls className="w-full h-full object-cover rounded-lg">
              <source src={selectedMedia.video_path} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              isZoomed
              width="100%"
              height="100%"
              alt={selectedMedia.title}
              src={selectedMedia.image_path}
              className="object-cover w-full h-full"
            />
          )}
          <p>{selectedMedia.description}</p>
          <div className="flex gap-2 mt-2">
            {selectedMedia.tags.map((tag, index) => (
              <Chip key={index} color="primary">
                {tag}
              </Chip>
            ))}
          </div>
          <p>Status: {selectedMedia.status}</p>
          <p>Visibility: {selectedMedia.visibility}</p>
          <p>
            Created At: {new Date(selectedMedia.created_at).toLocaleString()}
          </p>
          <p>
            Updated At: {new Date(selectedMedia.updated_at).toLocaleString()}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            {t('close')}
          </Button>
        </ModalFooter>
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-[600px] space-y-5 p-4" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
      </div>
    );
  }

  // Calculate profile completion percentage
  const profileFields = [
    "full_name",
    "bio",
    "profile_picture",
    "user_prefer_url",
    "accounts_ids",
    "favorite_games",
    "achieved_games",
  ];
  const completedFields = profileFields.filter((field) => {
    if (field === "accounts_ids") {
      return (
        userData.accounts_ids && Object.keys(userData.accounts_ids).length > 0
      );
    }
    return userData[field] && userData[field].length > 0;
  });
  const profileCompletionPercentage =
    (completedFields.length / profileFields.length) * 100;

  // Determine steps to complete profile
  const stepsToCompleteProfile = profileFields
    .filter((field) => {
      if (field === "accounts_ids") {
        return (
          !userData.accounts_ids ||
          Object.keys(userData.accounts_ids).length === 0
        );
      }
      return !userData[field] || userData[field].length === 0;
    })
    .map((field) => {
      switch (field) {
        case "full_name":
          return t('addFullName');
        case "bio":
          return t('writeBio');
        case "profile_picture":
          return t('addProfilePicture');
        case "user_prefer_url":
          return t('addSocialMediaLink');
        case "accounts_ids":
          return t('addAccountIDs');
        case "favorite_games":
          return t('addFavoriteGames');
        case "achieved_games":
          return t('addAchievedGames');
        default:
          return "";
      }
    });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const tabs = [
    {
      id: "videos",
      label: (
        <div className="flex items-center space-x-2">
          <VideoIcon />
          <span>{t('videos')}</span>
          <Chip size="sm" variant="faded">
            {videos.length}
          </Chip>
        </div>
      ),
      content: (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {videos.map((video, index) => (
            <Card
              key={index}
              className="w-full"
              onClick={() => handleMediaClick(video)}
            >
              <CardBody className="p-0">
                <video
                  controls
                  className="w-full h-full object-cover rounded-lg"
                >
                  <source src={video.video_path} type="video/mp4" />
                  {t('browserNotSupport')}
                </video>
              </CardBody>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: "photos",
      label: (
        <div className="flex items-center space-x-2">
          <GalleryIcon />
          <span>{t('photos')}</span>
          <Chip size="sm" variant="faded">
            {photos.length}
          </Chip>
        </div>
      ),
      content: (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {photos.map((photo, index) => (
            <Card
              key={index}
              className="w-full"
              onClick={() => handleMediaClick(photo)}
            >
              <CardBody className="p-0">
                <Image
                  isZoomed
                  width="100%"
                  height="100%"
                  alt={`Photo ${index}`}
                  src={photo.image_path}
                  className="object-cover w-full h-full"
                />
              </CardBody>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: "favorites",
      label: (
        <div className="flex items-center space-x-2">
          <HeartIcon />
          <span>{t('favorites')}</span>
        </div>
      ),
      content: (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {favorites.map((video, index) => (
            <Card
              key={index}
              className="w-full"
              onClick={() => handleMediaClick(video)}
            >
              <CardBody className="p-0">
                <video
                  controls
                  className="w-full h-full object-cover rounded-lg"
                >
                  <source src={video.video_path} type="video/mp4" />
                  {t('browserNotSupport')}
                </video>
              </CardBody>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: "archived",
      label: (
        <div className="flex items-center space-x-2">
          <LockIcon />
          <span>{t('archived')}</span>
        </div>
      ),
      content: (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {archived.videos?.map((video, index) => (
            <Card
              key={index}
              className="w-full"
              onClick={() => handleMediaClick(video)}
            >
              <CardBody className="p-0">
                <video
                  controls
                  className="w-full h-full object-cover rounded-lg"
                >
                  <source src={video.video_path} type="video/mp4" />
                  {t('browserNotSupport')}
                </video>
              </CardBody>
            </Card>
          ))}
          {archived.images?.map((photo, index) => (
            <Card
              key={index}
              className="w-full"
              onClick={() => handleMediaClick(photo)}
            >
              <CardBody className="p-0">
                <Image
                  isZoomed
                  width="100%"
                  height="100%"
                  alt={`Photo ${index}`}
                  src={photo.image_path}
                  className="object-cover w-full h-full"
                />
              </CardBody>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-5xl p-6 bg-primary-50 rounded-lg shadow-lg">
        <Card>
          <CardHeader className="flex flex-col items-center">
            <Avatar
              isBordered
              color="primary"
              src={userData.profile_picture}
              size="xl"
            />
            <p className="text-2xl font-bold mt-4">{userData.full_name}</p>
            <p className="text-sm text-gray-500">@{userData.username}</p>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="text-center mb-4">
              <p className="text-lg font-semibold">{t('bio')}</p>
              <p>{userData.bio || t('noBioAvailable')}</p>
            </div>
            <div className="flex justify-between items-center mb-4 px-4">
              <div>
                <p className="text-lg font-semibold">{t('joinedDate')}</p>
                <p>{new Date(userData.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{t('likes')}</p>
                <p>{userData.likes_received_count || 0}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{t('uploads')}</p>
                <p>{userData.uploads_count || 0}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{t('discordRole')}</p>
                <p>{userData.discord_role || "N/A"}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{t('socialMedia')}</p>
                <Link
                  href={userData.user_prefer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {t('link')}
                </Link>
              </div>
            </div>
            <div className="text-center mb-4">
              <p className="text-lg font-semibold">{t('top3FavoriteGames')}</p>
              <div className="flex justify-center gap-2 mt-2">
                {userData.favorite_games?.map((game, index) => (
                  <Chip key={index} variant="flat" color="primary">
                    {game.game_name}
                  </Chip>
                )) || <p>{t('noFavoriteGames')}</p>}
              </div>
            </div>
            <div className="text-center mb-4">
              <p className="text-lg font-semibold">{t('gamesAchieved')}</p>
              <div className="flex justify-center gap-2 mt-2">
                {userData.achieved_games?.map((game, index) => (
                  <Chip key={index} variant="flat" color="primary">
                    {game.game_name}
                  </Chip>
                )) || <p>{t('noAchievedGames')}</p>}
              </div>
            </div>
            <div className="text-center mb-4">
              <p className="text-lg font-semibold">{t('accountIDs')}</p>
              <div className="flex justify-center gap-4 mt-2">
                {userData.accounts_ids &&
                  Object.keys(userData.accounts_ids).map((key) => (
                    <Chip
                      key={key}
                      color="warning"
                      variant="bordered"
                      onClose={() =>
                        copyToClipboard(userData.accounts_ids[key])
                      }
                      endContent={<CopyDocumentIcon />}
                    >
                      {`${key}: ${userData.accounts_ids[key]}`}
                    </Chip>
                  ))}
              </div>
            </div>
          </CardBody>
          <Divider />
          {mode === "my-account" && (
            <CardBody className="text-center mb-4">
              <p className="text-lg font-semibold">{t('profileCompletion')}</p>
              <Progress value={profileCompletionPercentage} color="primary" />
              {profileCompletionPercentage < 100 && (
                <ul className="list-disc list-inside mt-2">
                  {stepsToCompleteProfile.map((step, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {step}
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          )}
          <Divider />
          {mode === "my-account" && (
            <CardFooter className="flex justify-center">
              <Button
                color="primary"
                variant="shadow"
                onClick={() => navigate("/profile")}
              >
                {t('editProfile')}
              </Button>
            </CardFooter>
          )}
          <Tabs
            disabledKeys={
              mode === "view-profile" ? ["favorites", "archived"] : []
            }
            aria-label="Dynamic tabs"
            items={tabs}
            fullWidth
            classNames={{
              tabContent: "group-data-[selected=true]:text-[#06b6d4]",
            }}
          >
            {(item) => (
              <Tab key={item.id} title={item.label}>
                <Card>
                  <CardBody>{item.content}</CardBody>
                </Card>
              </Tab>
            )}
          </Tabs>
        </Card>
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>{renderModalContent()}</ModalContent>
      </Modal>
    </div>
  );
};

export default UserAccountPage;
