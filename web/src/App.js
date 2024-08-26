import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DefaultLayout from './components/DefaultLayout';
import SimpleLayout from './components/SimpleLayout';

import Home from './pages/home/Home';
import EmployeeList from './pages/employeeList/EmployeeList';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DefaultLayout><Home/></DefaultLayout>} />
          <Route path='/page1' element={<DefaultLayout><Home/></DefaultLayout>} />
          <Route path='/page2' element={<SimpleLayout><Home/></SimpleLayout>} />
          <Route path='/employee-list' element={<DefaultLayout><EmployeeList/></DefaultLayout>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
