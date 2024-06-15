import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../ducks/authSlice";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Button,
  Tooltip,
  Input,
} from "@nextui-org/react";
import { EyeFilledIcon } from "../components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/icons/EyeSlashFilledIcon";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://api.aleshawi.me/api/m7zm-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.status === "success") {
        if (data.user_status === "active") {
          dispatch(
            login({
              username: data.username,
              userId: data.user_id,
              profilePicture: data.profile_picture,
              authorizationLevel: data.authorization_level,
            })
          );
          navigate("/");
        } else if (data.user_status === "inactive") {
          navigate("/not-found", {
            state: { reason: t("inactive_account") },
          });
        } else if (data.user_status === "banned") {
          navigate("/not-found", {
            state: { reason: t("banned_account") },
          });
        }
      } else {
        setErrorMessage(t("login_failed"));
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage(t("login_error"));
    }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="max-w-sm w-full mx-4 shadow-lg">
        <CardHeader className="flex flex-col items-center pb-0 pt-4 px-4 ">
          <Image
            alt={t("app_logo")}
            height={50}
            radius="sm"
            src="/images/logo.png"
            width={50}
          />
          <h2 className="text-2xl font-bold mt-2">{t("login_account")}</h2>
        </CardHeader>
        <Divider />
        <CardBody className="py-6">
          <Input
            isClearable
            label={t("username")}
            variant="bordered"
            placeholder={t("enter_username")}
            className="mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label={t("password")}
            variant="bordered"
            placeholder={t("enter_password")}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isPasswordVisible ? "text" : "password"}
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <p className="mb-4 text-danger">{errorMessage}</p>}
          <div className="flex flex-col mb-4 space-y-2">
            <Link href="#" color="primary">
              {t("forgot_password")}
            </Link>
          </div>
          <Tooltip color="primary" content={t("click_to_login")}>
            <Button
              color="primary"
              className="w-full font-bold py-2 px-4 rounded"
              onClick={handleLogin}
            >
              {t("login")}
            </Button>
          </Tooltip>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-center py-4">
          <p>
            {t("no_account")}{" "}
            <Link href="/signup" color="primary">
              {t("sign_up")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
