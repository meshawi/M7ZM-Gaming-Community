import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Divider,
  Input,
  Spinner,
  Pagination,
  PaginationItemType,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { ChevronIcon } from "../components/icons/ChevronIcon";
import { useTranslation } from 'react-i18next';

const SearchUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({ username: "", authorizationLevel: [] });
  const navigate = useNavigate();

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/m7zm_users?page=${page}`
      );
      const data = await response.json();
      setUsers(data.users);
      setFilteredUsers(data.users);
      setTotalPages(data.total_pages || 1); // Assuming API provides total pages
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError(t("fetch_users_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const applyFilters = (username, authorizationLevel) => {
    let filtered = users;
    if (username) {
      filtered = filtered.filter((user) =>
        user.username.toLowerCase().includes(username.toLowerCase())
      );
    }
    if (authorizationLevel.length > 0) {
      filtered = filtered.filter((user) =>
        authorizationLevel.includes(user.authorization_level)
      );
    }
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    applyFilters(filter.username, filter.authorizationLevel);
  }, [filter, users]);

  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={`bg-default-200/50 min-w-8 w-8 h-8 ${className}`}
          onClick={onNext}
        >
          <ChevronIcon className="rotate-180" />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={`bg-default-200/50 min-w-8 w-8 h-8 ${className}`}
          onClick={onPrevious}
        >
          <ChevronIcon />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return <button key={key} className={className}>...</button>;
    }

    return (
      <button
        key={key}
        ref={ref}
        className={`${className} ${
          isActive
            ? "text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold"
            : ""
        }`}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-4">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("search_users")}</h1>

      <div className="mb-4">
        <Input
          placeholder={t("filter_by_username")}
          fullWidth
          onChange={(e) =>
            setFilter({ ...filter, username: e.target.value.toLowerCase() })
          }
          className="mb-4"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{t("filter_by_auth_level")}</label>
        <div className="flex space-x-2">
          {["User", "Admin", "Moderator"].map((level) => (
            <button
              key={level}
              className={`px-4 py-2 rounded ${
                filter.authorizationLevel.includes(level)
                  ? "bg-success"
                  : "bg-primary"
              }`}
              onClick={() => {
                const isActive = filter.authorizationLevel.includes(level);
                setFilter({
                  ...filter,
                  authorizationLevel: isActive
                    ? filter.authorizationLevel.filter((l) => l !== level)
                    : [...filter.authorizationLevel, level],
                });
              }}
            >
              {t(level.toLowerCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card
            key={user.user_id}
            isPressable
            onPress={() => navigate(`/user/${user.username}`)}
          >
            <CardHeader className="flex items-center">
              <Avatar src={user.profile_picture} size="lg" />
              <div className="ml-4">
                <h3 className="text-lg font-bold">{user.full_name}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-sm text-gray-600">
                <strong>{t("profile_visibility")}:</strong> {user.profile_visibility}
              </p>
              <p className="text-sm text-gray-600">
                <strong>{t("last_login")}:</strong>{" "}
                {user.last_login
                  ? new Date(user.last_login).toLocaleString()
                  : t("never")}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          disableCursorAnimation
          showControls
          total={totalPages}
          initialPage={page}
          onChange={(newPage) => setPage(newPage)}
          className="gap-2"
          radius="full"
          renderItem={renderItem}
          variant="light"
        />
      </div>
    </div>
  );
};

export default SearchUsers;
