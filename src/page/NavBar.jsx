import { NavLink, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchFollowingDetails } from "../features/auth/channelSlice";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";

const navItems = [
  {
    to: "/",
    label: "Лента",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    to: "/create",
    label: "Создать",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
  },
  {
    to: "/profile",
    label: "Профиль",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
];

const SidebarNav = ({ isOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { followingDetails } = useSelector((state) => state.channel);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchFollowingDetails(user.uid));
    }
  }, [user, dispatch]);

  if (["/signup", "/login"].includes(location.pathname)) return null;

  return (
    <>
      {/* DESKTOP NAV (слева) */}
      <div
        className={`fixed top-[64px] hidden sm:block left-0 h-full bg-[var(--bg-color)] dark:bg-[var(--bg-color)] shadow-md z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col py-5 px-7 gap-6 sm:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-lg font-medium px-2 py-1 hover:bg-[#acc3db] hover:!text-white rounded-2xl transition-all ${
                  isActive
                    ? "!text-white rounded-2xl transition-all bg-[#acc3db]"
                    : "text-[var(--text-color)]"
                }`
              }
            >
              <div className="flex gap-2 text-1xl">
                {item.icon}
                {item.label}
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="border-gray-300 border-t mt-3 px-5">
          <span className="flex text-sm font-semibold mb-2">Following</span>
          <ul className="space-y-2">
            {followingDetails?.length === 0 && (
              <li className="text-gray-500 text-sm">Нет подписок</li>
            )}
            {followingDetails?.map((ch) => (
              <li key={ch.id}>
                <Link
                  to={`/channel/${ch.id}`}
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
                >
                  <img
                    src={ch.avatar || avatarDef}
                    alt={ch.title}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm">{ch.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MOBILE NAV (внизу) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-color)] dark:bg-[var(--bg-color)] shadow-t z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${
                  isActive ? "text-[var(--text-color)]" : "text-gray-600"
                }`
              }
            >
              {item.icon}
             {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default SidebarNav;
