import './styles/App.css';
import { Header } from './components/Header/Header';
import { Content } from './components/Content/Content';
import { Footer } from './components/Footer/Footer';
import { Chatbot } from './components/Chatbot/Chatbot';

function App() {
  return (
    <div className="App">
      <Header />
      <Content />
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
