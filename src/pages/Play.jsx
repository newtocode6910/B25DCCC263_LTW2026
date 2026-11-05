import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEVELS, POINTS, LETTERS, RANKS, EXTRA_TIME } from '../data';

const Helpers = ({ usedHelpers, onUseHelper, isAnswering, isPhaoActive }) => (
  <div className="helpers-container">
    <button 
      className="helper-btn"
      disabled={!isAnswering || usedHelpers.includes('5050')} 
      onClick={() => onUseHelper('5050')}
    >
      Loại 1 đáp án
    </button>
    <button 
      className="helper-btn"
      disabled={!isAnswering || usedHelpers.includes('time')} 
      onClick={() => onUseHelper('time')}
    >
      Thêm 15 giây
    </button>
    <button 
      className={`helper-btn ${isPhaoActive ? 'active-phao' : ''}`}
      disabled={!isAnswering || usedHelpers.includes('phao')} 
      onClick={() => onUseHelper('phao')}
    >
      {isPhaoActive ? 'Phao đang bật' : 'Phao cứu sinh'}
    </button>
  </div>
);

const ScoreBoard = ({ score, currentIndex, phaoQuestions }) => (
  <div style={{ marginBottom: '20px' }}>
    <h3 style={{ margin: '0 0 10px 0' }}>Điểm: {score}</h3>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {Array.from({ length: 15 }).map((_, i) => {
        let classes = "score-box";
        if (phaoQuestions.includes(i)) classes += " used-phao";
        else if (i < currentIndex) classes += " correct-box";
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

const QuestionCard = ({ question, index, status, selectedOption, onAnswer, hiddenOptionIndex }) => {
  const getButtonClass = (optIndex) => {
    let base = "answer-btn";
    if (optIndex === hiddenOptionIndex) return `${base} hidden`;
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
            disabled={status !== "answering" || optIndex === hiddenOptionIndex}
          >
            {LETTERS[optIndex]}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

const Play = ({ playerName, questions, setHistory }) => {
  const navigate = useNavigate();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("answering");
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answers, setAnswers] = useState([]);
  
  const [usedHelpers, setUsedHelpers] = useState([]);
  const [isPhaoActive, setIsPhaoActive] = useState(false);
  const [hiddenOptionIndex, setHiddenOptionIndex] = useState(null);
  const [phaoQuestions, setPhaoQuestions] = useState([]);

  useEffect(() => {
    document.title = `Câu ${currentIndex + 1}/15 – ${score} điểm`;
    return () => {
      document.title = "Rung chuông vàng";
    };
  }, [currentIndex, score]);

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
      const rankTitle = getRank(finalScore);
      
      setHistory(prev => {
        const newRecord = {
          id: Date.now(),
          name: playerName,
          score: finalScore,
          rank: rankTitle,
          correctCount: correctCount,
          playedAt: new Date().toLocaleString("vi-VN")
        };
        return [...prev, newRecord];
      });

      navigate("/result", {
        replace: true,
        state: { playerName, score: finalScore, correctCount, rank: rankTitle, reason }
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
        let currentPhaoQuestions = [...phaoQuestions];
        let currentScore = score;
        let isEliminated = false;
        let endReason = "";

        if (selectedOption !== null) {
          newAnswers.push({ id: q.id, level: q.level, correct: isCorrect });
        }

        if (timeLeft === 0) {
          if (isPhaoActive) {
            currentPhaoQuestions.push(currentIndex);
          } else {
            isEliminated = true;
            endReason = "timeout";
          }
        } else if (!isCorrect) {
           if (isPhaoActive) {
            currentPhaoQuestions.push(currentIndex);
          } else {
            isEliminated = true;
            endReason = "wrong";
          }
        } else {
          currentScore += POINTS[q.level];
        }

        setScore(currentScore);
        setAnswers(newAnswers);
        setPhaoQuestions(currentPhaoQuestions);
        
        if (isPhaoActive) {
           setIsPhaoActive(false);
        }

        if (isEliminated) {
          endGame(currentScore, newAnswers, endReason);
        } else if (currentIndex === 14) {
           const finalReason = currentPhaoQuestions.length > 0 ? "finish" : "win";
           endGame(currentScore, newAnswers, finalReason);
        } else {
          setCurrentIndex(prev => prev + 1);
          setStatus("answering");
          setSelectedOption(null);
          setTimeLeft(20);
          setHiddenOptionIndex(null);
        }
      }, 1500);
    }
    return () => clearTimeout(timeoutId);
  }, [status, currentIndex, score, answers, selectedOption, timeLeft, questions, navigate, playerName, isPhaoActive, phaoQuestions, setHistory]);

  const handleAnswer = useCallback((optIndex) => {
    if (status !== "answering" || optIndex === hiddenOptionIndex) return;
    setSelectedOption(optIndex);
    setStatus("locked");
  }, [status, hiddenOptionIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key;
      if (['1', '2', '3', '4'].includes(key)) {
        handleAnswer(parseInt(key) - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleAnswer]);

  const handleUseHelper = (type) => {
    if (!usedHelpers.includes(type)) {
      setUsedHelpers([...usedHelpers, type]);
      if (type === '5050') {
         const q = questions[currentIndex];
         let wrongIndices = [0, 1, 2, 3].filter(i => i !== q.answer);
         const hideIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
         setHiddenOptionIndex(hideIndex);
      } else if (type === 'time') {
         setTimeLeft(prev => prev + EXTRA_TIME);
      } else if (type === 'phao') {
         setIsPhaoActive(true);
      }
    }
  };

  if (!questions || questions.length === 0) return <div>Đang tải câu hỏi...</div>;

  return (
    <div>
      <Helpers 
        usedHelpers={usedHelpers} 
        onUseHelper={handleUseHelper} 
        isAnswering={status === "answering"}
        isPhaoActive={isPhaoActive}
      />
      <ScoreBoard score={score} currentIndex={currentIndex} phaoQuestions={phaoQuestions} />
      <hr style={{ borderColor: '#eee' }} />
      <Timer timeLeft={timeLeft} />
      <QuestionCard 
        question={questions[currentIndex]} 
        index={currentIndex} 
        status={status} 
        selectedOption={selectedOption} 
        onAnswer={handleAnswer} 
        hiddenOptionIndex={hiddenOptionIndex}
      />
    </div>
  );
};

export default Play;