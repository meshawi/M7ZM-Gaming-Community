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

const AdminVideosTable = () => {
  const { t } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewVideo, setViewVideo] = useState(null);
  const [editVideo, setEditVideo] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("https://api.aleshawi.me/api/admin/videos");
        const data = await response.json();
        if (data.status === "success") {
          setVideos(data.videos);
        } else {
          setError(t('fetch_videos_error'));
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

    fetchVideos();
    fetchTags();
  }, [t]);

  const handleViewClick = (video) => {
    setViewVideo(video);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (video) => {
    setEditVideo({
      ...video,
      visibility: new Set([video.visibility]),
      tags: new Set(video.tags?.map((tag) => tag.tag_id) || []),
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (key, value) => {
    setEditVideo({ ...editVideo, [key]: value });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/edit-video/${editVideo.video_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editVideo.title,
            description: editVideo.description,
            visibility: Array.from(editVideo.visibility)[0],
            tags: Array.from(editVideo.tags),
          }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setVideos(
          videos.map((video) =>
            video.video_id === editVideo.video_id ? data.video : video
          )
        );
        setIsEditModalOpen(false);
      } else {
        alert(t('update_video_error'));
      }
    } catch (err) {
      alert(t('update_video_error'));
    }
  };

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteVideo = async () => {
    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/delete-video/${videoToDelete.video_id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setVideos(
          videos.filter((video) => video.video_id !== videoToDelete.video_id)
        );
        setIsDeleteModalOpen(false);
      } else {
        alert(t('delete_video_error'));
      }
    } catch (err) {
      alert(t('delete_video_error'));
    }
  };

  const renderCell = (video, columnKey) => {
    const cellValue = video[columnKey];

    switch (columnKey) {
      case "thumbnail":
        return (
          <Image
            src={video.thumbnail_path}
            alt={video.title}
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
            color={visibilityColorMap[video.visibility]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "user":
        return video.user ? (
          <User
            avatarProps={{ radius: "lg", src: video.user.profile_picture }}
            description={video.user.username}
            name={video.user.full_name}
          />
        ) : (
          <p>{t('user_deleted')}</p>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content={t('details')}>
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleViewClick(video)}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content={t('edit_video')}>
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEditClick(video)}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content={t('delete_video')}>
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDeleteClick(video)}
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
      <Table aria-label={t('video_table')}>
        <TableHeader
          columns={[
            { name: t('thumbnail'), uid: "thumbnail" },
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
        <TableBody items={videos}>
          {(item) => (
            <TableRow key={item.video_id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {viewVideo && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              {t('video_details')}
            </ModalHeader>
            <ModalBody>
              <video controls className="w-full">
                <source src={viewVideo.video_path} type="video/mp4" />
                {t('video_not_supported')}
              </video>
              <p>
                <strong>{t('title')}:</strong> {viewVideo.title}
              </p>
              <p>
                <strong>{t('description')}:</strong> {viewVideo.description}
              </p>
              <p>
                <strong>{t('uploaded_by')}:</strong>{" "}
                {viewVideo.user?.full_name || t('user_deleted')}
              </p>
              <p>
                <strong>{t('created_at')}:</strong>{" "}
                {new Date(viewVideo.created_at).toLocaleString()}
              </p>
              <p>
                <strong>{t('visibility')}:</strong> {viewVideo.visibility}
              </p>
              <p>
                <strong>{t('tags')}:</strong>{" "}
                {viewVideo.tags?.map((tag) => tag.tag_name).join(", ")}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={() => setIsViewModalOpen(false)}>
                {t('close')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {editVideo && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              {t('edit_video')}
            </ModalHeader>
            <ModalBody>
              <Input
                label={t('title')}
                value={editVideo.title}
                onChange={(e) => handleEditChange("title", e.target.value)}
              />
              <Textarea
                label={t('description')}
                value={editVideo.description}
                onChange={(e) =>
                  handleEditChange("description", e.target.value)
                }
              />
              <Select
                label={t('visibility')}
                variant="bordered"
                placeholder={t('select_visibility')}
                selectedKeys={editVideo.visibility}
                onSelectionChange={(keys) =>
                  handleEditChange("visibility", new Set(keys))
                }
              >
                {visibilityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label={t('tags')}
                selectionMode="multiple"
                placeholder={t('select_tags')}
                selectedKeys={editVideo.tags}
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
                {t('delete_confirmation', { title: videoToDelete?.title })}
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
              <Button color="primary" onPress={handleDeleteVideo}>
                {t('confirm')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default AdminVideosTable;
