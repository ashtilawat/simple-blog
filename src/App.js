import './styles/App.css';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ContentList } from './pages/ContentList';
import { ContentDetail } from './pages/ContentDetail';
import { JobsBoard } from './pages/JobsBoard';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/content" replace />} />
        <Route path="/content" element={<ContentList />} />
        <Route path="/content/:id" element={<ContentDetail />} />
        <Route path="/jobs" element={<JobsBoard />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
