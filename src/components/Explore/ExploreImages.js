import React, { useEffect, useState } from "react";
import {
  Input,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Image,
  Avatar,
  Chip,
  CheckboxGroup,
  Checkbox,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const fetchImagesFromAPI = async () => {
  try {
    const response = await fetch("https://api.aleshawi.me/api/all-public-images");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return { status: false };
  }
};

const ExploreImages = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ tags: [] });
  const [availableTags, setAvailableTags] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await fetchImagesFromAPI();
        if (data.status) {
          setImages(data.data);
          setFilteredImages(data.data);
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

    fetchImages();
  }, [t]);

  const extractTags = (images) => {
    const tags = new Set();
    images.forEach((image) => {
      image.tags.forEach((tag) => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));
  };

  const applyFilters = (tags) => {
    let filtered = images;
    if (tags.length > 0) {
      filtered = filtered.filter((image) =>
        image.tags.some((tag) => tags.includes(tag))
      );
    }
    setFilteredImages(filtered);
  };

  useEffect(() => {
    applyFilters(filter.tags);
  }, [filter, images]);

  const handleViewImage = (image) => {
    setSelectedImage(image);
    onOpen();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('explore_images')}</h1>

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
          {filteredImages.map((image) => (
            <Card key={image.image_id} className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <div className="flex items-center gap-2">
                  <Avatar isBordered src={image.profile_picture} />
                  <div>
                    <h4 className="font-bold text-large">{image.username}</h4>
                    <p className="text-tiny">{new Date(image.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <h4 className="font-bold text-large mt-2">{image.title}</h4>
                <small className="text-default-500">{image.description}</small>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  alt={t('image_thumbnail')}
                  className="object-cover rounded-xl"
                  src={image.image_path}
                  width={270}
                />
                <div className="flex gap-2 mt-2">
                  {image.tags.map((tag, index) => (
                    <Chip key={index} color="primary">
                      {tag}
                    </Chip>
                  ))}
                </div>
                <Button color="primary" variant="bordered" className="mt-4" onPress={() => handleViewImage(image)}>
                  {t('view_image')}
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {selectedImage && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{t('view_image')}</ModalHeader>
                <ModalBody>
                  <Image
                    src={selectedImage.image_path}
                    alt={selectedImage.title}
                    objectFit="cover"
                    width="100%"
                    height="auto"
                    radius="lg"
                  />
                  <p className="mt-4">{selectedImage.description}</p>
                  <div className="flex gap-2 mt-2">
                    {selectedImage.tags.map((tag, index) => (
                      <Chip key={index} size="sm" color="primary">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="flat" onPress={onClose}>
                    {t('close')}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default ExploreImages;
