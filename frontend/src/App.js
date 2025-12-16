import Navbar from "./components/Navbar/Navbar";
import Overview from "./components/OverviewPage/Overview";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Transaction from './components/TransactionPage/Transaction';
import News from './components/NewsPage/News';
import NotFoundPage from './components/NotFound/NotFound';

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="mainContent">
        <div className="container">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/news" element={<News />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
