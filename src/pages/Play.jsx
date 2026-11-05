import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEVELS, POINTS, LETTERS, RANKS } from '../data';

const ScoreBoard = ({ score, currentIndex }) => (
  <div style={{ marginBottom: '20px' }}>
    <h3 style={{ margin: '0 0 10px 0' }}>Điểm: {score}</h3>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {Array.from({ length: 15 }).map((_, i) => {
        let classes = "score-box";
        if (i < currentIndex) classes += " correct-box";
        else if (i === currentIndex) classes += " current-box";
        return <div key={i} className={classes}>{i + 1}</div>;
      })}
    </div>
  </div>
);

const Timer = ({ timeLeft }) => (
  <div style={{ color: timeLeft <= 5 ? 'red' : 'black', fontSize: '20px', fontWeight: 'bold', margin: '15px 0' }}>
    Còn {timeLeft} giây
  </div>
);

const QuestionCard = ({ question, index, status, selectedOption, onAnswer }) => {
  const getButtonClass = (optIndex) => {
    let base = "answer-btn";
    if (status === "answering") return base;
    if (status === "locked") return optIndex === selectedOption ? `${base} locked` : base;
    if (status === "revealed") {
      if (optIndex === question.answer) return `${base} correct`;
      if (optIndex === selectedOption && optIndex !== question.answer) return `${base} wrong`;
    }
    return base;
  };

  return (
    <div>
      <h4 style={{ color: '#6c757d' }}>
        Câu {index + 1}/15 · {question.topic} · {LEVELS[question.level]}
      </h4>
      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{question.question}</p>
      
      <div className="grid-2x2">
        {question.options.map((opt, optIndex) => (
          <button
            key={optIndex}
            className={getButtonClass(optIndex)}
            onClick={() => onAnswer(optIndex)}
            disabled={status !== "answering"}
          >
            {LETTERS[optIndex]}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

const Play = ({ playerName, questions }) => {
  const navigate = useNavigate();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("answering");
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (status !== "answering") return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus("revealed");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    const getRank = (finalScore) => {
      const rank = RANKS.find(r => finalScore >= r.min);
      return rank ? rank.title : "Cần cố gắng";
    };

    const endGame = (finalScore, finalAnswers, reason) => {
      const correctCount = finalAnswers.filter(a => a.correct).length;
      navigate("/result", {
        replace: true,
        state: { playerName, score: finalScore, correctCount, rank: getRank(finalScore), reason }
      });
    };

    let timeoutId;
    if (status === "locked") {
      timeoutId = setTimeout(() => setStatus("revealed"), 2000);
    } 
    else if (status === "revealed") {
      timeoutId = setTimeout(() => {
        const q = questions[currentIndex];
        const isCorrect = selectedOption === q.answer;
        
        let newAnswers = [...answers];
        if (selectedOption !== null) {
          newAnswers.push({ id: q.id, level: q.level, correct: isCorrect });
        }

        if (timeLeft === 0) {
          endGame(score, newAnswers, "timeout");
        } else if (!isCorrect) {
          endGame(score, newAnswers, "wrong");
        } else {
          const newScore = score + POINTS[q.level];
          setScore(newScore);
          setAnswers(newAnswers);

          if (currentIndex === 14) {
            endGame(newScore, newAnswers, "win");
          } else {
            setCurrentIndex(prev => prev + 1);
            setStatus("answering");
            setSelectedOption(null);
            setTimeLeft(20);
          }
        }
      }, 1500);
    }
    return () => clearTimeout(timeoutId);
  }, [status, currentIndex, score, answers, selectedOption, timeLeft, questions, navigate, playerName]);

  const handleAnswer = (optIndex) => {
    setSelectedOption(optIndex);
    setStatus("locked");
  };

  if (!questions || questions.length === 0) return <div>Đang tải câu hỏi...</div>;

  return (
    <div>
      <ScoreBoard score={score} currentIndex={currentIndex} />
      <hr style={{ borderColor: '#eee' }} />
      <Timer timeLeft={timeLeft} />
      <QuestionCard 
        question={questions[currentIndex]} 
        index={currentIndex} 
        status={status} 
        selectedOption={selectedOption} 
        onAnswer={handleAnswer} 
      />
    </div>
  );
};

export default Play;