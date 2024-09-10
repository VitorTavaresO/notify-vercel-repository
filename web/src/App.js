import './App.css';
import PrivateRouter from './components/PrivateRouter.jsx';

import Login from './pages/login/login.jsx';

import DefaultLayout from "./components/DefaultLayout";
import SimpleLayout from "./components/SimpleLayout";

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path='/login' 
            element={
              <SimpleLayout>
                <Login/>
              </SimpleLayout>
            } />
            <Route element={<PrivateRouter />}>
              <Route
              path="/"
              element={
                <DefaultLayout>
                  <Home />
                </DefaultLayout>
              }/>
            </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
