import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  ButtonGroup,
  Avatar,
  Input,
  Spacer,
  Divider,
  Chip,
  Skeleton,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { LikeIcon } from "../icons/LikeIcon";
import { DislikeIcon } from "../icons/DislikeIcon";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { useTranslation } from 'react-i18next';

const WatchVideo = () => {
  const { t } = useTranslation();
  const { videoId } = useParams();
  const { userId, username, profilePicture } = useSelector(
    (state) => state.auth
  );
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reactionLoading, setReactionLoading] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [editCommentText, setEditCommentText] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [removeFavoriteLoading, setRemoveFavoriteLoading] = useState(false);
  const [removeFavoriteMessage, setRemoveFavoriteMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch video details from the API
    fetch(`https://api.aleshawi.me/api/video-details/${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setVideoData(data.data);
          // Fetch reaction status
          fetch(
            `https://api.aleshawi.me/api/video/${data.data.video_id}/reaction/${userId}`
          )
            .then((response) => response.json())
            .then((reactionData) => {
              if (reactionData.status === "success") {
                setCurrentReaction(reactionData.reaction);
              }
            })
            .catch((error) =>
              console.error("Error fetching reaction status:", error)
            );
          // Fetch comments
          fetch(
            `https://api.aleshawi.me/api/video/${data.data.video_id}/comments`
          )
            .then((response) => response.json())
            .then((commentData) => {
              if (commentData.status === "success") {
                setComments(commentData.comments);
              }
            })
            .catch((error) => console.error("Error fetching comments:", error));
          // Fetch favorite status
          fetch(
            `https://api.aleshawi.me/api/video/${data.data.video_id}/favorite/${userId}`
          )
            .then((response) => response.json())
            .then((favoriteData) => {
              if (favoriteData.status === "success") {
                setIsFavorite(favoriteData.is_favorite);
              }
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching favorite status:", error);
              setLoading(false);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching video details:", error);
        setLoading(false);
      });
  }, [videoId, userId]);

  const handleReaction = (reactionType) => {
    if (reactionLoading) return;

    setReactionLoading(true);
    const apiUrl = currentReaction
      ? `https://api.aleshawi.me/api/video/${videoData.video_id}/update-reaction`
      : `https://api.aleshawi.me/api/video/${videoData.video_id}/react`;

    const payload = {
      user_id: userId,
      reaction_type: reactionType,
    };

    console.log("Sending reaction to API:", apiUrl, payload);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
        if (data.status === "success") {
          setVideoData((prevData) => ({
            ...prevData,
            likes: data.likes,
            dislikes: data.dislikes,
          }));
          setCurrentReaction(reactionType); // Update current reaction
        }
        setReactionLoading(false);
      })
      .catch((error) => {
        console.error("Error updating reaction:", error);
        setReactionLoading(false);
      });
  };

  const handleAddComment = () => {
    if (commentLoading || !commentText.trim()) return;

    setCommentLoading(true);
    const apiUrl = `https://api.aleshawi.me/api/video/${videoData.video_id}/comment`;

    const payload = {
      user_id: userId,
      comment_text: commentText,
    };

    console.log("Sending comment to API:", apiUrl, payload);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
        if (data.status === "success") {
          setComments((prevComments) => [
            ...prevComments,
            {
              comment_id: data.comment.id,
              video_id: data.comment.video_id,
              user_id: data.comment.user_id,
              comment_text: data.comment.comment_text,
              created_at: new Date().toISOString(),
              username, // Use actual username from Redux
              profile_picture: profilePicture, // Use actual profile picture from Redux
            },
          ]);
          setCommentText("");
        }
        setCommentLoading(false);
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
        setCommentLoading(false);
      });
  };

  const handleEditClick = (comment) => {
    setEditCommentId(comment.comment_id);
    setEditCommentText(comment.comment_text);
  };

  const handleEditComment = () => {
    if (commentLoading || !editCommentText.trim()) return;

    setCommentLoading(true);
    const apiUrl = `https://api.aleshawi.me/api/comment/${editCommentId}`;

    const payload = {
      comment_text: editCommentText,
    };

    console.log("Sending edit comment to API:", apiUrl, payload);

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
        if (data.status === "success") {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.comment_id === editCommentId
                ? {
                    ...comment,
                    comment_text: data.comment.comment_text,
                    updated_at: data.comment.updated_at,
                  }
                : comment
            )
          );
          setEditCommentId(null);
          setEditCommentText("");
        }
        setCommentLoading(false);
      })
      .catch((error) => {
        console.error("Error editing comment:", error);
        setCommentLoading(false);
      });
  };

  const handleDeleteClick = (commentId) => {
    if (commentLoading) return;

    setCommentLoading(true);
    const apiUrl = `https://api.aleshawi.me/api/comment/${commentId}`;

    console.log("Sending delete request to API:", apiUrl);

    fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
        if (data.status === "success") {
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.comment_id !== commentId)
          );
        }
        setCommentLoading(false);
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
        setCommentLoading(false);
      });
  };

  const handleAddFavorite = () => {
    if (favoriteLoading) return;

    setFavoriteLoading(true);
    const apiUrl = `https://api.aleshawi.me/api/video/${videoData.video_id}/favorite`;

    console.log("Sending add favorite request to API:", apiUrl);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
        setFavoriteMessage(data.message);
        if (data.status === "success") {
          setIsFavorite(true);
        }
        setFavoriteLoading(false);
      })
      .catch((error) => {
        console.error("Error adding favorite:", error);
        setFavoriteLoading(false);
      });
  };

  const handleRemoveFavorite = () => {
    if (removeFavoriteLoading) return;

    setRemoveFavoriteLoading(true);
    const apiUrl = `https://api.aleshawi.me/api/video/${videoData.video_id}/favorite/${userId}`;

    console.log("Sending remove favorite request to API:", apiUrl);

    fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
        setRemoveFavoriteMessage(data.message);
        if (data.status === "success") {
          setIsFavorite(false);
        }
        setRemoveFavoriteLoading(false);
      })
      .catch((error) => {
        console.error("Error removing favorite:", error);
        setRemoveFavoriteLoading(false);
      });
  };

  const handleAvatarClick = () => {
    navigate(`/user/${videoUsername}`, { state: { mode: "view-profile" } });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="w-full h-80 mb-4" />
        <Skeleton className="w-full h-10 mb-4" />
        <Skeleton className="w-full h-24 mb-4" />
        <Skeleton className="w-full h-40 mb-4" />
      </div>
    );
  }

  const {
    video_path,
    title,
    description,
    tags,
    created_at,
    visibility,
    username: videoUsername,
    profile_picture,
    likes,
    dislikes,
  } = videoData;

  return (
    <div className="container mx-auto p-4">
      <Card className="py-4">
        <CardBody>
          <video controls className="w-full h-auto">
            <source src={video_path} type="video/mp4" />
            {t('video_not_supported')}
          </video>
        </CardBody>
        <CardBody className="px-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-600">{description}</p>
          <div className="flex gap-2 mt-2">
            {tags.map((tag, index) => (
              <Chip key={index} color="primary">
                {tag}
              </Chip>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar
                src={profile_picture}
                isBordered
                onClick={handleAvatarClick}
              />
              <div>
                <p className="font-bold">{videoUsername}</p>
                <p className="text-sm text-gray-500">
                  {created_at} • {visibility}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                color="success"
                endContent={<LikeIcon />}
                disabled={reactionLoading}
                onClick={() => handleReaction("like")}
              >
                {reactionLoading && currentReaction === "like" ? (
                  <Spinner size="small" />
                ) : (
                  likes
                )}
              </Button>
              <Button
                color="danger"
                variant="bordered"
                startContent={<DislikeIcon />}
                disabled={reactionLoading}
                onClick={() => handleReaction("dislike")}
              >
                {reactionLoading && currentReaction === "dislike" ? (
                  <Spinner size="small" />
                ) : (
                  dislikes
                )}
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <ButtonGroup>
              <Button
                color="primary"
                onClick={handleAddFavorite}
                disabled={favoriteLoading}
              >
                {favoriteLoading ? (
                  <Spinner size="small" />
                ) : (
                  t('add_to_favorites')
                )}
              </Button>
              <Button
                color="primary"
                onClick={handleRemoveFavorite}
                disabled={removeFavoriteLoading}
              >
                {removeFavoriteLoading ? (
                  <Spinner size="small" />
                ) : (
                  t('remove_from_favorites')
                )}
              </Button>
            </ButtonGroup>
            {favoriteMessage && <p>{favoriteMessage}</p>}
            {removeFavoriteMessage && <p>{removeFavoriteMessage}</p>}
          </div>
        </CardBody>
      </Card>
      <Spacer y={2} />
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">{t('comments')}</h4>
        </CardHeader>
        <CardBody className="px-4">
          <div className="flex gap-2 mb-4">
            <Avatar src={profilePicture} isBordered />{" "}
            {/* Use actual profile picture from Redux */}
            <Input
              type="text"
              variant="bordered"
              placeholder={t('add_comment_placeholder')}
              fullWidth
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button auto onClick={handleAddComment} disabled={commentLoading}>
              {commentLoading ? <Spinner size="small" /> : t('post')}
            </Button>
          </div>
          <Divider />
          <Spacer y={1} />
          {comments.map((comment, index) => (
            <div key={index} className="flex gap-4 mb-4 items-start">
              <Avatar src={comment.profile_picture} isBordered />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">{comment.username}</p>
                    <p>{comment.comment_text}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                  {comment.user_id === userId && (
                    <div className="flex gap-2">
                      <Tooltip content={t('edit_comment')}>
                        <span
                          className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          onClick={() => handleEditClick(comment)}
                        >
                          <EditIcon />
                        </span>
                      </Tooltip>
                      <Tooltip color="danger" content={t('delete_comment')}>
                        <span
                          className="text-lg text-danger cursor-pointer active:opacity-50"
                          onClick={() => handleDeleteClick(comment.comment_id)}
                        >
                          <DeleteIcon />
                        </span>
                      </Tooltip>
                    </div>
                  )}
                </div>
                {editCommentId === comment.comment_id && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="text"
                      variant="bordered"
                      fullWidth
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                    />
                    <Button
                      auto
                      onClick={handleEditComment}
                      disabled={commentLoading}
                    >
                      {commentLoading ? <Spinner size="small" /> : t('save')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default WatchVideo;
