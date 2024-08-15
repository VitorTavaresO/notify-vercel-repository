import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployeeList from './pages/employeeList/EmployeeList';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/employee-list" element={<EmployeeList/>}/>
      </Routes> 
    </BrowserRouter>
    </>
  );
}

export default App;
