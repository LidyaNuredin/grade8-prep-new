"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  const [showWelcome, setShowWelcome] = useState(true);
  const [step, setStep] = useState(1);
  const [examType, setExamType] = useState("");
  const [subject, setSubject] = useState("");

  // 1. Check if the user has already bypassed the welcome screen this session
  useEffect(() => {
    if (sessionStorage.getItem("skipWelcome") === "true") {
      setShowWelcome(false);
    }
  }, []);

  // 2. Save their choice to session storage when they click Get Started
  const handleGetStarted = () => {
    sessionStorage.setItem("skipWelcome", "true");
    setShowWelcome(false);
  };

  const subjects = [
    { id: "science", name: "General Science", icon: "🔬" },
    { id: "math", name: "Mathematics", icon: "🧮" },
    { id: "social", name: "Social Studies", icon: "🌍" },
    { id: "english", name: "English", icon: "📚" },
    { id: "citizen", name: "Citizenship", icon: "⚖️" },
    { id: "amharic", name: "Amharic (አማርኛ)", icon: "✍️" },
  ];

  const years = ["2015", "2016", "2017"];

  const handleSelectYear = (year: string) => {
    router.push(`/${examType}/${subject}/${year}`);
  };

  // --- WELCOME INTERFACE VIEW ---
  if (showWelcome) {
    return (
      <main className="min-h-[85vh] bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center space-y-8 p-6">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
             Empowering Grade 8 Students
          </span>
          
          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-none">
            Welcome to <span className="text-blue-600">Grade8Prep</span> Engine
          </h1>
          
          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            Your interactive portal for mastering National Ministry and Model Examinations. Practice real digitized questions with instant grading and structural explanations!
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-4 text-left">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-xl mb-1">🏛️</div>
              <h4 className="font-bold text-gray-800 text-sm">Official Exams</h4>
              <p className="text-xs text-gray-500">Real historic ministry baseline questions.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-xl mb-1">✅</div>
              <h4 className="font-bold text-gray-800 text-sm">Instant Grading</h4>
              <p className="text-xs text-gray-500">See right or wrong options immediately.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-xl mb-1">💡</div>
              <h4 className="font-bold text-gray-800 text-sm">Clear Solutions</h4>
              <p className="text-xs text-gray-500">Detailed reference step explanations.</p>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="pt-6">
            <button
              onClick={handleGetStarted} // 3. Updated onClick handler here
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-4 px-10 rounded-xl shadow-xl hover:shadow-blue-200 transition transform active:scale-[0.98]"
            >
              Get Started Now ➔
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- EXISTING MULTI-STEP WIZARD VIEW ---
  return (
    <main className="min-h-[85vh] bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {/* Progress Navigation Tracker Header */}
        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
          <span className={step >= 1 ? "text-blue-600" : ""}>1. Category</span>
          <span>➔</span>
          <span className={step >= 2 ? "text-blue-600" : ""}>2. Subject</span>
          <span>➔</span>
          <span className={step >= 3 ? "text-blue-600" : ""}>3. Year</span>
        </div>

        {/* STEP 1: Choose Model or Ministry */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-800 text-center">Select Exam Category</h2>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => { setExamType("ministry"); setStep(2); }} className="p-5 border-2 border-gray-200 hover:border-blue-500 rounded-xl text-left bg-gray-50 hover:bg-blue-50/50 transition">
                <span className="block font-bold text-lg text-gray-800">🏛️ National Ministry Exam</span>
                <span className="text-sm text-gray-500">Official regional Grade 8 baseline assessments.</span>
              </button>
              <button onClick={() => { setExamType("model"); setStep(2); }} className="p-5 border-2 border-gray-200 hover:border-blue-500 rounded-xl text-left bg-gray-50 hover:bg-blue-50/50 transition">
                <span className="block font-bold text-lg text-gray-800">📝 Standard Model Exam</span>
                <span className="text-sm text-gray-500">Curated mock preparation test blueprints.</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Subject */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(1)} className="text-sm text-blue-600 font-medium hover:underline">← Back</button>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 text-center capitalize">Select Your Course Subject</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((sub) => (
                <button key={sub.id} onClick={() => { setSubject(sub.id); setStep(3); }} className="flex items-center gap-4 p-4 border-2 border-gray-200 hover:border-blue-500 rounded-xl bg-gray-50 hover:bg-blue-50/30 transition text-gray-800 font-medium">
                  <span className="text-2xl">{sub.icon}</span>
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Choose Year */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(2)} className="text-sm text-blue-600 font-medium hover:underline">← Back</button>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 text-center">Select Exam Year (E.C.)</h2>
            <div className="grid grid-cols-1 gap-3">
              {years.map((year) => (
                <button key={year} onClick={() => handleSelectYear(year)} className="p-4 border-2 border-gray-200 hover:border-blue-500 rounded-xl bg-gray-50 text-center font-bold text-gray-700 hover:bg-blue-50 text-base tracking-wide transition">
                  {year} E.C. Exam Sheet
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}