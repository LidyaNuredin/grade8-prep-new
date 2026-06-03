"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle updates to individual multiple choice input fields
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Client-side verification that the selected answer matches one of the choices
    if (!options.includes(answer)) {
      setMessage({ type: "error", text: "The correct answer must match one of the four choices exactly!" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/questions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, year, text, options, answer }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Question added straight to MySQL successfully!" });
        // Clear out text values on success
        setText("");
        setOptions(["", "", "", ""]);
        setAnswer("");
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Grade 8 Ministry Exam Panel</h1>
        <p className="text-gray-500 mb-8">Add new physical textbook questions cleanly directly into your local database.</p>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${
            message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject & Year Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Subject</option>
                <option value="science">General Science</option>
                <option value="math">Mathematics</option>
                <option value="social">Social Studies</option>
                <option value="english">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Year (E.C.)</label>
              <input 
                type="number" 
                placeholder="e.g. 2015" 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Question Body Text</label>
            <textarea 
              rows={4}
              placeholder="Type the ministry exam question text content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Options Array Mapping */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Multiple Choice Options</label>
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-bold text-gray-400 w-6 text-center">{String.fromCharCode(65 + idx)})</span>
                <input 
                  type="text" 
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}
          </div>

          {/* Correct Answer field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Correct Answer String Value</label>
            <input 
              type="text" 
              placeholder="Copy/paste the exact text matching the correct choice option"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow recovery-btn transition disabled:bg-gray-400"
          >
            {loading ? "Saving Question Locally..." : "⚡ Save Question to MySQL"}
          </button>
        </form>
      </div>
    </main>
  );
}