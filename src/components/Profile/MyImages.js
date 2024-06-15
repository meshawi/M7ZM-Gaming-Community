import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Spinner,
  CheckboxGroup,
  Image
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { EyeIcon } from "../icons/EyeIcon";
import { useTranslation } from 'react-i18next';

const MyImages = () => {
  const [images, setImages] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const { username } = useSelector((state) => state.auth);
  const { isOpen: isEditModalOpen, onOpen: openEditModal, onOpenChange: onEditModalChange } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: openDeleteModal, onOpenChange: onDeleteModalChange } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: openViewModal, onOpenChange: onViewModalChange } = useDisclosure();
  const [editImage, setEditImage] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editVisibility, setEditVisibility] = useState('public');
  const [editTags, setEditTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [deleteImageId, setDeleteImageId] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`https://api.aleshawi.me/api/all-images/${username}`);
        const data = await response.json();
        if (data.status) {
          setImages(data.data);
        } else {
          console.error("Failed to fetch images");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch('https://api.aleshawi.me/api/tags');
        const data = await response.json();
        if (data.status === 'success') {
          setAvailableTags(data.tags);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchImages();
    fetchTags();
  }, [username]);

  const handleEditClick = (image) => {
    setEditImage(image);
    setEditTitle(image.title);
    setEditDescription(image.description);
    setEditVisibility(image.visibility);
    setEditTags(image.tags.map(tag => {
      const tagObj = availableTags.find(t => t.tag_name === tag);
      return tagObj ? tagObj.tag_id : null;
    }).filter(tagId => tagId !== null)); // Ensure tag IDs are valid
    openEditModal();
  };

  const handleUpdate = async () => {
    if (!editTitle || !editDescription || !editVisibility || editTags.length === 0) {
      setMessage(t('fill_all_fields'));
      return;
    }

    setLoading(true);

    const updatedImage = {
      title: editTitle,
      description: editDescription,
      visibility: editVisibility,
      tags: editTags.filter(tag => !isNaN(parseInt(tag, 10))).map(tag => parseInt(tag, 10)), // Ensure tags are valid integers
    };

    console.log("Updated Image:", updatedImage);

    try {
      const response = await fetch(`https://api.aleshawi.me/api/edit-image/${editImage.image_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedImage),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(t('update_success'));
        setImages((prevImages) => prevImages.map((image) =>
          image.image_id === editImage.image_id ? { ...image, ...updatedImage, tags: editTags.map(tagId => availableTags.find(tag => tag.tag_id === tagId).tag_name) } : image
        ));
        onEditModalChange(false);
      } else {
        console.log('Server response:', data);
        setMessage(t('update_failed'));
      }
    } catch (error) {
      console.error('Error updating image:', error);
      setMessage(t('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (imageId) => {
    setDeleteImageId(imageId);
    openDeleteModal();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.aleshawi.me/api/delete-image/${deleteImageId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(t('delete_success'));
        setImages((prevImages) => prevImages.filter((image) => image.image_id !== deleteImageId));
        onDeleteModalChange(false);
      } else {
        console.log('Server response:', data);
        setMessage(t('delete_failed'));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage(t('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (image) => {
    setViewImage(image);
    openViewModal();
  };

  const renderCell = useCallback((image, columnKey) => {
    const cellValue = image[columnKey];

    switch (columnKey) {
      case "title":
        return (
          <User
            avatarProps={{ radius: "lg", src: image.image_path }}
            name={cellValue}
            description={image.description}
          />
        );
      case "tags":
        return (
          <div className="flex gap-2">
            {image.tags.map((tag, index) => (
              <Chip key={index} size="sm" color="primary">
                {tag}
              </Chip>
            ))}
          </div>
        );
      case "visibility":
        return (
          <Chip className="capitalize" size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content={t('details')}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleViewClick(image)}>
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content={t('edit_image')}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEditClick(image)}>
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content={t('delete_image')}>
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDeleteClick(image.image_id)}>
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, [availableTags, t]);

  const columns = [
    { name: t('title'), uid: "title" },
    { name: t('tags'), uid: "tags" },
    { name: t('visibility'), uid: "visibility" },
    { name: t('actions'), uid: "actions" },
  ];

  return (
    <>
      <Table aria-label={t('my_images_table')}>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={images}>
          {(item) => (
            <TableRow key={item.image_id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editImage && (
        <Modal 
          isOpen={isEditModalOpen} 
          onOpenChange={onEditModalChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{t('edit_image')}</ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label={t('title')}
                    placeholder={t('enter_image_title')}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label={t('description')}
                    placeholder={t('enter_image_description')}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    variant="bordered"
                  />
                  <Select
                    label={t('visibility')}
                    placeholder={t('select_visibility')}
                    value={editVisibility}
                    onChange={(e) => setEditVisibility(e.target.value)}
                  >
                    <SelectItem key="public" value="public">
                      {t('public')}
                    </SelectItem>
                    <SelectItem key="open" value="open">
                      {t('open')}
                    </SelectItem>
                    <SelectItem key="archived" value="archived">
                      {t('archived')}
                    </SelectItem>
                  </Select>
                  <CheckboxGroup
                    label={t('tags')}
                    value={editTags.map(String)} // Convert tags to strings for CheckboxGroup
                    onChange={(selectedTags) => {
                      const convertedTags = selectedTags.map(tag => {
                        const tagId = parseInt(tag, 10);
                        console.log('Tag ID:', tag, 'Converted Tag ID:', tagId);
                        return tagId;
                      }).filter(tagId => !isNaN(tagId)); // Filter out any NaN values
                      setEditTags(convertedTags);
                    }} // Convert selected tags back to integers
                  >
                    {availableTags.map((tag) => (
                      <Checkbox key={tag.tag_id} value={String(tag.tag_id)}>
                        {tag.tag_name}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                  {message && <p className="mt-4 text-red-500">{message}</p>}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    {t('close')}
                  </Button>
                  <Button color="primary" onPress={handleUpdate} disabled={loading}>
                    {loading ? <Spinner /> : t('update')}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}

      {viewImage && (
        <Modal 
          isOpen={isViewModalOpen} 
          onOpenChange={onViewModalChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{t('view_image')}</ModalHeader>
                <ModalBody>
                  <Image
                    src={viewImage.image_path}
                    alt={viewImage.title}
                    objectFit="cover"
                    width="100%"
                    height="auto"
                    radius="lg"
                  />
                  <p className="mt-4">{viewImage.description}</p>
                  <div className="flex gap-2 mt-2">
                    {viewImage.tags.map((tag, index) => (
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

      <Modal 
        isOpen={isDeleteModalOpen} 
        onOpenChange={onDeleteModalChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{t('delete_confirmation')}</ModalHeader>
              <ModalBody>
                <p>{t('delete_confirmation')}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  {t('cancel')}
                </Button>
                <Button color="primary" onPress={handleDelete} disabled={loading}>
                  {loading ? <Spinner /> : t('confirm')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyImages;
