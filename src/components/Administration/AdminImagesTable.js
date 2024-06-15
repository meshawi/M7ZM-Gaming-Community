import React, { useEffect, useState } from "react";
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
  Image,
  Textarea,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { EyeIcon } from "../icons/EyeIcon";
import { useTranslation } from "react-i18next";

const visibilityOptions = ["open", "public", "private", "archived"];
const visibilityColorMap = {
  open: "success",
  public: "primary",
  private: "warning",
  archived: "default",
};

const AdminImagesTable = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("https://api.aleshawi.me/api/admin/images");
        const data = await response.json();
        if (data.status === "success") {
          setImages(data.images);
        } else {
          setError(t('fetch_images_error'));
        }
      } catch (err) {
        setError(t('fetch_data_error'));
      } finally {
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/tags");
        const data = await response.json();
        if (data.status === "success") {
          setTags(data.tags);
        } else {
          setError(t('fetch_tags_error'));
        }
      } catch (err) {
        setError(t('fetch_data_error'));
      }
    };

    fetchImages();
    fetchTags();
  }, [t]);

  const handleEditClick = (image) => {
    setEditImage({
      ...image,
      visibility: new Set([image.visibility]),
      tags: new Set(image.tags?.map((tag) => tag.tag_id) || []),
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (key, value) => {
    setEditImage({ ...editImage, [key]: value });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/edit-image/${editImage.image_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editImage.title,
            description: editImage.description,
            visibility: Array.from(editImage.visibility)[0],
            tags: Array.from(editImage.tags),
          }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setImages(
          images.map((image) =>
            image.image_id === editImage.image_id ? data.image : image
          )
        );
        setIsEditModalOpen(false);
      } else {
        alert(t('update_image_error'));
      }
    } catch (err) {
      alert(t('update_image_error'));
    }
  };

  const handleDeleteClick = (image) => {
    setImageToDelete(image);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteImage = async () => {
    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/delete-image/${imageToDelete.image_id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setImages(
          images.filter((image) => image.image_id !== imageToDelete.image_id)
        );
        setIsDeleteModalOpen(false);
      } else {
        alert(t('delete_image_error'));
      }
    } catch (err) {
      alert(t('delete_image_error'));
    }
  };

  const renderCell = (image, columnKey) => {
    const cellValue = image[columnKey];

    switch (columnKey) {
      case "image_path":
        return (
          <Image
            src={image.image_path}
            alt={image.title}
            width={100}
            height={100}
          />
        );
      case "title":
        return <p>{cellValue}</p>;
      case "description":
        return <p>{cellValue}</p>;
      case "created_at":
        return <p>{new Date(cellValue).toLocaleString()}</p>;
      case "visibility":
        return (
          <Chip
            className="capitalize"
            color={visibilityColorMap[image.visibility]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "user":
        return image.user ? (
          <User
            avatarProps={{ radius: "lg", src: image.user.profile_picture }}
            description={image.user.username}
            name={image.user.full_name}
          />
        ) : (
          <p>{t('user_deleted')}</p>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content={t('details')}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content={t('edit_image')}>
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEditClick(image)}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content={t('delete_image')}>
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDeleteClick(image)}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  if (loading) {
    return <p>{t('loading')}</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Table aria-label={t('image_table')}>
        <TableHeader
          columns={[
            { name: t('image'), uid: "image_path" },
            { name: t('title'), uid: "title" },
            { name: t('description'), uid: "description" },
            { name: t('uploaded_by'), uid: "user" },
            { name: t('created_at'), uid: "created_at" },
            { name: t('visibility'), uid: "visibility" },
            { name: t('actions'), uid: "actions" },
          ]}
        >
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={images}>
          {(item) => (
            <TableRow key={item.image_id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editImage && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              {t('edit_image')}
            </ModalHeader>
            <ModalBody>
              <Input
                label={t('title')}
                value={editImage.title}
                onChange={(e) => handleEditChange("title", e.target.value)}
              />
              <Textarea
                label={t('description')}
                value={editImage.description}
                onChange={(e) =>
                  handleEditChange("description", e.target.value)
                }
              />
              <Select
                label={t('visibility')}
                variant="bordered"
                placeholder={t('select_visibility')}
                selectedKeys={editImage.visibility}
                onSelectionChange={(keys) =>
                  handleEditChange("visibility", new Set(keys))
                }
              >
                {visibilityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(option)}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label={t('tags')}
                selectionMode="multiple"
                placeholder={t('select_tags')}
                selectedKeys={editImage.tags}
                onSelectionChange={(keys) =>
                  handleEditChange("tags", new Set(keys))
                }
              >
                {tags.map((tag) => (
                  <SelectItem key={tag.tag_id} value={tag.tag_id}>
                    {tag.tag_name}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={() => setIsEditModalOpen(false)}
              >
                {t('cancel')}
              </Button>
              <Button color="primary" onPress={handleEditSubmit}>
                {t('save')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              {t('confirm_delete')}
            </ModalHeader>
            <ModalBody>
              <p>
                {t('delete_confirmation', { title: imageToDelete?.title })}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={() => setIsDeleteModalOpen(false)}
              >
                {t('cancel')}
              </Button>
              <Button color="primary" onPress={handleDeleteImage}>
                {t('confirm')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default AdminImagesTable;
