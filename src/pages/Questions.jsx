import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS, TOPICS } from '../data';

const Questions = ({ questions, loading, error }) => {
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <div>Đang tải câu hỏi...</div>;
  if (error) return <div>Không tải được câu hỏi.</div>;

  // Lọc kết quả theo Chủ đề và Nội dung tìm kiếm
  const filteredQuestions = questions.filter((q) => {
    const matchTopic = selectedTopic === 'All' || q.topic === selectedTopic;
    const matchSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTopic && matchSearch;
  });

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>

      <div className="filter-box">
        <label>
          Chủ đề:{' '}
          <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
            <option value="All">Tất cả</option>
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </label>

        <input
          type="text"
          placeholder="Tìm kiếm nội dung..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <p>Có {filteredQuestions.length} câu hỏi.</p>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Chủ đề</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{q.topic}</td>
              <td>{LEVELS[q.level]}</td>
              <td>
                <Link to={`/questions/${q.id}`} style={{ color: '#0d6efd' }}>
                  {q.question}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Questions;