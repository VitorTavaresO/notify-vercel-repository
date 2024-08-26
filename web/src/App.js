import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DefaultLayout from './components/DefaultLayout';
import SimpleLayout from './components/SimpleLayout';

import Home from './pages/home/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DefaultLayout><Home/></DefaultLayout>} />
          <Route path='/page1' element={<DefaultLayout><Home/></DefaultLayout>} />
          <Route path='/page2' element={<SimpleLayout><Home/></SimpleLayout>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
