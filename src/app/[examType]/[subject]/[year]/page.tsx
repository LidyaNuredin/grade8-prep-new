"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
  id: string;
  examType: string;
  subject: string;
  year: string;
  text: string;
  options: string; 
  answer: string;
  explanation: string;
}

export default function StudentQuizEngine() {
  const params = useParams();
  const router = useRouter();
  const examType = params?.examType as string;
  const subject = params?.subject as string;
  const year = params?.year as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function getQuestionsData() {
      try {
        const res = await fetch(`/api/questions/get?examType=${examType}&subject=${subject}&year=${year}`);
        const result = await res.json();
        if (result.success) {
          setQuestions(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (examType && subject && year) getQuestionsData();
  }, [examType, subject, year]);

  // Calculate score when the student hits the grade button
  const handleGradeExam = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
    
    // Smoothly scroll to the top of the page so they immediately see their score banner
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 font-medium text-gray-500">Loading your test workspace...</div>;
  
  if (questions.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 text-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm space-y-4">
          <div className="text-4xl">📂</div>
          <h3 className="text-xl font-black text-gray-800">Exam Sheet Empty</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            No questions matching this specific setup have been added to the database panel yet.
          </p>
          <Link href="/" className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-xl transition shadow-md">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Info Header */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{subject} Quiz Sheet</h1>
            <p className="text-gray-500 text-sm font-medium capitalize mt-1">Type: {examType} Exam — {year} E.C.</p>
          </div>
          <Link href="/" className="text-sm font-bold text-blue-600 hover:underline">
            ← Exit Exam
          </Link>
        </div>

        {/* Dynamic Overall Score Result Banner */}
        {submitted && (() => {
          const percentage = Math.round((score / questions.length) * 100);
          const isPassing = percentage >= 50;

          return isPassing ? (
            /* Green Banner for 50% and above (As seen in image_c5a0a8.png) */
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-2xl shadow-sm text-center space-y-3 animate-fadeIn">
              <h2 className="text-xl font-black text-green-900">🎉 Exam Completed!</h2>
              <p className="text-3xl font-black text-green-600 tracking-tight">
                Your Score: {score} / {questions.length}
              </p>
              <p className="text-sm text-green-700 font-medium">
                Percentage: {percentage}%
              </p>
            </div>
          ) : (
            /* New Red Banner for under 50% */
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 p-6 rounded-2xl shadow-sm text-center space-y-3 animate-fadeIn">
              <h2 className="text-xl font-black text-red-900">📚 Keep Practicing!</h2>
              <p className="text-3xl font-black text-red-600 tracking-tight">
                Your Score: {score} / {questions.length}
              </p>
              <p className="text-sm text-red-700 font-medium">
                Percentage: {percentage}%
              </p>
            </div>
          );
        })()}

        {/* Questions Loop Container */}
        {questions.map((q, idx) => {
          const optionsArray = q.options.split("|||");
          return (
            <div key={q.id} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
              <h4 className="text-md font-bold text-gray-800">
                <span className="text-blue-600 mr-1">Q{idx + 1}.</span> {q.text}
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {optionsArray.map((option, oIdx) => {
                  const isSelected = selectedAnswers[q.id] === option;
                  const isCorrect = option === q.answer;
                  
                  let btnStyle = "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100";
                  if (isSelected) btnStyle = "border-blue-500 bg-blue-50 text-blue-700 font-semibold";
                  
                  if (submitted) {
                    if (isCorrect) btnStyle = "border-green-500 bg-green-50 text-green-700 font-bold ring-2 ring-green-200";
                    else if (isSelected && !isCorrect) btnStyle = "border-red-500 bg-red-50 text-red-600 line-through";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={submitted}
                      onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: option })}
                      className={`w-full text-left p-3 rounded-lg border text-sm flex items-center transition ${btnStyle}`}
                    >
                      <span className="font-bold mr-3 opacity-50">{String.fromCharCode(65 + oIdx)})</span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Solutions Reveal Area */}
              {submitted && (
                <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-blue-800 block mb-1">💡 Solution Explanation:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {/* Main Action Buttons */}
        {!submitted ? (
          <button
            onClick={handleGradeExam}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-[0.99]"
          >
            ✔ Submit and Grade Exam
          </button>
        ) : (
          /* Two Button Layout Side-by-Side on Desktop, Stacked on Mobile */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                sessionStorage.removeItem("quiz_step"); // Ensure a clean dashboard load
                router.push("/");
              }}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 rounded-xl shadow-md transition active:scale-[0.99] text-center"
            >
              🏠 Return to Dashboard
            </button>
            
            <button
              onClick={() => {
                // Bookmark current progress parameters
                sessionStorage.setItem("quiz_step", "3");
                sessionStorage.setItem("quiz_examType", examType);
                sessionStorage.setItem("quiz_subject", subject);
                router.push("/");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-[0.99] text-center"
            >
              📅 Back to Years
            </button>
          </div>
        )}

      </div>
    </main>
  );
}