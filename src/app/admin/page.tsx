"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [examType, setExamType] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  
  // Split options into distinct states
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  
  // Use a dropdown for the correct option instead of re-typing the answer
  const [correctOption, setCorrectOption] = useState("A");
  
  const [explanation, setExplanation] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ message: "Saving question to database...", type: "loading" });

    // 1. Map out which string text corresponds to the correct option selected
    let exactAnswerText = "";
    if (correctOption === "A") exactAnswerText = optionA;
    if (correctOption === "B") exactAnswerText = optionB;
    if (correctOption === "C") exactAnswerText = optionC;
    if (correctOption === "D") exactAnswerText = optionD;

    try {
      const res = await fetch("/api/questions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 2. Pass the options as a raw array directly so your backend line 13 can run safely!
        body: JSON.stringify({ 
          examType, 
          subject, 
          year, 
          text, 
          options: [optionA, optionB, optionC, optionD], 
          answer: exactAnswerText, 
          explanation 
        }),
      });
      
      if (res.ok) {
        setStatus({ message: "🎉 Question added successfully!", type: "success" });
        // Clear text fields, but keep category/subject/year to speed up bulk entry
        setText("");
        setOptionA("");
        setOptionB("");
        setOptionC("");
        setOptionD("");
        setCorrectOption("A");
        setExplanation("");
      } else {
        setStatus({ message: "❌ Failed to save question.", type: "error" });
      }
    } catch (error) {
      setStatus({ message: "❌ Network error occurred.", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus({ message: "", type: "" }), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Grade8Prep <span className="text-blue-600">Admin Portal</span>
          </h1>
        </div>
        <Link 
          href="/" 
          className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-200 transition"
        >
          Student Panel ➔
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto mt-10 p-4 mb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="bg-slate-900 p-6 text-white">
            <h2 className="text-2xl font-bold">Add New Question</h2>
            <p className="text-slate-400 text-sm mt-1">Configure your exam metadata and input the question details below.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* SECTION 1: Exam Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Exam Category</label>
                <select value={examType} onChange={(e) => setExamType(e.target.value)} required className="w-full border border-slate-300 rounded-lg p-3 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm">
                  <option value="">Select Category...</option>
                  <option value="ministry">🏛️ National Ministry Exam</option>
                  <option value="model">📝 Standard Model Exam</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full border border-slate-300 rounded-lg p-3 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm">
                  <option value="">Select Subject...</option>
                  <option value="science">General Science</option>
                  <option value="math">Mathematics</option>
                  <option value="social">Social Studies</option>
                  <option value="english">English</option>
                  <option value="citizen">Citizenship</option>
                  <option value="amharic">Amharic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Year (E.C.)</label>
                <select value={year} onChange={(e) => setYear(e.target.value)} required className="w-full border border-slate-300 rounded-lg p-3 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm">
                  <option value="">Select Year...</option>
                  <option value="2015">2015</option>
                  <option value="2016">2016</option>
                  <option value="2017">2017</option>
                </select>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECTION 2: Question Data */}
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Question Text</label>
                <textarea 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  required 
                  rows={3}
                  placeholder="e.g., What is the powerhouse of the cell?"
                  className="w-full border border-slate-300 rounded-lg p-4 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm resize-none"
                />
              </div>

              {/* NEW: Distinct A, B, C, D Inputs */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Answer Options</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <span className="flex items-center justify-center bg-slate-100 border border-slate-300 border-r-0 rounded-l-lg px-4 font-bold text-slate-500">A</span>
                    <textarea value={optionA} onChange={(e) => setOptionA(e.target.value)} required rows={2} placeholder="First option..." className="w-full border border-slate-300 rounded-r-lg p-3 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                  </div>
                  <div className="flex">
                    <span className="flex items-center justify-center bg-slate-100 border border-slate-300 border-r-0 rounded-l-lg px-4 font-bold text-slate-500">B</span>
                    <textarea value={optionB} onChange={(e) => setOptionB(e.target.value)} required rows={2} placeholder="Second option..." className="w-full border border-slate-300 rounded-r-lg p-3 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                  </div>
                  <div className="flex">
                    <span className="flex items-center justify-center bg-slate-100 border border-slate-300 border-r-0 rounded-l-lg px-4 font-bold text-slate-500">C</span>
                    <textarea value={optionC} onChange={(e) => setOptionC(e.target.value)} required rows={2} placeholder="Third option..." className="w-full border border-slate-300 rounded-r-lg p-3 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                  </div>
                  <div className="flex">
                    <span className="flex items-center justify-center bg-slate-100 border border-slate-300 border-r-0 rounded-l-lg px-4 font-bold text-slate-500">D</span>
                    <textarea value={optionD} onChange={(e) => setOptionD(e.target.value)} required rows={2} placeholder="Fourth option..." className="w-full border border-slate-300 rounded-r-lg p-3 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                  </div>
                </div>
              </div>

              {/* NEW: Dropdown exact answer selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Correct Answer</label>
                  <select 
                    value={correctOption} 
                    onChange={(e) => setCorrectOption(e.target.value)} 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-4 bg-green-50 text-green-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition shadow-sm font-bold cursor-pointer"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-2">Select which letter represents the correct answer.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Solution Explanation</label>
                  <textarea 
                    value={explanation} 
                    onChange={(e) => setExplanation(e.target.value)} 
                    required 
                    rows={2}
                    placeholder="Explain why this is the correct answer..."
                    className="w-full border border-slate-300 rounded-lg p-4 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {status.message && (
              <div className={`p-4 rounded-lg font-bold text-sm text-center ${
                status.type === "success" ? "bg-green-100 text-green-800" : 
                status.type === "error" ? "bg-red-100 text-red-800" : 
                "bg-blue-100 text-blue-800"
              }`}>
                {status.message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-blue-200 transition transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving to Database..." : "➕ Save Question"}
            </button>
            
          </form>
        </div>
      </main>
    </div>
  );
}