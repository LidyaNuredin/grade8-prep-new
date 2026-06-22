"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
  const examType = params?.examType as string;
  const subject = params?.subject as string;
  const year = params?.year as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 font-medium text-gray-500">Loading your test workspace...</div>;
  
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-4">
        <div className="bg-white p-8 rounded-xl shadow border max-w-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-1">No Questions Added</h3>
          <p className="text-gray-500 text-sm">No items matching this combination are present in your database yet.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{subject} Quiz Sheet</h1>
          <p className="text-gray-500 text-sm font-medium capitalize mt-1">Type: {examType} Exam — {year} E.C.</p>
        </div>

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

              {/* Reveal Explanation Block post grading action trigger event */}
              {submitted && (
                <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-gray-700 leading-relaxed animate-fadeIn">
                  <span className="font-bold text-blue-800 block mb-1">💡 Solution Explanation:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={() => setSubmitted(!submitted)}
          className={`w-full text-white font-bold py-3.5 rounded-xl transition ${submitted ? "bg-gray-600 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          {submitted ? "Reset Answer Key View" : "✔ Submit and Grade Exam"}
        </button>

      </div>
    </main>
  );
}