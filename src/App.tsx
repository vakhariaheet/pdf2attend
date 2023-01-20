
import { Route,Routes } from 'react-router-dom';
import './App.scss';
import Footer from './Components/Footer/Footer';
import Navbar from './Components/Navbar/Navbar';
import GetPDF from './Pages/GetPDF/GetPDF';
import OCRPDF from './Pages/OCRPDF/OCRPDF';

function App() {
	
	return (
    <div className='App'>
      <Navbar/>
      <Routes>
        
        <Route path='/' element={<GetPDF />} />
        <Route path='/pdf-ocr' element={<OCRPDF />} />
      </Routes>
      <Footer/>
		</div>
	);
}

export default App;
