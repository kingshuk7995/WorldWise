import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../Store";
import { motion } from "framer-motion";
import { Theme } from "../Store/themeSlice";

interface Question {
  question: string;
  options: string[];
  correct: string;
}

export default function QuizPage() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setQuizCompleted(false);
    const res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
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
    setLoading(false);
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

    const updated = [...selectedAnswers];
    updated[currentIndex] = option;
    setSelectedAnswers(updated);

    const attemptedCount = updated.filter((a) => a !== null).length;
    if (attemptedCount === questions.length) setQuizCompleted(true);
  };

  const correctCount = selectedAnswers.filter(
    (ans, idx) => ans === questions[idx]?.correct
  ).length;

  const attemptedCount = selectedAnswers.filter((a) => a !== null).length;
  const leftCount = questions.length - attemptedCount;

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-xl font-semibold ${
          theme === Theme.Dark ? "bg-gray-900 text-white" : "bg-blue-50 text-gray-900"
        }`}
      >
        Loading Questions...
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div
        className={`min-h-screen px-6 py-10 transition-colors duration-300 ${
          theme === Theme.Dark ? "bg-gray-900 text-gray-100" : "bg-blue-50 text-gray-900"
        }`}
      >
        <h1 className="text-4xl font-bold text-center mb-10 text-green-600 dark:text-yellow-300">
          🎉 Quiz Completed!
        </h1>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl mb-4 font-semibold text-center">Scoreboard</h2>
          <ul className="mb-6 space-y-2 text-lg">
            <li>✅ Correct: {correctCount}</li>
            <li>❌ Incorrect: {attemptedCount - correctCount}</li>
            <li>📋 Total Questions: {questions.length}</li>
            <li>🏁 Score: {(correctCount / questions.length * 100).toFixed(1)}%</li>
          </ul>

          <button
            onClick={fetchQuestions}
            className="block mx-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            🔁 Retry Quiz
          </button>
        </div>

        <div className="mt-10 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4 text-center">📖 Review</h3>
          {questions.map((q, i) => (
            <div
              key={i}
              className="mb-6 p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm"
            >
              <p className="font-medium mb-2">
                {i + 1}. {q.question}
              </p>
              <ul className="space-y-1">
                {q.options.map((opt) => {
                  const isCorrect = opt === q.correct;
                  const isSelected = selectedAnswers[i] === opt;

                  const style = isCorrect
                    ? "bg-green-500 text-white"
                    : isSelected
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white";

                  return (
                    <li
                      key={opt}
                      className={`px-4 py-2 rounded-md ${style}`}
                    >
                      {opt}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-colors duration-300 ${
        theme === Theme.Dark ? "bg-gray-900 text-gray-100" : "bg-blue-50 text-gray-900"
      }`}
    >
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-700 dark:text-yellow-300">
        🧠 WorldWise Quiz
      </h1>

      <div className="mb-6 text-center text-lg">
        <p className="mb-2">
          Question {currentIndex + 1}/{questions.length}
        </p>
        <p>
          Attempted: {attemptedCount} | Correct: {correctCount} | Incorrect:{" "}
          {attemptedCount - correctCount} | Left: {leftCount}
        </p>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-yellow-200">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => {
            const selected = selectedAnswers[currentIndex];
            const isCorrect = option === currentQuestion.correct;
            const isWrong = selected === option && !isCorrect;

            const baseStyle = "rounded-lg px-4 py-3 font-medium border transition-all duration-200 focus:outline-none shadow-sm";
            const style =
              selected === null
                ? "bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
                : isCorrect
                ? "bg-green-500 text-white border-green-600"
                : isWrong
                ? "bg-red-500 text-white border-red-600"
                : "bg-gray-200 dark:bg-gray-600 border-gray-400 text-gray-600";

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`${baseStyle} ${style}`}
                disabled={selected !== null}
              >
                {option}
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="flex justify-between mt-8 max-w-3xl mx-auto">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          disabled={currentIndex === 0}
        >
          ⬅️ Previous
        </button>
        <button
          onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={currentIndex === questions.length - 1}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}
