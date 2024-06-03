import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import { LayoutWrapper, Menu, MenuItem } from "./layout.styled";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("");

  const onLogOut = async () => {
    const ok = confirm("Are you sure you want to log out?");
    if (ok) {
      auth.signOut();
      navigate("/login");
    }
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedItem("home");
    } else if (location.pathname === "/profile") {
      setSelectedItem("profile");
    } else if (location.pathname === "/likes") {
      setSelectedItem("likes");
    } else if (location.pathname === "bookmarks") {
      setSelectedItem("bookmarks");
    }
  }, [location]);

  return (
    <LayoutWrapper>
      <Menu>
        <Link to="/">
          <MenuItem onClick={() => setSelectedItem("home")}>
            <img
              width={50}
              src="main-logo.png"
              alt="Dev Connect Logo"
              aria-label="Dev Connect Logo"
            />
          </MenuItem>
        </Link>
        <Link to="/">
          <MenuItem onClick={() => setSelectedItem("home")}>
            {selectedItem === "home" ? (
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Home"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                />
              </svg>
            ) : (
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Home"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            )}
          </MenuItem>
        </Link>

        <Link to="/profile">
          <MenuItem onClick={() => setSelectedItem("profile")}>
            {selectedItem === "profile" ? (
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Profile Page"
              >
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
            ) : (
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Profile Page"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            )}
          </MenuItem>
        </Link>
        <Link to="/likes">
          <MenuItem onClick={() => setSelectedItem("likes")}>
            {selectedItem === "likes" ? (
              <FaHeart aria-label="Liked Posts Page" size={22} />
            ) : (
              <FaRegHeart size={22} />
            )}
          </MenuItem>
        </Link>
        <Link to="/bookmarks">
          <MenuItem onClick={() => setSelectedItem("bookmarks")}>
            {selectedItem === "bookmarks" ? (
              <FaBookmark aria-label="Bookmarked Posts Page" size={22} />
            ) : (
              <FaRegBookmark size={22} />
            )}
          </MenuItem>
        </Link>
        <MenuItem onClick={onLogOut}>
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Logout"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
            />
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
            />
          </svg>
        </MenuItem>
      </Menu>
      <Outlet />
    </LayoutWrapper>
  );
}
