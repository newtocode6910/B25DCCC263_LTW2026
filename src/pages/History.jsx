import React from 'react';

const History = ({ history, setHistory }) => {
  const handleClearHistory = () => {
    setHistory([]);
  };

  if (!history || history.length === 0) {
    return (
      <div>
        <h2>Lịch sử các lượt chơi</h2>
        <p>Chưa có lượt chơi nào.</p>
      </div>
    );
  }

  const sortedHistory = [...history].sort((a, b) => b.score - a.score);
  const highestScore = sortedHistory[0].score;
  const averageScore = Math.round(
    history.reduce((sum, record) => sum + record.score, 0) / history.length
  );

  return (
    <div>
      <h2>Lịch sử các lượt chơi</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Số lượt chơi:</strong> {history.length}</p>
        <p><strong>Điểm cao nhất:</strong> {highestScore}</p>
        <p><strong>Điểm trung bình:</strong> {averageScore}</p>
      </div>

      <button className="btn-primary" onClick={handleClearHistory} style={{ backgroundColor: '#dc3545', marginBottom: '15px' }}>
        Xóa lịch sử
      </button>

      <table className="history-table">
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Điểm</th>
            <th>Danh hiệu</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((record) => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.correctCount}</td>
              <td>{record.score}</td>
              <td>{record.rank}</td>
              <td>{record.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;