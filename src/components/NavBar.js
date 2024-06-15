import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Avatar,
} from "@nextui-org/react";
import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
  Gaming,
} from "./Icons.jsx";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../ducks/authSlice";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
    gaming: <Gaming className="text-primary" fill="currentColor" size={30} />,
  };

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, authorizationLevel } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    { name: t("home"), path: "/" },
    { name: t("profile"), path: "/profile" },
    { name: t("explore"), path: "/explore" },
    { name: t("search_users"), path: "/searchusers" },
    { name: t("my_account"), path: "/my-account" },
    { name: t("translate"), path: "/translate" },
  ];

  const gameItems = [
    {
      name: "Brawlhalla",
      path: "/brawlhalla",
      description: t("brawlhalla_description"),
      icon: icons.scale,
    },
    {
      name: "Call of Duty",
      path: "/callofduty",
      description: t("callofduty_description"),
      icon: icons.activity,
    },
    {
      name: "Overwatch",
      path: "/overwatch",
      description: t("overwatch_description"),
      icon: icons.flash,
    },
    {
      name: "Fortnite",
      path: "/fortnite",
      description: t("fortnite_description"),
      icon: icons.server,
    },
    {
      name: "Saudi Deal",
      path: "/saudideal",
      description: t("saudideal_description"),
      icon: icons.user,
    },
  ];

  const handleMenuItemClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <Navbar shouldHideOnScroll onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? t("close_menu") : t("open_menu")}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Avatar src="/images/logo3.png" size="md" className="mr-5" />
          <p className="font-bold text-inherit">M7ZM</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={icons.chevron}
                radius="sm"
                variant="light"
              >
                {t("features")}
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label={t("m7zm_features")}
            className="w-[340px]"
            itemClasses={{ base: "gap-4" }}
          >
            {gameItems.map((item, index) => (
              <DropdownItem
                key={index}
                description={item.description}
                startContent={item.icon}
                onClick={() => handleMenuItemClick(item.path)}
              >
                {item.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {menuItems.map((item, index) => (
          <NavbarItem key={index} isActive={location.pathname === item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.name}
            </NavLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {isLoggedIn &&
          (authorizationLevel === "ADMIN" ||
            authorizationLevel === "Moderator") && (
            <NavbarItem>
              <Button
                onClick={() => navigate("/admindashbord")}
                color="warning"
                variant="flat"
                className="nav-link"
              >
                {t("dashboard")}
              </Button>
            </NavbarItem>
          )}
        {!isLoggedIn ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {t("login")}
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={NavLink}
                to="/signup"
                color="primary"
                variant="flat"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {t("signup")}
              </Button>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Button
              onClick={handleLogout}
              color="danger"
              variant="flat"
              className="nav-link"
            >
              {t("logout")}
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <NavLink
              to={item.path}
              className="w-full nav-link"
              activeClassName="active"
            >
              {item.name}
            </NavLink>
          </NavbarMenuItem>
        ))}
        {gameItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <NavLink
              to={item.path}
              className="w-full nav-link"
              activeClassName="active"
            >
              {item.name}
            </NavLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
