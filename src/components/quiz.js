"use client"

import { useState} from 'react';

const Quiz = ({ currentPage, goToNextPage }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const questions = [
    {
      question: "What's your ideal way to spend a day?",
      options: [
        { text: "Exploring the forest, climbing trees, and running around!", value: "active" },
        { text: "Relaxing by a cozy fire, reading, and napping.", value: "calm" },
        { text: "Finding hidden spots to paint, draw, or just observe nature.", value: "creative" },
      ],
      name: "q1",
    },
    {
      question: "Which type of cat would you want to have as your companion?",
      options: [
        { text: "A cat that is always curious, exploring new things and places.", value: "curious" },
        { text: "A cat that loves sitting by your side, quietly enjoying the moment.", value: "calm" },
        { text: "A cat that's a bit of a mystery – loves to surprise you with its actions.", value: "independent" },
      ],
      name: "q2",
    },
    {
      question: "What's the best feature of a cat?",
      options: [
        { text: "Their sparkling eyes that seem to tell a story.", value: "intuitive" },
        { text: "Their playful antics, always keeping you entertained.", value: "playful" },
        { text: "Their ability to calm you with just a purr.", value: "soothing" },
      ],
      name: "q3",
    },
    {
      question: "On a moonlit night, you spot a group of cats in the meadow. What would you do?",
      options: [
        { text: "Join the group and play with them!", value: "sociable" },
        { text: "Sit back and watch them quietly.", value: "introverted" },
        { text: "I'll hang out near the edge and observe their behavior from a distance.", value: "independent" },
      ],
      name: "q4",
    },
    {
      question: "The river ahead seems wide and swift. A cat appears and offers to help you across. What would you do?",
      options: [
        { text: "Let the cat guide me and cross together.", value: "helpful" },
        { text: "I'll carefully cross on my own.", value: "independent" },
        { text: "I'll ask the cat to stay with me for company, even if it's tricky.", value: "supportive" },
      ],
      name: "q5",
    },
    {
      question: "You find paw prints along the lake's edge. Which one will you follow?",
      options: [
        { text: "Tiny paw prints leading to a flower meadow.", value: "kitten" },
        { text: "Medium-sized paw prints disappearing deep into the forest.", value: "adult" },
        { text: "Big, deep paw prints heading towards a large tree.", value: "senior" },
      ],
      name: "q6",
    },
    {
      question: "You meet a forest guide who can help you find your destined cat. The guide asks, 'What kind of companion do you want?'",
      options: [
        { text: "A cat with vibrant, unique fur colors!", value: "colorful" },
        { text: "A black-and-white cat, neat and elegant.", value: "black_white" },
        { text: "Any color is fine, as long as it's a good match!", value: "any" },
      ],
      name: "q7",
    },
    {
      question: "You discover a cabin in the forest where you hear children's laughter and a cat's meow. What do you think?",
      options: [
        { text: "How sweet! I'd love a cat that enjoys being around children.", value: "children_friendly" },
        { text: "I'm not sure. I'd prefer a calm cat.", value: "calm_no_children" },
      ],
      name: "q8",
    },
    {
      question: "As night falls, the forest quiets down. A cat silently approaches you. What kind of personality do you want in your new friend?",
      options: [
        { text: "Energetic and playful, always ready to have fun with me!", value: "playful" },
        { text: "Quiet and gentle, content to sit by my side.", value: "gentle" },
      ],
      name: "q9",
    },
  ];




  const handleAnswer = (questionName, value) => {
    setAnswers({ ...answers, [questionName]: value });
    setError("");
  };

  const handleNext = () => {
    const currentQuestionName = questions[currentQuestion].name;
    if (!answers[currentQuestionName]) {
      setError("Please select an answer before moving to the next question.");
    } else {
      setError("");
      goToNextPage();
    }
  };

  return (
    <div
      className="page"
      style={{ height: "100vh", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      <h2>{questions[currentPage - 1].question}</h2>
      <div className="options">
        {questions[currentPage - 1].options.map((option, idx) => (
          <div key={idx} className="option">
            <input
              type="radio"
              id={`${questions[currentPage - 1].name}-${option.value}`}
              name={questions[currentPage - 1].name}
              value={option.value}
              onChange={() => handleAnswer(questions[currentPage - 1].name, option.value)}
            />
            <label htmlFor={`${questions[currentPage - 1].name}-${option.value}`}>{option.text}</label>
          </div>
        ))}
      </div>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default Quiz;