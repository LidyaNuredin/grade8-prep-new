"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [examType, setExamType] = useState("ministry");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (!options.includes(answer)) {
      setMessage({ type: "error", text: "The correct answer must match one of the choices exactly!" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/questions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examType, subject, year, text, options, answer, explanation }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Saved perfectly directly to MySQL!" });
        setText("");
        setOptions(["", "", "", ""]);
        setAnswer("");
        setExplanation("");
      } else {
        setMessage({ type: "error", text: result.error || "Something went wrong." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to connect to the server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Grade 8 Management Panel</h1>
        <p className="text-gray-500 mb-8">Add digitized textbook items directly into your local database.</p>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${
            message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exam Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Category</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input type="radio" checked={examType === "ministry"} onChange={() => setExamType("ministry")} className="w-4 h-4 text-blue-600" />
                Ministry Exam
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input type="radio" checked={examType === "model"} onChange={() => setExamType("model")} className="w-4 h-4 text-blue-600" />
                Model Exam
              </label>
            </div>
          </div>

          {/* Subject & Year Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 outline-none">
                <option value="">Select Subject</option>
                <option value="science">General Science</option>
                <option value="math">Mathematics</option>
                <option value="social">Social Studies</option>
                <option value="english">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Year (E.C.)</label>
              <input type="number" placeholder="e.g. 2015" value={year} onChange={(e) => setYear(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 outline-none" />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Question Body Text</label>
            <textarea rows={3} placeholder="Type the question content here..." value={text} onChange={(e) => setText(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 outline-none" />
          </div>

          {/* Options input */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Multiple Choice Options</label>
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-bold text-gray-400 w-6 text-center">{String.fromCharCode(65 + idx)})</span>
                <input type="text" placeholder={`Option ${String.fromCharCode(65 + idx)}`} value={option} onChange={(e) => handleOptionChange(idx, e.target.value)} required className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 outline-none" />
              </div>
            ))}
          </div>

          {/* Correct Answer and Explanation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Correct Answer String Value</label>
            <input type="text" placeholder="Copy/paste the exact text matching the correct choice option" value={answer} onChange={(e) => setAnswer(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Answer Explanation / Reference</label>
            <textarea rows={3} placeholder="Provide helpful step-by-step logic explaining why this answer is correct..." value={explanation} onChange={(e) => setExplanation(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 outline-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow disabled:bg-gray-400 transition">
            {loading ? "Saving Question..." : "⚡ Save Question to MySQL"}
          </button>
        </form>
      </div>
    </main>
  );
}