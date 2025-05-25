import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Explore from './Components/Explore';
import Compare from './Components/Compare';
import Quiz from './Components/Quiz';
import About from './Components/About';
import { useSelector } from 'react-redux';
import type { RootState } from './Store';

export default function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  return (
    <Router>
      <Navbar />
      <div className={`h-screen ${theme === 0 ? 'bg-white text-black' : 'bg-black text-white'}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/compare' element={<Compare />} />
          <Route path='/quiz' element={<Quiz />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}
