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
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { EyeIcon } from "../icons/EyeIcon";
import { useTranslation } from "react-i18next";

const statusColorMap = {
  active: "success",
  inactive: "warning",
  banned: "danger",
};

const statusOptions = ["active", "inactive", "banned"];
const profileVisibilityOptions = ["public", "private"];
const authorizationLevelOptions = ["ADMIN", "Moderator", "User"];

const AdminUsersTable = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newAccountType, setNewAccountType] = useState("");
  const [newAccountID, setNewAccountID] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://api.aleshawi.me/api/m7zm_users");
        const data = await response.json();
        if (data.status === "success") {
          setUsers(data.users);
        } else {
          setError(t('fetch_users_error'));
        }
      } catch (err) {
        setError(t('fetch_data_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  const handleEditClick = (user) => {
    setEditUser({
      ...user,
      status: new Set([user.status]),
      profile_visibility: new Set([user.profile_visibility]),
      authorization_level: new Set([user.authorization_level]),
      accounts_ids: user.accounts_ids || {},
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (key, value) => {
    setEditUser({ ...editUser, [key]: value });
  };

  const handleAccountIDChange = (key, value) => {
    setEditUser({
      ...editUser,
      accounts_ids: { ...editUser.accounts_ids, [key]: value },
    });
  };

  const handleAddAccountID = () => {
    if (newAccountType && newAccountID) {
      setEditUser({
        ...editUser,
        accounts_ids: {
          ...editUser.accounts_ids,
          [newAccountType]: newAccountID,
        },
      });
      setNewAccountType("");
      setNewAccountID("");
    }
  };

  const handleRemoveAccountID = (key) => {
    const updatedAccountsIDs = { ...editUser.accounts_ids };
    delete updatedAccountsIDs[key];
    setEditUser({ ...editUser, accounts_ids: updatedAccountsIDs });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/admin/edit-user/${editUser.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: editUser.username,
            password: editUser.password,
            bio: editUser.bio,
            status: Array.from(editUser.status)[0],
            profile_visibility: Array.from(editUser.profile_visibility)[0],
            discord_role: editUser.discord_role,
            user_prefer_url: editUser.user_prefer_url,
            authorization_level: Array.from(editUser.authorization_level)[0],
            accounts_ids: editUser.accounts_ids,
          }), // Sending all fields for now
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setUsers(
          users.map((user) =>
            user.user_id === editUser.user_id ? data.user : user
          )
        );
        setIsEditModalOpen(false);
      } else {
        alert(t('update_user_error'));
      }
    } catch (err) {
      alert(t('update_user_error'));
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/admin/delete-user/${userToDelete.user_id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setUsers(users.filter((user) => user.user_id !== userToDelete.user_id));
        setIsDeleteModalOpen(false);
      } else {
        alert(t('delete_user_error'));
      }
    } catch (err) {
      alert(t('delete_user_error'));
    }
  };

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "full_name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.profile_picture }}
            description={user.username}
            name={cellValue}
          />
        );
      case "username":
        return <p>{cellValue}</p>;
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "profile_visibility":
        return <p className="capitalize">{cellValue}</p>;
      case "last_login":
        return <p>{new Date(cellValue).toLocaleString()}</p>;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content={t('details')}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content={t('edit_user')}>
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEditClick(user)}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content={t('delete_user')}>
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDeleteClick(user)}
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
      <Table aria-label={t('user_table')}>
        <TableHeader
          columns={[
            { name: t('full_name'), uid: "full_name" },
            { name: t('username'), uid: "username" },
            { name: t('status'), uid: "status" },
            { name: t('profile_visibility'), uid: "profile_visibility" },
            { name: t('last_login'), uid: "last_login" },
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
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.user_id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">{t('edit_user')}</ModalHeader>
            <ModalBody>
              <Input
                label={t('username')}
                value={editUser.username}
                onChange={(e) => handleEditChange("username", e.target.value)}
              />
              <Input
                label={t('password')}
                type="password"
                onChange={(e) => handleEditChange("password", e.target.value)}
              />
              <Textarea
                label={t('bio')}
                value={editUser.bio}
                onChange={(e) => handleEditChange("bio", e.target.value)}
              />
              <Select
                label={t('status')}
                variant="bordered"
                placeholder={t('select_status')}
                selectedKeys={editUser.status}
                onSelectionChange={(keys) =>
                  handleEditChange("status", new Set(keys))
                }
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label={t('profile_visibility')}
                variant="bordered"
                placeholder={t('select_profile_visibility')}
                selectedKeys={editUser.profile_visibility}
                onSelectionChange={(keys) =>
                  handleEditChange("profile_visibility", new Set(keys))
                }
              >
                {profileVisibilityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label={t('discord_role')}
                value={editUser.discord_role}
                onChange={(e) =>
                  handleEditChange("discord_role", e.target.value)
                }
              />
              <Input
                label={t('preferred_url')}
                value={editUser.user_prefer_url}
                onChange={(e) =>
                  handleEditChange("user_prefer_url", e.target.value)
                }
              />
              <Select
                label={t('authorization_level')}
                variant="bordered"
                placeholder={t('select_authorization_level')}
                selectedKeys={editUser.authorization_level}
                onSelectionChange={(keys) =>
                  handleEditChange("authorization_level", new Set(keys))
                }
              >
                {authorizationLevelOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </Select>
              {Object.keys(editUser.accounts_ids).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <Input
                    label={`${t('account_id')}: ${key}`}
                    value={editUser.accounts_ids[key]}
                    onChange={(e) => handleAccountIDChange(key, e.target.value)}
                    fullWidth
                  />
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => handleRemoveAccountID(key)}
                  >
                    {t('remove')}
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  label={t('new_account_type')}
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value)}
                />
                <Input
                  label={t('new_account_id')}
                  value={newAccountID}
                  onChange={(e) => setNewAccountID(e.target.value)}
                />
                <Button onPress={handleAddAccountID}>{t('add')}</Button>
              </div>
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
                {t('delete_confirmation', { username: userToDelete?.username })}
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
              <Button color="primary" onPress={handleDeleteUser}>
                {t('confirm')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default AdminUsersTable;
