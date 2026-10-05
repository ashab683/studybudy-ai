import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  HelpCircle,
  Award,
  Filter,
} from 'lucide-react';
import { generateQuiz } from '../services/api';
import { saveResource } from '../utils/storage';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';

const POPULAR_QUIZ_TOPICS = [
  'Recursion in C',
  'Binary Search Trees',
  'Process vs Thread in OS',
  'Normalization in DBMS',
  'TCP vs UDP in Networking',
  'Time Complexity & Big-O',
];

export default function Quiz({ health }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Generator form state
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);

  // Quiz execution state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState({}); // { [questionIdx]: selectedOptionIdx }
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showMistakesOnly, setShowMistakesOnly] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const urlTopic = searchParams.get('topic');
    if (urlTopic) {
      setTopic(urlTopic);
    }
  }, [searchParams]);

  const handleStartQuiz = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError('Please provide a topic for the quiz.');
      return;
    }

    setLoading(true);
    setError(null);
    setQuizData(null);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setAnswers({});
    setIsQuizCompleted(false);
    setIsSaved(false);

    try {
      const result = await generateQuiz({
        topic: topic.trim(),
        difficulty,
        questionCount,
      });

      if (!result.quiz || !Array.isArray(result.quiz.questions) || result.quiz.questions.length === 0) {
        throw new Error('Received an empty quiz from the AI. Please try again.');
      }

      setQuizData(result.quiz);
    } catch (err) {
      console.error('Quiz generation failed:', err);
      setError(err.message || 'Unable to generate quiz with local AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: selectedOption,
    }));
  };

  const handleNextQuestion = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < quizData.questions.length) {
      setCurrentIndex(nextIdx);
      setSelectedOption(answers[nextIdx] ?? null);
      setIsAnswerSubmitted(answers[nextIdx] !== undefined);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const calculateScore = () => {
    if (!quizData) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    quizData.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    const total = quizData.questions.length;
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  };

  const handleSaveQuizResult = () => {
    if (isSaved || !quizData) return;
    const score = calculateScore();
    saveResource({
      type: 'quiz',
      title: `${quizData.title} (${score.correct}/${score.total})`,
      topic: quizData.topic,
      subject: '',
      content: JSON.stringify(quizData),
      metadata: {
        score: score.correct,
        total: score.total,
        percentage: score.percentage,
        difficulty,
      },
    });
    setIsSaved(true);
  };

  const score = calculateScore();
  const currentQuestion = quizData?.questions?.[currentIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
          <Trophy className="w-4 h-4" />
          <span>Interactive Knowledge Check</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Quiz Challenge
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Generate an interactive multiple-choice test powered by local Gemma AI to test your understanding before exam day.
        </p>
      </div>

      {/* Generator Form (if quiz not started or completed) */}
      {!quizData && !loading && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
          <form onSubmit={handleStartQuiz} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                What topic do you want to be quizzed on?
              </label>
              <input
                type="text"
                placeholder="e.g. Recursion in C, Binary Trees, SQL Joins, Virtual Memory..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Popular Topics Chips */}
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">Quick topics:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {POPULAR_QUIZ_TOPICS.map((top, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(top)}
                    className="text-xs bg-slate-100 dark:bg-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors"
                  >
                    {top}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty & Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['easy', 'medium', 'hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                        difficulty === diff
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 8].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        questionCount === count
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {count} Questions
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={!topic.trim()}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Interactive Quiz</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Error Message */}
      {error && !loading && (
        <ErrorMessage
          error={error}
          onRetry={handleStartQuiz}
          modelName={health?.localAi?.model || 'gemma3:4b'}
        />
      )}

      {/* Live Quiz Playing Mode */}
      {quizData && !isQuizCompleted && currentQuestion && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-fadeIn">
          {/* Progress Header */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/60">
                Question {currentIndex + 1} of {quizData.questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 capitalize">
                • {difficulty} difficulty
              </span>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Leave this quiz? Your current progress will be lost.')) {
                  setQuizData(null);
                }
              }}
              className="text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              Quit Quiz
            </button>
          </div>

          {/* Question Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQuestion.question}
            </h2>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswer;
                const isWrong = isAnswerSubmitted && isSelected && !isCorrect;
                const isRevealedCorrect = isAnswerSubmitted && isCorrect;

                let cardStyle = 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-slate-750';
                if (isSelected && !isAnswerSubmitted) {
                  cardStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-200 dark:ring-indigo-800';
                } else if (isRevealedCorrect) {
                  cardStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-200 dark:ring-emerald-800';
                } else if (isWrong) {
                  cardStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 ring-2 ring-rose-200 dark:ring-rose-800';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${cardStyle}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        isRevealedCorrect
                          ? 'bg-emerald-600 text-white'
                          : isWrong
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-normal flex-1">
                      {opt}
                    </span>
                    {isRevealedCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    )}
                    {isWrong && (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Box (Revealed on submission) */}
            {isAnswerSubmitted && (
              <div
                className={`p-4 rounded-xl border animate-fadeIn text-sm ${
                  selectedOption === currentQuestion.correctAnswer
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>
                    {selectedOption === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'} — Explanation
                  </span>
                </div>
                <p className="leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400">
                {isAnswerSubmitted ? 'Review explanation, then continue' : 'Select an option to proceed'}
              </span>

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                >
                  <span>{currentIndex + 1 === quizData.questions.length ? 'View Final Results' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* End of Quiz Summary Screen */}
      {isQuizCompleted && quizData && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-10 shadow-sm text-center space-y-8 animate-fadeIn">
          {/* Score Badge */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200 dark:shadow-none mb-4">
              <Award className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Quiz Completed!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Topic: <span className="font-semibold text-slate-700 dark:text-slate-300">{quizData.title}</span>
            </p>

            <div className="mt-6 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                {score.correct}
              </span>
              <span className="text-2xl text-slate-400 font-bold">/ {score.total}</span>
              <span className="ml-3 text-lg font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {score.percentage}%
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
              {score.percentage >= 80
                ? '🌟 Outstanding! You have mastered this concept.'
                : score.percentage >= 60
                ? '👍 Good job! Review the questions you missed to lock it in.'
                : '📚 Keep practicing! Break down the fundamentals with Study Assistant.'}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveQuizResult}
              disabled={isSaved}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-50'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? 'Score Saved' : 'Save Quiz Score'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMistakesOnly(!showMistakesOnly)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 transition-all"
            >
              <Filter className="w-4 h-4 text-indigo-500" />
              <span>{showMistakesOnly ? 'Show All Questions' : 'Review Mistakes Only'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartQuiz()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Another Quiz</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/study?topic=${encodeURIComponent(topic)}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Study Topic More</span>
            </button>
          </div>

          {/* Question by Question Review */}
          <div className="text-left border-t border-slate-100 dark:border-slate-700 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {showMistakesOnly ? 'Questions to Review' : 'Detailed Review'}
            </h3>

            {quizData.questions
              .map((q, idx) => ({ ...q, originalIdx: idx }))
              .filter((q) => (showMistakesOnly ? answers[q.originalIdx] !== q.correctAnswer : true))
              .map((q) => {
                const userChoice = answers[q.originalIdx];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border text-sm space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {q.originalIdx + 1}. {q.question}
                      </span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      )}
                    </div>

                    <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                      <div>
                        Your answer: <span className="font-semibold">{q.options[userChoice] ?? 'None'}</span>
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-700 dark:text-emerald-400">
                          Correct answer: <span className="font-semibold">{q.options[q.correctAnswer]}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 italic pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
