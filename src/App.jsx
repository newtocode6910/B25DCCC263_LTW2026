import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Questions from './pages/Questions';
import QuestionDetail from './pages/QuestionDetail';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import NotFound from './pages/NotFound';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home playerName={playerName} setPlayerName={setPlayerName} />} />
        
        <Route 
          path="play" 
          element={
            playerName ? <Play playerName={playerName} questions={questions} /> : <Navigate to="/" replace />
          } 
        />
        
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History />} />
        <Route path="questions" element={<Questions questions={questions} loading={loading} error={error} />} />
        <Route path="questions/:id" element={<QuestionDetail questions={questions} loading={loading} error={error} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
