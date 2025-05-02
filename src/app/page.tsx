// src/app/page.tsx
"use client"
import { useState, useEffect, useRef } from "react";
import Quiz from '../components/quiz';
import Result from '../components/result';

interface QuizAnswers {
  [key: string]: string | number | boolean;
}

export default function Home() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [preloadedResults, setPreloadedResults] = useState(null);
  const [isPreloading, setIsPreloading] = useState(false);
  const [resultKey, setResultKey] = useState(0);
  const isResubmission = useRef(false);
  
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  } 
  };

  const handleQuizComplete = (quizAnswers: any) => {
    if (isLoadingResults) return;
    
    isResubmission.current = showResult;
    
    setIsLoadingResults(true);
    setAnswers(quizAnswers);
    setShowResult(false);
    
    // Always clear preloaded results to force a fresh API call
    setPreloadedResults(null);
    
    setResultKey(prev => prev + 1);
    
    setTimeout(() => {
      setShowResult(true);
      setIsLoadingResults(false);
      
      if (isResubmission.current) {
        setTimeout(() => {
          handleScrollTo("result");
        }, 100);
      }
    }, 50);
  };

  const preloadResults = (quizAnswers: any) => {
    // Store that we're preloading
    setIsPreloading(true);
    
    // Start fetching results in the background
    fetch('/api/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: quizAnswers }),
    })
    .then(response => response.json())
    .then(data => {
      // Store preloaded results
      setPreloadedResults(data);
      setIsPreloading(false);
    })
    .catch(error => {
      console.error('Error preloading results:', error);
      setIsPreloading(false);
    });
  };

  useEffect(() => {
    if (showResult) {
      
      setTimeout(() => {
        handleScrollTo("result");
      }, 100);
    }
  }, [showResult]);

  const handleStartOver = () => {
    setAnswers({});
    setShowResult(false);
    setIsLoadingResults(false);
    setPreloadedResults(null); // Clear preloaded results
    setIsPreloading(false);    // Reset preloading state
    handleScrollTo("question-0");
  };

  return (
    <div>
      <div id="start" className="container">
        <header>
          <div className="wrapper">
            <div className="container-header-content">
              <h1>Your New Best Feline Friend</h1>

              <p>
                Answer 6 questions to find your perfect
                feline companion!
              </p>

              <button
                onClick={handleStartOver}
                className="btn btn-scroll-down btn-dark"
              >
                Let's Get Started!
              </button>
            </div>
          </div>
        </header>
      </div>

      <div id="quiz">
        <Quiz
        answers={answers}
        onAnswer={(name:string, value:string) => setAnswers((prev) => ({ ...prev, [name]: value }))}
          handleScrollTo={handleScrollTo}
          onComplete={handleQuizComplete}
          onAllQuestionsAnswered={(answers: any) => {
            // Start preloading results
            preloadResults(answers);
          }}
        />
      </div>

      {showResult && (
        <div
          id="result"
          className="container"
        >
          <div className="wrapper">
            <Result 
              key={resultKey}
              answers={answers} 
              onStartOver={handleStartOver}
              preloadedResults={preloadedResults}
            />
          </div>
        </div>
      )}
    </div>
  );
}
      

    