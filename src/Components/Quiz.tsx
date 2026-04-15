import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../Store";
import { motion, AnimatePresence } from "framer-motion";
import { Theme } from "../Store/themeSlice";
import { BrainCircuit, CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: string;
}

export default function QuizPage() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isDark = theme === Theme.Dark;
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [shake, setShake] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setQuizCompleted(false);
    try {
      const res = await fetch("https://opentdb.com/api.php?amount=10&category=22&type=multiple"); // Geography category
      const data = await res.json();

      const processed = data.results.map((q: any) => {
        const options = shuffle([...q.incorrect_answers, q.correct_answer]);
        return {
          question: decodeHTML(q.question),
          options: options.map(decodeHTML),
          correct: decodeHTML(q.correct_answer),
        };
      });

      setQuestions(processed);
      setSelectedAnswers(Array(processed.length).fill(null));
      setCurrentIndex(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const decodeHTML = (text: string) => {
    const el = document.createElement("textarea");
    el.innerHTML = text;
    return el.value;
  };

  const shuffle = (array: string[]) => array.sort(() => Math.random() - 0.5);

  const handleSelect = (option: string) => {
    if (selectedAnswers[currentIndex] !== null) return;

    const isCorrect = option === questions[currentIndex].correct;
    
    if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    const updated = [...selectedAnswers];
    updated[currentIndex] = option;
    setSelectedAnswers(updated);

    // Auto-advance if not the last question
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 1200);
    } else {
      setTimeout(() => setQuizCompleted(true), 1200);
    }
  };

  const correctCount = selectedAnswers.filter((ans, idx) => ans === questions[idx]?.correct).length;
  const attemptedCount = selectedAnswers.filter((a) => a !== null).length;
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? "bg-gray-950 text-white" : "bg-[#f8fafc] text-gray-900"}`}>
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit className="w-16 h-16 text-blue-500 animate-pulse" />
          <h2 className="text-2xl font-bold animate-pulse">Generating Knowledge Challenge...</h2>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className={`min-h-screen px-6 py-12 transition-colors duration-500 ${isDark ? "bg-gray-950 text-gray-100" : "bg-[#f8fafc] text-slate-900"}`}>
        <div className="max-w-4xl mx-auto">
          {/* Confetti effect placeholder */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className={`p-12 text-center rounded-3xl shadow-2xl border mb-16 relative overflow-hidden backdrop-blur-xl ${isDark ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-yellow-500" />
            
            <Trophy className={`w-24 h-24 mx-auto mb-6 ${percentage >= 70 ? 'text-yellow-400' : 'text-gray-400'}`} />
            <h1 className="text-5xl font-extrabold mb-4">Challenge Completed!</h1>
            <p className="text-xl opacity-70 mb-8">Here is how you performed on this geography challenge.</p>
            
            <div className="flex justify-center items-center gap-8 md:gap-16 mb-10">
              <div className="text-center">
                <div className="text-6xl font-black text-blue-500 mb-2">{percentage}%</div>
                <div className="uppercase tracking-widest text-sm opacity-60 font-semibold">Accuracy</div>
              </div>
              <div className="h-24 w-px bg-gray-500/20" />
              <div className="text-left space-y-3 text-lg font-medium">
                <div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-500" /> {correctCount} Correct</div>
                <div className="flex items-center gap-3"><XCircle className="text-red-500" /> {questions.length - correctCount} Incorrect</div>
              </div>
            </div>

            <button
              onClick={fetchQuestions}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <RotateCcw className="w-5 h-5" /> Retake Challenge
            </button>
          </motion.div>

          <h3 className="text-3xl font-bold mb-8 text-center">Detailed Breakdown</h3>
          <div className="space-y-6 max-w-3xl mx-auto">
            {questions.map((q, i) => {
              const isRight = selectedAnswers[i] === q.correct;
              return (
                <div key={i} className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      {isRight ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                    </div>
                    <div>
                      <p className="text-lg font-semibold mb-3">{i + 1}. {q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isCorrectOpt = opt === q.correct;
                          const isSelectedOpt = selectedAnswers[i] === opt;
                          
                          let styleClasses = "opacity-50";
                          if (isCorrectOpt) styleClasses = "text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded inline-block w-fit";
                          else if (isSelectedOpt && !isCorrectOpt) styleClasses = "text-red-600 dark:text-red-400 font-bold line-through px-3 py-1";
                          
                          return <div key={opt} className={`text-md ${styleClasses}`}>{opt}</div>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressText = `${currentIndex + 1} / ${questions.length}`;
  const progressPercentage = ((currentIndex) / questions.length) * 100;

  return (
    <div className={`min-h-screen px-6 py-12 transition-colors duration-500 flex flex-col items-center ${isDark ? "bg-gray-950 text-gray-100" : "bg-[#f8fafc] text-slate-900"}`}>
      
      {/* Progress Bar */}
      <div className="max-w-3xl w-full mb-12">
        <div className="flex justify-between items-end mb-2 font-semibold">
          <span>Question Challenge</span>
          <span className="text-blue-500">{progressText}</span>
        </div>
        <div className={`h-3 w-full rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-200"}`}>
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : { opacity: 1, x: 0 }}
        transition={shake ? { duration: 0.4 } : { duration: 0.5 }}
        className={`w-full max-w-3xl p-8 md:p-12 rounded-3xl shadow-2xl border backdrop-blur-xl ${isDark ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
      >
        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-6 bg-blue-500/10 text-blue-500">
          Geography
        </span>
        <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-8">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => {
            const selected = selectedAnswers[currentIndex];
            const isCorrect = option === currentQuestion.correct;
            const isWrong = selected === option && !isCorrect;

            let cardStyle = isDark 
              ? "bg-gray-800 border-gray-700 hover:border-gray-500" 
              : "bg-white border-gray-200 hover:border-gray-400 shadow-sm";
              
            if (selected !== null) {
              if (isCorrect) {
                cardStyle = "bg-emerald-500 text-white border-emerald-600 shadow-lg scale-[1.02] z-10";
              } else if (isWrong) {
                cardStyle = "bg-red-500 text-white border-red-600 opacity-80";
              } else {
                cardStyle = "opacity-40 grayscale";
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={selected !== null}
                className={`p-6 rounded-2xl text-lg font-medium border-2 text-left transition-all duration-300 focus:outline-none flex justify-between items-center group ${cardStyle}`}
              >
                <span>{option}</span>
                {selected !== null && isCorrect && <CheckCircle2 className="w-6 h-6 text-white" />}
                {selected !== null && isWrong && <XCircle className="w-6 h-6 text-white" />}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Manual Controls Backup */}
      <div className="flex justify-between w-full max-w-3xl mt-8">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          className={`px-6 py-3 font-semibold rounded-xl transition ${isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"}`}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        {selectedAnswers[currentIndex] !== null && currentIndex < questions.length - 1 && (
          <button
            onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="px-6 py-3 font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Next Question
          </button>
        )}
      </div>

    </div>
  );
}
