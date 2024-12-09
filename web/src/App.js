import "./App.css";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import Home from "./pages/home/Home";
import EmployeeList from "./pages/employeeList/EmployeeList";
import Profile from "./pages/profile/Profile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import SimpleLayout from "./components/SimpleLayout";
import PrivateRouter from "./components/PrivateRouter.jsx";
import ManagerRouter from "./components/ManagerRouter.jsx";
import AnnouncementList from "./pages/announcementList/AnnouncementList.jsx";
import GuardianList from "./pages/guardianList/GuardianList.jsx";
import RegisterConfirmation from "./pages/registerConfirmation/RegisterConfirmation.jsx";

function App() {
  return (
    <>
      <Router>
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
          <Route
            path="/email-validation/:email/:code"
            element={
              <SimpleLayout>
                <RegisterConfirmation />
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
          <Route path="/employee-list" element={<ManagerRouter />}>
            <Route
              path=""
              element={
                <DefaultLayout>
                  <EmployeeList />
                </DefaultLayout>
              }
            />
          </Route>
          <Route path="/announcement-list" element={<ManagerRouter />}>
            <Route
              path=""
              element={
                <DefaultLayout>
                  {" "}
                  <AnnouncementList />{" "}
                </DefaultLayout>
              }
            />
          </Route>
          <Route path="/guardian-list" element={<ManagerRouter />}>
            <Route
              path=""
              element={
                <DefaultLayout>
                  {" "}
                  <GuardianList />{" "}
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
      </Router>
    </>
  );
}

export default App;
