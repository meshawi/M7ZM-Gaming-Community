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
  CheckboxGroup
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { EyeIcon } from "../icons/EyeIcon";
import { useTranslation } from 'react-i18next';

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const { username } = useSelector((state) => state.auth);
  const { isOpen: isEditModalOpen, onOpen: openEditModal, onOpenChange: onEditModalChange } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: openDeleteModal, onOpenChange: onDeleteModalChange } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: openViewModal, onOpenChange: onViewModalChange } = useDisclosure();
  const [editVideo, setEditVideo] = useState(null);
  const [viewVideo, setViewVideo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editVisibility, setEditVisibility] = useState('public');
  const [editTags, setEditTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [deleteVideoId, setDeleteVideoId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`https://api.aleshawi.me/api/all-videos/${username}`);
        const data = await response.json();
        if (data.status) {
          setVideos(data.data);
        } else {
          console.error("Failed to fetch videos");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
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

    fetchVideos();
    fetchTags();
  }, [username]);

  const handleEditClick = (video) => {
    setEditVideo(video);
    setEditTitle(video.title);
    setEditDescription(video.description);
    setEditVisibility(video.visibility);
    setEditTags(video.tags.map(tag => {
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

    const updatedVideo = {
      title: editTitle,
      description: editDescription,
      visibility: editVisibility,
      tags: editTags.filter(tag => !isNaN(parseInt(tag, 10))).map(tag => parseInt(tag, 10)), // Ensure tags are valid integers
    };

    console.log("Updated Video:", updatedVideo);

    try {
      const response = await fetch(`https://api.aleshawi.me/api/edit-video/${editVideo.video_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVideo),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(t('update_success'));
        setVideos((prevVideos) => prevVideos.map((video) =>
          video.video_id === editVideo.video_id ? { ...video, ...updatedVideo, tags: editTags.map(tagId => availableTags.find(tag => tag.tag_id === tagId).tag_name) } : video
        ));
        onEditModalChange(false);
      } else {
        console.log('Server response:', data);
        setMessage(t('update_failed'));
      }
    } catch (error) {
      console.error('Error updating video:', error);
      setMessage(t('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (videoId) => {
    setDeleteVideoId(videoId);
    openDeleteModal();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.aleshawi.me/api/delete-video/${deleteVideoId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(t('delete_success'));
        setVideos((prevVideos) => prevVideos.filter((video) => video.video_id !== deleteVideoId));
        onDeleteModalChange(false);
      } else {
        console.log('Server response:', data);
        setMessage(t('delete_failed'));
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      setMessage(t('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (video) => {
    setViewVideo(video);
    openViewModal();
  };

  const renderCell = useCallback((video, columnKey) => {
    const cellValue = video[columnKey];

    switch (columnKey) {
      case "title":
        return (
          <User
            avatarProps={{ radius: "lg", src: video.thumbnail_path }}
            name={cellValue}
            description={video.description}
          />
        );
      case "tags":
        return (
          <div className="flex gap-2">
            {video.tags.map((tag, index) => (
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
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleViewClick(video)}>
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content={t('edit_video')}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEditClick(video)}>
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content={t('delete_video')}>
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDeleteClick(video.video_id)}>
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
      <Table aria-label={t('my_videos_table')}>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={videos}>
          {(item) => (
            <TableRow key={item.video_id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editVideo && (
        <Modal 
          isOpen={isEditModalOpen} 
          onOpenChange={onEditModalChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{t('edit_video')}</ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label={t('title')}
                    placeholder={t('enter_video_title')}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label={t('description')}
                    placeholder={t('enter_video_description')}
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

      {viewVideo && (
        <Modal 
          isOpen={isViewModalOpen} 
          onOpenChange={onViewModalChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{t('view_video')}</ModalHeader>
                <ModalBody>
                  <video
                    controls
                    width="100%"
                    height="auto"
                    style={{ borderRadius: "8px" }}
                  >
                    <source src={viewVideo.video_path} type="video/mp4" />
                    {t('video_not_supported')}
                  </video>
                  <p className="mt-4">{viewVideo.description}</p>
                  <div className="flex gap-2 mt-2">
                    {viewVideo.tags.map((tag, index) => (
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

export default MyVideos;
