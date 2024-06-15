import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  SelectItem,
  CheckboxGroup,
  Checkbox,
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [visibility, setVisibility] = useState("public");
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { userId } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    console.log("User ID:", userId);

    const fetchTags = async () => {
      try {
        const response = await fetch("https://api.aleshawi.me/api/tags");
        const data = await response.json();
        if (data.status === "success") {
          setAvailableTags(data.tags);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [userId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 100 * 1024 * 1024) {
      // 100MB
      setVideoFile(file);
      setMessage("");
      const thumbnailBlob = await generateThumbnail(file);
      setThumbnail(thumbnailBlob);
    } else {
      setMessage(t('file_size_exceeded_100m'));
    }
  };

  const generateThumbnail = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.onloadeddata = () => {
        video.currentTime = video.duration / 2;
      };
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };
      video.onerror = (err) => {
        reject(err);
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !videoFile || tags.length === 0) {
      setMessage(t('fill_all_fields'));
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("user_id", parseInt(userId));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("visibility", visibility);
    formData.append("thumbnail", thumbnail);
    tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    try {
      const response = await fetch("https://api.aleshawi.me/api/upload-video", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(t('upload_success'));
        navigate("/my-account");
      } else {
        console.log("Server response:", data);
        setMessage(t('upload_failed'));
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setMessage(t('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-col items-center">
          <h2 className="text-2xl font-bold">{t('upload_video')}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {loading ? (
            <div className="flex flex-col justify-center items-center h-96">
              <Spinner size="lg" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  label={t('title')}
                  placeholder={t('enter_video_title')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  label={t('description')}
                  placeholder={t('enter_video_description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="mb-4">
                <Select
                  label={t('visibility')}
                  placeholder={t('select_visibility')}
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
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
              </div>
              <div className="mb-4">
                <CheckboxGroup label={t('tags')} value={tags} onChange={setTags}>
                  {availableTags.map((tag) => (
                    <Checkbox key={tag.tag_id} value={tag.tag_id}>
                      {tag.tag_name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? <Spinner /> : t('upload_video')}
              </Button>
            </form>
          )}
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </CardBody>
      </Card>
    </div>
  );
};

export default UploadVideo;
