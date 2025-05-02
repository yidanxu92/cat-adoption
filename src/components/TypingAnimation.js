const TypingAnimation = ({ id, pathData, dashArray }) => {
  return (
    <path
      id={id}
      className="typing-animation"
      stroke="#000"
      strokeWidth="2"
      fill="none"
      d={pathData}
      strokeDasharray={dashArray}
    />
  );
};

export default TypingAnimation; 