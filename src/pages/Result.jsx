import React from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) return <Navigate to="/" replace />;

  const { playerName, score, correctCount, rank, reason } = state;

  let title = "";
  if (reason === "win") title = "Chúc mừng! Bạn đã rung chuông vàng (đúng cả 15 câu)";
  else if (reason === "wrong") title = "Bạn đã bị loại (trả lời sai)";
  else if (reason === "timeout") title = "Hết giờ!";
  else if (reason === "finish") title = "Bạn đã hoàn thành 15 câu";

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h2 style={{ color: reason === 'win' ? '#198754' : '#dc3545' }}>{title}</h2>
      
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', display: 'inline-block', textAlign: 'left', minWidth: '300px', margin: '20px 0' }}>
        <p style={{ fontSize: '18px' }}><strong>Người chơi:</strong> {playerName}</p>
        <p style={{ fontSize: '18px' }}><strong>Số câu trả lời đúng:</strong> {correctCount}/15</p>
        <p style={{ fontSize: '18px' }}><strong>Điểm:</strong> {score}</p>
        <p style={{ fontSize: '18px' }}><strong>Danh hiệu:</strong> {rank}</p>
      </div>

      <div>
        <button className="btn-primary" onClick={() => navigate("/play")} style={{ marginRight: '15px' }}>
          Chơi lại
        </button>
        <button className="btn-primary" onClick={() => navigate("/")} style={{ backgroundColor: '#6c757d' }}>
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Result;