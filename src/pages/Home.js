import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Card, CardBody, CardFooter, CardHeader, Image, Chip, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import OWRandomCharacterHome from '../components/OverWatch/OWRandomCharacterHome';
import BHRandomCharacterHome from '../components/Brawlhalla/BHRandomCharacterHome';
import { fetchGamesFromAPI } from '../components/CallOfDuty/Codhelpers';
import { CodCard } from '../components/CallOfDuty/CodCard';
import { useTranslation } from 'react-i18next';

const colors = ["default", "primary", "secondary", "success", "warning", "danger"];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Home = () => {
  const { isLoggedIn, username } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [randomCodGame, setRandomCodGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen: isVideoModalOpen, onOpen: openVideoModal, onOpenChange: onVideoModalChange } = useDisclosure();
  const { isOpen: isImageModalOpen, onOpen: openImageModal, onOpenChange: onImageModalChange } = useDisclosure();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleExplore = () => {
    navigate('/explore');
  };

  const handleDropdownItemClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('https://api.aleshawi.me/api/all-public-videos');
        const data = await response.json();
        if (data.status) {
          const randomVideos = data.data.sort(() => 0.5 - Math.random()).slice(0, 3);
          setVideos(randomVideos);
        }
      } catch (error) {
        console.error('Error fetching public videos:', error);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch('https://api.aleshawi.me/api/all-public-images');
        const data = await response.json();
        if (data.status) {
          const randomImages = data.data.sort(() => 0.5 - Math.random()).slice(0, 3);
          setImages(randomImages);
        }
      } catch (error) {
        console.error('Error fetching public images:', error);
      }
    };

    const fetchRandomCodGame = async () => {
      try {
        const data = await fetchGamesFromAPI();
        if (data.status) {
          const randomGame = data.data[Math.floor(Math.random() * data.data.length)];
          setRandomCodGame(randomGame);
        } else {
          setError(t('fetch_error'));
        }
      } catch (err) {
        setError(t('fetch_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
    fetchImages();
    fetchRandomCodGame();
  }, [t]);

  const openVideoModalHandler = (video) => {
    setSelectedVideo(video);
    openVideoModal();
  };

  const openImageModalHandler = (image) => {
    setSelectedImage(image);
    openImageModal();
  };

  return (
    <div className="min-h-screen items-center">
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-6 text-primary">
            {isLoggedIn ? t('welcome_back', { username }) : t('welcome')}
          </h1>
          <p className="text-lg text-secondary mb-4">
            {isLoggedIn 
              ? t('welcome_message_logged_in')
              : t('welcome_message_logged_out')}
          </p>
          {!isLoggedIn && (
            <div className="flex justify-center mt-8">
              <Button color="primary" onClick={handleSignUp} size="large">
                {t('sign_up_now')}
              </Button>
            </div>
          )}
        </div>
      </div>
      <section className="container mx-auto mt-8 mb-8 bg-default shadow-md rounded-lg p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">{t('featured_videos')}</h2>
          <Button color="primary" onClick={handleExplore} className="mt-2">
            {t('explore_more')}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.video_id} className="w-full transition-transform transform hover:scale-105">
              <CardHeader className="flex items-center gap-4">
                <Image
                  alt={t('profile_picture')}
                  src={video.profile_picture}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold">{video.username}</h3>
                  <p className="text-sm text-gray-500">{new Date(video.created_at).toLocaleDateString()}</p>
                </div>
              </CardHeader>
              <CardBody>
                <Image
                  alt={video.title}
                  src={video.thumbnail_path}
                  width="100%"
                  height="auto"
                  className="rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-700">{video.description}</p>
                <Button color="primary" onClick={() => openVideoModalHandler(video)} className="mt-2">
                  {t('view_video')}
                </Button>
              </CardBody>
              <CardFooter>
                <div className="flex gap-2">
                  {video.tags.map((tag, index) => (
                    <Chip key={index} color={getRandomColor()}>
                      {tag}
                    </Chip>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto mt-8 mb-8 bg-default shadow-md rounded-lg p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">{t('featured_images')}</h2>
          <Button color="primary" onClick={handleExplore} className="mt-2">
            {t('explore_more')}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.image_id} className="w-full transition-transform transform hover:scale-105">
              <CardHeader className="flex items-center gap-4">
                <Image
                  alt={t('profile_picture')}
                  src={image.profile_picture}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold">{image.username}</h3>
                  <p className="text-sm text-gray-500">{new Date(image.created_at).toLocaleDateString()}</p>
                </div>
              </CardHeader>
              <CardBody>
                <Image
                  alt={image.title}
                  src={image.image_path}
                  width="100%"
                  height="auto"
                  className="rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold">{image.title}</h3>
                <p className="text-sm text-gray-700">{image.description}</p>
                <Button color="primary" onClick={() => openImageModalHandler(image)} className="mt-2">
                  {t('view_image')}
                </Button>
              </CardBody>
              <CardFooter>
                <div className="flex gap-2">
                  {image.tags.map((tag, index) => (
                    <Chip key={index} color={getRandomColor()}>
                      {tag}
                    </Chip>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto mt-8 mb-8 bg-default shadow-md rounded-lg p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">{t('other_features')}</h2>
          <Dropdown backdrop="blur">
            <DropdownTrigger>
              <Button color="primary" variant="solid" className="mt-2">
                {t('open_menu')}
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Static Actions">
              <DropdownItem key="overwatch" onClick={() => handleDropdownItemClick('/overwatch')}>{t('overwatch')}</DropdownItem>
              <DropdownItem key="brawlhalla" onClick={() => handleDropdownItemClick('/brawlhalla')}>{t('brawlhalla')}</DropdownItem>
              <DropdownItem key="callofduty" onClick={() => handleDropdownItemClick('/callofduty')}>{t('call_of_duty')}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OWRandomCharacterHome />
          <BHRandomCharacterHome />
          {loading ? (
            <div className="flex justify-center items-center mt-4">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            randomCodGame && <CodCard game={randomCodGame} />
          )}
        </div>
      </section>

      {selectedVideo && (
        <Modal isOpen={isVideoModalOpen} onOpenChange={onVideoModalChange} width="800px">
          <ModalContent>
            <ModalHeader>
              {selectedVideo?.title}
            </ModalHeader>
            <ModalBody>
              <video src={selectedVideo?.video_path} controls width="100%" />
              <p>{selectedVideo?.description}</p>
            </ModalBody>
            <ModalFooter>
              <Button auto flat color="error" onClick={() => onVideoModalChange(false)}>
                {t('close')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {selectedImage && (
        <Modal isOpen={isImageModalOpen} onOpenChange={onImageModalChange} width="800px">
          <ModalContent>
            <ModalHeader>
              {selectedImage?.title}
            </ModalHeader>
            <ModalBody>
              <Image src={selectedImage?.image_path} width="100%" height="auto" />
              <p>{selectedImage?.description}</p>
            </ModalBody>
            <ModalFooter>
              <Button auto flat color="error" onClick={() => onImageModalChange(false)}>
                {t('close')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default Home;
