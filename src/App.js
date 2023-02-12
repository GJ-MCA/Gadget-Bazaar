import './App.css';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Home } from './components/Home';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
    <BrowserRouter>
     <Header/>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
      </Routes>
     <Footer/>
    </BrowserRouter>
    </div>
  );
}

export default App;
