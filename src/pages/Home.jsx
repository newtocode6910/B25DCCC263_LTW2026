import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName, history }) => {
  const [localName, setLocalName] = useState(playerName || "");
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (localName.trim()) {
      setPlayerName(localName.trim());
      navigate("/play");
    }
  };

  const highestScoreRecord = history && history.length > 0 
    ? [...history].sort((a, b) => b.score - a.score)[0]
    : null;

  return (
    <div>
      <h2>Rung chuông vàng</h2>
      
      {highestScoreRecord && (
        <h4 style={{ color: '#dc3545' }}>
          Kỷ lục: {highestScoreRecord.score} điểm - {highestScoreRecord.name}
        </h4>
      )}

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Luật chơi:</strong></p>
        <ul>
          <li>Có 15 câu hỏi, mỗi câu 20 giây.</li>
          <li>Trả lời đúng được cộng điểm, sai hoặc hết giờ bị loại ngay.</li>
          <li>Trả lời đúng cả 15 câu thì rung chuông vàng (300 điểm).</li>
        </ul>
      </div>

      <form onSubmit={handleStart}>
        <input
          type="text"
          placeholder="Nhập tên người chơi..."
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          style={{ padding: '10px', width: '250px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" className="btn-primary" disabled={!localName.trim()}>
          Vào thi
        </button>
      </form>
    </div>
  );
};

export default Home;