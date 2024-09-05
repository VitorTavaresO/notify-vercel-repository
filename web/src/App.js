import "./App.css";
import Register from "./pages/register/register.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import DefaultLayout from "./components/DefaultLayout";
import SimpleLayout from "./components/SimpleLayout";

import Home from "./pages/home/Home";
import EmployeeList from './pages/employeeList/EmployeeList';
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <DefaultLayout>
                <Home />
              </DefaultLayout>
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
          path='/employee-list'
          element={
            <DefaultLayout>
                <EmployeeList/>
            </DefaultLayout>
          }
          />
          <Route
            path="/profile"
            element={
              <DefaultLayout>
                <Profile/>
              </DefaultLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
