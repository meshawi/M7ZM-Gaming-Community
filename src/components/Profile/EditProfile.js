import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Divider,
  Tooltip,
  Spinner,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Image,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

const EditProfile = () => {
  const {
    userId,
    username: initialUsername,
    profilePicture: initialProfilePicture,
  } = useSelector((state) => state.auth);
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [profilePicture, setProfilePicture] = useState(null);
  const [accounts, setAccounts] = useState([
    { accountType: "", accountId: "" },
  ]);
  const [achievedGames, setAchievedGames] = useState([]);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [games, setGames] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");
  const [profilePictureErrorMessage, setProfilePictureErrorMessage] =
    useState("");
  const [profilePictureSuccessMessage, setProfilePictureSuccessMessage] =
    useState("");
  const [loadingProfilePicture, setLoadingProfilePicture] = useState(false);
  const [accountIdsErrorMessage, setAccountIdsErrorMessage] = useState("");
  const [accountIdsSuccessMessage, setAccountIdsSuccessMessage] = useState("");
  const [loadingAccountIds, setLoadingAccountIds] = useState(false);
  const [achievedGamesErrorMessage, setAchievedGamesErrorMessage] =
    useState("");
  const [achievedGamesSuccessMessage, setAchievedGamesSuccessMessage] =
    useState("");
  const [loadingAchievedGames, setLoadingAchievedGames] = useState(false);
  const [favoriteGamesErrorMessage, setFavoriteGamesErrorMessage] =
    useState("");
  const [favoriteGamesSuccessMessage, setFavoriteGamesSuccessMessage] =
    useState("");
  const [loadingFavoriteGames, setLoadingFavoriteGames] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("https://api.aleshawi.me/api/games");
        const data = await response.json();
        if (data.status === "success") {
          setGames(data.games);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  const handleUpdateUsernamePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/m7zm_user/update-username-password/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setSuccessMessage(data.message);
      } else {
        setErrorMessage(t('update_failed'));
      }
    } catch (error) {
      setErrorMessage(t('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileErrorMessage("");
    setProfileSuccessMessage("");

    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/m7zm_user/update-fullname-bio-visibility/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: fullName,
            bio,
            profile_visibility: profileVisibility,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setProfileSuccessMessage(data.message);
      } else {
        setProfileErrorMessage(t('update_failed'));
      }
    } catch (error) {
      setProfileErrorMessage(t('error_occurred'));
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      // 10MB limit
      setProfilePicture(file);
      setProfilePictureErrorMessage("");
    } else {
      setProfilePictureErrorMessage(t('file_size_exceeded_10m'));
    }
  };

  const handleUpdateProfilePicture = async (e) => {
    e.preventDefault();
    setLoadingProfilePicture(true);
    setProfilePictureErrorMessage("");
    setProfilePictureSuccessMessage("");

    const formData = new FormData();
    formData.append("profile_picture", profilePicture);

    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/m7zm_user/update-profile-picture/${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setProfilePictureSuccessMessage(data.message);
      } else {
        setProfilePictureErrorMessage(t('update_failed'));
      }
    } catch (error) {
      setProfilePictureErrorMessage(t('error_occurred'));
    } finally {
      setLoadingProfilePicture(false);
    }
  };

  const handleAccountChange = (index, field, value) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index][field] = value;
    setAccounts(updatedAccounts);
  };

  const handleAddAccount = () => {
    setAccounts([...accounts, { accountType: "", accountId: "" }]);
  };

  const handleRemoveAccount = (index) => {
    const updatedAccounts = accounts.filter((_, i) => i !== index);
    setAccounts(updatedAccounts);
  };

  const handleUpdateAccountIds = async (e) => {
    e.preventDefault();
    setLoadingAccountIds(true);
    setAccountIdsErrorMessage("");
    setAccountIdsSuccessMessage("");

    const accountsIds = accounts.reduce((acc, account) => {
      acc[account.accountType] = account.accountId;
      return acc;
    }, {});

    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/m7zm_user/update-account-ids/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accounts_ids: accountsIds }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setAccountIdsSuccessMessage(data.message);
      } else {
        setAccountIdsErrorMessage(t('update_failed'));
      }
    } catch (error) {
      setAccountIdsErrorMessage(t('error_occurred'));
    } finally {
      setLoadingAccountIds(false);
    }
  };

  const handleUpdateAchievedGames = async (e) => {
    e.preventDefault();
    setLoadingAchievedGames(true);
    setAchievedGamesErrorMessage("");
    setAchievedGamesSuccessMessage("");

    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/m7zm_user/update-achieved-games/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ achieved_games: achievedGames }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setAchievedGamesSuccessMessage(data.message);
      } else {
        setAchievedGamesErrorMessage(t('update_failed'));
      }
    } catch (error) {
      setAchievedGamesErrorMessage(t('error_occurred'));
    } finally {
      setLoadingAchievedGames(false);
    }
  };

  const handleFavoriteGameChange = (index, field, value) => {
    const updatedFavoriteGames = [...favoriteGames];
    updatedFavoriteGames[index][field] = value;
    setFavoriteGames(updatedFavoriteGames);
  };

  const handleAddFavoriteGame = () => {
    if (favoriteGames.length < 3) {
      setFavoriteGames([
        ...favoriteGames,
        { gameId: "", rank: favoriteGames.length + 1 },
      ]);
    }
  };

  const handleRemoveFavoriteGame = (index) => {
    const updatedFavoriteGames = favoriteGames.filter((_, i) => i !== index);
    setFavoriteGames(
      updatedFavoriteGames.map((game, i) => ({ ...game, rank: i + 1 }))
    );
  };

  const handleUpdateFavoriteGames = async (e) => {
    e.preventDefault();
    setLoadingFavoriteGames(true);
    setFavoriteGamesErrorMessage("");
    setFavoriteGamesSuccessMessage("");

    const favoriteGamesData = favoriteGames.map((game) => ({
      game_id: parseInt(game.gameId),
      rank: game.rank,
    }));

    try {
      const response = await fetch(
        `https://api.aleshawi.me/api/m7zm_user/update-favorite-games/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ favorite_games: favoriteGamesData }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setFavoriteGamesSuccessMessage(data.message);
      } else {
        setFavoriteGamesErrorMessage(t('update_failed'));
      }
    } catch (error) {
      setFavoriteGamesErrorMessage(t('error_occurred'));
    } finally {
      setLoadingFavoriteGames(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Update Username and Password Card */}
      <Card className="max-w-md w-full mx-auto shadow-lg mb-8">
        <CardHeader className="flex flex-col items-center pb-0 pt-4 px-4">
          <h2 className="text-2xl font-bold">{t('update_username_password')}</h2>
        </CardHeader>
        <Divider />
        <CardBody className="py-6">
          <form onSubmit={handleUpdateUsernamePassword}>
            <Input
              isClearable
              label={t('username')}
              variant="bordered"
              placeholder={t('enter_new_username')}
              className="mb-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label={t('password')}
              variant="bordered"
              placeholder={t('enter_new_password')}
              type="password"
              className="mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && <p className="mb-4 text-danger">{errorMessage}</p>}
            {successMessage && (
              <p className="mb-4 text-success">{successMessage}</p>
            )}
            <Tooltip content={t('click_to_update')} color="primary">
              <Button
                color="primary"
                className="w-full font-bold py-2 px-4 rounded"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner size="small" /> : t('update')}
              </Button>
            </Tooltip>
          </form>
        </CardBody>
      </Card>

      {/* Update Full Name, Bio, and Profile Visibility Card */}
      <Card className="max-w-md w-full mx-auto shadow-lg mb-8">
        <CardHeader className="flex flex-col items-center pb-0 pt-4 px-4">
          <h2 className="text-2xl font-bold">
            {t('update_fullname_bio_visibility')}
          </h2>
        </CardHeader>
        <Divider />
        <CardBody className="py-6">
          <form onSubmit={handleUpdateProfile}>
            <Input
              isClearable
              label={t('full_name')}
              variant="bordered"
              placeholder={t('enter_full_name')}
              className="mb-4"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Textarea
              label={t('bio')}
              variant="bordered"
              placeholder={t('enter_bio')}
              className="mb-4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <Input
              label={t('profile_visibility')}
              variant="bordered"
              placeholder={t('enter_profile_visibility')}
              className="mb-4"
              value={profileVisibility}
              onChange={(e) => setProfileVisibility(e.target.value)}
            />
            {profileErrorMessage && (
              <p className="mb-4 text-danger">{profileErrorMessage}</p>
            )}
            {profileSuccessMessage && (
              <p className="mb-4 text-success">{profileSuccessMessage}</p>
            )}
            <Tooltip content={t('click_to_update')} color="primary">
              <Button
                color="primary"
                className="w-full font-bold py-2 px-4 rounded"
                type="submit"
                disabled={loadingProfile}
              >
                {loadingProfile ? <Spinner size="small" /> : t('update')}
              </Button>
            </Tooltip>
          </form>
        </CardBody>
      </Card>

      {/* Update Profile Picture Card */}
      <Card className="max-w-md w-full mx-auto shadow-lg mb-8">
        <CardHeader className="flex flex-col items-center pb-0 pt-4 px-4">
          <h2 className="text-2xl font-bold">{t('update_profile_picture')}</h2>
        </CardHeader>
        <Divider />
        <CardBody className="py-6">
          <form onSubmit={handleUpdateProfilePicture}>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                required
              />
            </div>
            {profilePictureErrorMessage && (
              <p className="mb-4 text-danger">{profilePictureErrorMessage}</p>
            )}
            {profilePictureSuccessMessage && (
              <p className="mb-4 text-success">
                {profilePictureSuccessMessage}
              </p>
            )}
            <Tooltip content={t('click_to_update')} color="primary">
              <Button
                color="primary"
                className="w-full font-bold py-2 px-4 rounded"
                type="submit"
                disabled={loadingProfilePicture}
              >
                {loadingProfilePicture ? <Spinner size="small" /> : t('update')}
              </Button>
            </Tooltip>
          </form>
        </CardBody>
      </Card>

      {/* Update Account IDs Card */}
      <Card className="max-w-md w-full mx-auto shadow-lg mb-8">
        <CardHeader className="flex flex-col items-center pb-0 pt-4 px-4">
          <h2 className="text-2xl font-bold">{t('update_account_ids')}</h2>
        </CardHeader>
        <Divider />
        <CardBody className="py-6">
          <form onSubmit={handleUpdateAccountIds}>
            {accounts.map((account, index) => (
              <div key={index} className="mb-4 flex items-center gap-4">
                <Input
                  label={t('account_type')}
                  variant="bordered"
                  placeholder={t('enter_account_type')}
                  className="flex-1"
                  value={account.accountType}
                  onChange={(e) =>
                    handleAccountChange(index, "accountType", e.target.value)
                  }
                />
                <Input
                  label={t('account_id')}
                  variant="bordered"
                  placeholder={t('enter_account_id')}
                  className="flex-1"
                  value={account.accountId}
                  onChange={(e) =>
                    handleAccountChange(index, "accountId", e.target.value)
                  }
                />
                <Button
                  auto
                  flat
                  color="error"
                  onClick={() => handleRemoveAccount(index)}
                >
                  {t('remove')}
                </Button>
              </div>
            ))}
            <Button auto flat color="primary" onClick={handleAddAccount}>
              {t('add_account')}
            </Button>
            {accountIdsErrorMessage && (
              <p className="mb-4 text-danger">{accountIdsErrorMessage}</p>
            )}
            {accountIdsSuccessMessage && (
              <p className="mb-4 text-success">{accountIdsSuccessMessage}</p>
            )}
            <Tooltip content={t('click_to_update')} color="primary">
              <Button
                color="primary"
                className="w-full font-bold py-2 px-4 rounded mt-4"
                type="submit"
                disabled={loadingAccountIds}
              >
                {loadingAccountIds ? <Spinner size="small" /> : t('update')}
              </Button>
            </Tooltip>
          </form>
        </CardBody>
      </Card>

      {/* Update Achieved Games Card */}
      <Card className="max-w-md w-full mx-auto shadow-lg mb-8">
        <CardHeader className="flex flex-col items-center pb-0 pt-4 px-4">
          <h2 className="text-2xl font-bold">{t('update_achieved_games')}</h2>
        </CardHeader>
        <Divider />
        <CardBody className="py-6">
          <form onSubmit={handleUpdateAchievedGames}>
            <CheckboxGroup
              label={t('achieved_games')}
              value={achievedGames}
              onChange={setAchievedGames}
              className="mb-4"
            >
              {games.map((game) => (
                <Checkbox
                  key={game.game_id}
                  value={game.game_id.toString()}
                  className="mb-2"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      isZoomed
                      width={150}
                      alt={game.game_name}
                      src={game.thumbnail}
                      className="mr-2"
                    />
                    <span className="text-lg font-medium">
                      {game.game_name}
                    </span>
                  </div>
                </Checkbox>
              ))}
            </CheckboxGroup>
            {achievedGamesErrorMessage && (
              <p className="mb-4 text-danger">{achievedGamesErrorMessage}</p>
            )}
            {achievedGamesSuccessMessage && (
              <p className="mb-4 text-success">{achievedGamesSuccessMessage}</p>
            )}
            <Tooltip content={t('click_to_update')} color="primary">
              <Button
                color="primary"
                className="w-full font-bold py-2 px-4 rounded mt-4"
                type="submit"
                disabled={loadingAchievedGames}
              >
                {loadingAchievedGames ? <Spinner size="small" /> : t('update')}
              </Button>
            </Tooltip>
          </form>
        </CardBody>
      </Card>

      {/* Update Favorite Games Card */}
      <Card className="max-w-md w-full mx-auto shadow-lg">
        <CardHeader className="flex flex-col items-center pb-0 pt-4 px-4">
          <h2 className="text-2xl font-bold">{t('update_top_3_favorite_games')}</h2>
        </CardHeader>
        <Divider />
        <CardBody className="py-6">
          <form onSubmit={handleUpdateFavoriteGames}>
            {favoriteGames.map((game, index) => (
              <div key={index} className="mb-4 flex items-center gap-4">
                <Select
                  label={t('game')}
                  value={game.gameId}
                  onChange={(e) =>
                    handleFavoriteGameChange(index, "gameId", e.target.value)
                  }
                  className="flex-1"
                >
                  {games.map((game) => (
                    <SelectItem
                      key={game.game_id}
                      value={game.game_id.toString()}
                    >
                      <span className="text-lg font-medium">
                        {game.game_name}
                      </span>
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label={t('rank')}
                  type="number"
                  value={game.rank}
                  min={1}
                  max={3}
                  readOnly
                  className="flex-1"
                />
                <Button
                  auto
                  flat
                  color="error"
                  onClick={() => handleRemoveFavoriteGame(index)}
                >
                  {t('remove')}
                </Button>
              </div>
            ))}
            {favoriteGames.length < 3 && (
              <Button auto flat color="primary" onClick={handleAddFavoriteGame}>
                {t('add_game')}
              </Button>
            )}
            {favoriteGamesErrorMessage && (
              <p className="mb-4 text-danger">{favoriteGamesErrorMessage}</p>
            )}
            {favoriteGamesSuccessMessage && (
              <p className="mb-4 text-success">{favoriteGamesSuccessMessage}</p>
            )}
            <Tooltip content={t('click_to_update')} color="primary">
              <Button
                color="primary"
                className="w-full font-bold py-2 px-4 rounded mt-4"
                type="submit"
                disabled={loadingFavoriteGames}
              >
                {loadingFavoriteGames ? <Spinner size="small" /> : t('update')}
              </Button>
            </Tooltip>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditProfile;
