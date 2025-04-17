// src/app/page.tsx
"use client"
import { useState} from "react";
import Quiz from '../components/quiz';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);

  const handleStart = () => {
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);  // 切换到下一个问题或结果页面
  };


  return (
    <div>
      {currentPage === 0 && (
        <div className="page"
        style={{height: '100vh',textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
      <header>
        <h1>Your New Best Feline Friend</h1>

        <p>
          Life is tough enough without a cat. Take this quiz to find your perfect
          feline companion!
        </p>

        <button
        onClick={handleStart}
        className="btn btn-scroll-down btn-dark"
        >
          Let's Get Started!
        </button>
      </header>
      </div>
      )}

      {currentPage > 0 && currentPage < 10 && (
        <Quiz 
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        />
      )}

{currentPage === 10 && (
        <div
          className="page"
          style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
        >
          <h2>Your perfect feline companion is on their way!</h2>
          <button onClick={() => setCurrentPage(0)}>
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}