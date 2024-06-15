import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useParams,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./components/Profile/Settings";
import Brawlhalla from "./pages/Brawlhalla";
import CallOfDuty from "./pages/CallOfDuty";
import OverWatch from "./pages/OverWatch";
import Fortnite from "./pages/Fortnite";
import SaudiDeal from "./pages/SaudiDeal";
import UserAccount from "./pages/UserAccount";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Uploads from "./components/Profile/Uploads";
import Explore from "./pages/Explore";
import EditProfile from "./components/Profile/EditProfile";
import SearchUsers from "./pages/SearchUsers";
import Translate from "./pages/Translate";
import AdminDashbord from "./pages/AdminDashboard";
import WatchVideo from "./components/Explore/WatchVideo";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import { checkAuthTimeout, logout } from "./ducks/authSlice";

const AppRoutes = () => {
  const { t } = useTranslation();
  const { isLoggedIn, authorizationLevel, lastLoginTime, username } =
    useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkAuthTimeout());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn && lastLoginTime) {
      dispatch(logout());
      alert(t("alert_inactivityLogout"));
    }
  }, [isLoggedIn, lastLoginTime, dispatch, t]);

  const ProtectedRoute = ({ children, requiredAuthLevel }) => {
    if (!isLoggedIn) {
      return (
        <Navigate
          to="/not-found"
          state={{ reason: t("auth_loginRequired") }}
        />
      );
    }
    if (requiredAuthLevel && ![requiredAuthLevel, "ADMIN", "Moderator"].includes(authorizationLevel)) {
      return (
        <Navigate
          to="/not-found"
          state={{ reason: t("auth_notAuthorized") }}
        />
      );
    }
    return children;
  };

  const AdminProtectedRoute = ({ children }) => {
    if (!isLoggedIn || !["ADMIN", "Moderator"].includes(authorizationLevel)) {
      return (
        <Navigate
          to="/not-found"
          state={{ reason: t("auth_adminOnly") }}
        />
      );
    }
    return children;
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* User Account and Profile Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredAuthLevel="User">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-account"
          element={
            <ProtectedRoute requiredAuthLevel="User">
              <UserAccount mode="my-account" username={username} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:username"
          element={<ProtectedRoute requiredAuthLevel="User"><UserAccount mode="view-profile" /></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredAuthLevel="User">
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute requiredAuthLevel="User">
              <Uploads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editprofile"
          element={
            <ProtectedRoute requiredAuthLevel="User">
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/searchusers"
          element={
            <ProtectedRoute requiredAuthLevel="User">
              <SearchUsers />
            </ProtectedRoute>
          }
        />

        {/* Game Pages */}
        <Route path="/brawlhalla" element={<ProtectedRoute requiredAuthLevel="User"><Brawlhalla /></ProtectedRoute>} />
        <Route path="/callofduty" element={<ProtectedRoute requiredAuthLevel="User"><CallOfDuty /></ProtectedRoute>} />
        <Route path="/overwatch" element={<ProtectedRoute requiredAuthLevel="User"><OverWatch /></ProtectedRoute>} />
        <Route path="/fortnite" element={<ProtectedRoute requiredAuthLevel="User"><Fortnite /></ProtectedRoute>} />
        <Route path="/saudideal" element={<ProtectedRoute requiredAuthLevel="User"><SaudiDeal /></ProtectedRoute>} />
        <Route path="/translate" element={<ProtectedRoute requiredAuthLevel="User"><Translate /></ProtectedRoute>} />

        {/* Explore and Watch Video */}
        <Route path="/explore" element={<ProtectedRoute requiredAuthLevel="User"><Explore /></ProtectedRoute>} />
        <Route path="/watchvideo/:videoId" element={<ProtectedRoute requiredAuthLevel="User"><WatchVideo /></ProtectedRoute>} />

        <Route
          path="/admindashbord"
          element={
            <AdminProtectedRoute>
              <AdminDashbord />
            </AdminProtectedRoute>
          }
        />

        {/* Not Found Route */}
        <Route path="/not-found" element={<NotFound />} />
        <Route
          path="*"
          element={
            <Navigate
              to="/not-found"
              state={{ reason: t("notFound_pageNotFound") }}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
