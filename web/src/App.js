import "./App.css";
import Login from "./pages/login/login.jsx";
import Register from "./pages/register/register.jsx";
import Home from "./pages/home/Home";
import EmployeeList from "./pages/employeeList/EmployeeList";
import Profile from "./pages/profile/Profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import SimpleLayout from "./components/SimpleLayout";
import PrivateRouter from "./components/PrivateRouter.jsx";
import AnnouncementList from "./pages/announcementList/AnnouncementList.jsx";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <SimpleLayout>
                <Login />
              </SimpleLayout>
            }
          />
          <Route
            path="/register"
            element={
              <SimpleLayout>
                <Register />
              </SimpleLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <SimpleLayout>
                <ForgotPassword />
              </SimpleLayout>
            }
          />
          <Route element={<PrivateRouter />}>
            <Route
              path="/"
              element={
                <DefaultLayout>
                  <Home />
                </DefaultLayout>
              }
            />
          </Route>
          <Route element={<PrivateRouter />}>
            <Route
              path="/announcement-list"
              element={
                <DefaultLayout>
                  <AnnouncementList />
                </DefaultLayout>
              }
            />
          </Route>
          <Route element={<PrivateRouter />}>
            <Route
              path="/employee-list"
              element={
                <DefaultLayout>
                  <EmployeeList />
                </DefaultLayout>
              }
            />
          </Route>
          <Route element={<PrivateRouter />}>
            <Route
              path="/profile"
              element={
                <DefaultLayout>
                  <Profile />
                </DefaultLayout>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
