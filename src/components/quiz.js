"use client"

import { useState, useEffect } from 'react';

const Quiz = ({ answers,handleScrollTo,onAnswer,onComplete,onAllQuestionsAnswered }) => {

  const [error, setError] = useState("");
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [highlightUnanswered, setHighlightUnanswered] = useState(false);
  const [dynamicWarnings, setDynamicWarnings] = useState({});
  const questions = [
    {
      question: "At the edge of the jungle, three cats appear, offering to guide you on this adventure. Who will you choose?",
      options: [
        { text: "A lively kitten bouncing around you, eager to start the journey.", value: ["Playful", "Outgoing"] },
        { text: "A quiet cat sitting under a tree, gazing at you with a calm demeanor.", value: ["Reserved", "Timid"] },
        { text: "A warm and affectionate cat that rubs against your leg, purring softly.", value: ["Affectionate", "Cuddly"] },
      ],
      name: "q1",
    },
    {
      question: "You find paw prints on the forest floor, each leading to a different destination. Which path will you follow?",
      options: [
        { text: "Tiny prints leading to a meadow full of blooming flowers.", value: ["Kitten"] },
        { text: "Medium-sized prints winding through a shady trail.", value: ["Young Adult"] },
        { text: "Large, deep prints heading toward a towering ancient tree.", value: ["Adult", "Senior"] },
      ],
      name: "q2",
    },
    {
      question: "At a shimmering lake, a cat asks, 'Who would you like to spend time with?'",
      options: [
        { text: "A playful group of children chasing butterflies with the cat.", value: ["comfortable with kids"] },
        { text: "A curious dog sniffing around and playing with the cat.", value: ["comfortable with dogs"] },
        { text: "Other cats lounging and basking in the sun.", value: ["comfortable with other cats"] },
      ],
      name: "q3",
    },
    {
      question: "In the forest, you spot tufts of fur left behind. What catches your eye?",
      options: [
        { text: "Bright white fur shining in the sunlight.", value: ["White", "Solid"] },
        { text: "Dark black fur blending into the shadows.", value: ["Black", "Solid"] },
        { text: "A patch of multicolored fur, vivid and unique.", value: ["Tortoiseshell", "Calico", "Bicolor", "Harlequin"] },
      ],
      name: "q4",
    },
    {
      question: "Inside an old treehouse, you find drawings of different cats. Which one draws your attention?",
      options: [
        { text: "A sleek cat with a solid, classic look.", value: ["Solid", "Tuxedo"] },
        { text: "A striped tabby, with a natural and timeless pattern.", value: ["Tabby"] },
        { text: "A strikingly patterned cat with bold contrasts.", value: ["Bicolor", "Harlequin"] },
      ],
      name: "q5",
    },
    {
      question: "As you approach the jungle's edge, a cat asks, 'Where would you like me to stay?'",
      options: [
        { text: "Inside, always by your side, no matter the weather.", value: ["Affectionate", "Cuddly"] },
        { text: "Mostly outside, exploring and doing its own thing.", value: ["Independent", "Outgoing"] },
        { text: "A mix of both – content to be where it's needed.", value: ["Easy-going", "Reserved"] },
      ],
      name: "q6",
    },

    {
      question: "Ready to meet your new best friend?",
      name: "q7",
    }

  ];

  const handleAnswer = (questionName, value, currentQuestionIndex) => {
    const updatedAnswers = { ...answers, [questionName]: value };
    
    const findNextWithUpdatedAnswers = () => {
      const nextUnansweredIndex = questions.findIndex(
        (q) => q.options && !updatedAnswers[q.name]
      );
      return nextUnansweredIndex >= 0 ? nextUnansweredIndex : questions.length - 1;
    };
    
    const nextIndex = findNextWithUpdatedAnswers();
    
    if (dynamicWarnings[questionName]) {
      setDynamicWarnings(prev => {
        const newWarnings = {...prev};
        delete newWarnings[questionName];
        return newWarnings;
      });
    }
    
    
    onAnswer(questionName, value);
    setError("");

    
    const allAnswered = questions
      .filter(q => q.options)
      .every(q => updatedAnswers[q.name]);
    
    
    if (allAnswered && !allQuestionsAnswered) {
      setAllQuestionsAnswered(true);
      onAllQuestionsAnswered(updatedAnswers);
    } else if (!allAnswered && allQuestionsAnswered) {
      setAllQuestionsAnswered(false);
    }

   
    if (nextIndex < currentQuestionIndex) {
      
      setDynamicWarnings(prev => ({
        ...prev,
        [questions[nextIndex].name]: true
      }));
    }

    
    setTimeout(() => {
      handleScrollTo(`question-${nextIndex}`);
    }, 50);
  };


  const handleFinalSubmit = () => {
    const unansweredQuestions = questions.filter((q) => q.options && !answers[q.name]);
    if (unansweredQuestions.length > 0) {
      setHighlightUnanswered(true);
      setError("Please answer all questions before completing the quiz.");
      
      // Scroll to the first unanswered question
      const firstUnansweredIndex = questions.findIndex((q) => q.options && !answers[q.name]);
      if (firstUnansweredIndex >= 0) {
        handleScrollTo(`question-${firstUnansweredIndex}`);
      }
    } else {
      setHighlightUnanswered(false);
      setError("");
      onComplete(answers);
    }
  };

  // Add this effect to reset allQuestionsAnswered when answers are cleared
  useEffect(() => {
    // If answers object is empty, reset the allQuestionsAnswered state
    if (Object.keys(answers).length === 0) {
      setAllQuestionsAnswered(false);
    }
  }, [answers]);

  useEffect(() => {
    if (Object.keys(answers).length === 0) {
      setDynamicWarnings({});
    }
  }, [answers]);

  return (
    <div>  
      {questions.map((q, index) => {
        const isUnanswered = q.options && !answers[q.name] && 
          (highlightUnanswered || dynamicWarnings[q.name]);
        
        return (
          <div
            id={`question-${index}`}
            key={index}
            className={`container container-flex ${index % 2 === 0 ? 'bg-green' : 'bg-beige'} ${isUnanswered ? 'unanswered-question' : ''}`}
          >
            <div className="wrapper container-flex">
            {index !== questions.length - 1 && <div className="q-num">{index + 1}</div>}
              
              <div>
                <div className="legend">{q.question}</div>
                
                {q.options?.map((option) => {
                  const isChecked = JSON.stringify(answers[q.name]) === JSON.stringify(option.value);   
                  const checkColor = index % 2 === 0 ? "#f8f3e1" : '#696d31';
                  
                  return (
                    <div key={JSON.stringify(option.value)} style={{ margin: "10px 0" }} className="custom-radio">
                      <input
                        type="radio"
                        id={`${q.name}-${JSON.stringify(option.value)}`}
                        name={q.name}
                        value={JSON.stringify(option.value)}
                        checked={isChecked}
                        onChange={() => handleAnswer(q.name, option.value, index)}
                        style={{ display: 'none' }}
                      />
                      <label 
                        htmlFor={`${q.name}-${JSON.stringify(option.value)}`}
                        className={`radio-label ${isChecked ? 'selected' : ''}`}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          cursor: 'pointer',
                          fontFamily: 'var(--font-josefin-slab)'
                        }}
                      >
                        <i 
                          className={isChecked ? "fas fa-check-circle" : "far fa-circle"}
                          style={{ 
                            marginRight: '0.4rem',
                            color: isChecked ? checkColor : 'inherit',
                            fontSize: '1.2rem'
                          }}
                        ></i>
                        {option.text}
                      </label>
                    </div>
                  );
                })}
                
                {/* 显示警告 */}
                {isUnanswered && (
                  <div className="alert">
                    <p>Please answer this question</p>
                  </div>
                )}
                
                {index === questions.length - 1 && (
                  <button onClick={handleFinalSubmit} className="btn btn-light">
                    Yes Please!
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Quiz;