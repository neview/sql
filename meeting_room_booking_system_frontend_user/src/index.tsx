// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//     <App />
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import ReactDOM from "react-dom/client";
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter,
  Link,
  Outlet,
} from "react-router-dom";
import { Login } from "./page/login/Login";
import { Register } from "./page/register/Register";
import { UpdatePassword } from "./page/update_password/UpdatePassword";
import { Index } from "./page/index";
import { UpdateInfo } from "./page/update_info/UpdateInfo";
import { MeetingRoomList } from "./page/meeting_room_list/MeetingRoomList";
import { BookingHistory } from "./page/booking_history/BookingHistory";
import { Menu } from "./page/menu/Menu";
function Aaa() {
  return <div>aaa</div>;
}

function Bbb() {
  return <div>bbb</div>;
}

function Layout() {
  return (
    <div>
      <div>
        <Link to="/aaa">to aaa</Link>
      </div>
      <div>
        <Link to="/bbb">to bbb</Link>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

function ErrorPage() {
  return <div>error</div>;
}
const routes = [
  {
    path: "/",
    element: <Index></Index>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "update_info",
        element: <UpdateInfo />,
      },
      {
        path: "/",
        element: <Menu />,
        children: [
          {
            path: "/",
            element: <MeetingRoomList />,
          },
          {
            path: "meeting_room_list",
            element: <MeetingRoomList />,
          },
          {
            path: "booking_history",
            element: <BookingHistory />,
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "update_password",
    element: <UpdatePassword />,
  },
];
export const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<RouterProvider router={router} />);
