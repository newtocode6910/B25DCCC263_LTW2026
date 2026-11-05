import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, POINTS, LETTERS } from '../data';

const QuestionDetail = ({ questions, loading, error }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) return <div>Đang tải câu hỏi...</div>;
  if (error) return <div>Không tải được câu hỏi.</div>;

  const numericId = Number(id);
  const question = questions.find((q) => q.id === numericId);

  if (!question) {
    return (
      <div>
        <h2>Không tìm thấy câu hỏi</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>
        Câu hỏi số {question.id} - {question.topic} ({LEVELS[question.level]}, {POINTS[question.level]} điểm)
      </h2>
      <p style={{ fontSize: '18px', fontWeight: '500' }}>{question.question}</p>

      <div style={{ marginTop: '20px' }}>
        {question.options.map((option, index) => {
          const isCorrect = index === question.answer;
          return (
            <div key={index} className={`option-item ${isCorrect ? 'correct' : ''}`}>
              {LETTERS[index]}. {option} {isCorrect && <span>(Đáp án đúng)</span>}
            </div>
          );
        })}
      </div>

      <button className="btn-back" onClick={() => navigate(-1)}>
        Quay lại
      </button>
    </div>
  );
};

export default QuestionDetail;