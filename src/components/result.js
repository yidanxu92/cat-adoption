"use client"

import { useState, useEffect } from 'react';

const Result = ({ answers, onStartOver, preloadedResults }) => {
  const [loading, setLoading] = useState(!preloadedResults);
  const [matchedCats, setMatchedCats] = useState(preloadedResults?.data || []);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Always fetch fresh results when the component mounts
    const fetchMatchedCats = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers }),
        });
        
       
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error('Non-JSON response');
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'failed to get matched cats');
        }
        
        setMatchedCats(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedCats();
  }, [answers]); // Only depend on answers

  if (loading) {
    return (
      <div className="result-container">
        <h2>Searching for your perfect feline friend...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={onStartOver} className="btn btn-dark">
          Start over
        </button>
      </div>
    );
  }

  if (matchedCats.length === 0) {
    return (
      <div className="result-container">
        <h2>No matching cats found</h2>
        <p>Please try different choices</p>
        <button onClick={onStartOver} className="btn btn-dark">
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="result-container">
      <h3>Your New Best Feline Friend Is</h3>
    
      <div className="matched-cats">
        {matchedCats.map((cat, index) => (
          
          <div key={cat._id} className="cat-card"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <h2>{cat.name}</h2>
            <img src={cat.img} alt={cat.name} />
            <p><strong>Gender:</strong> {cat.details.gender}</p>
            <p><strong>Breed:</strong> {cat.details.breed}</p>
            <p><strong>Age:</strong> {cat.details.age}</p>
            <p>{cat.description}</p>
            <div className="traits">
              {Array.isArray(cat.details.personality) ? (
                cat.details.personality.map(trait => (
                <span key={trait} className="trait-tag">
                  {trait}
                  </span>
                  ))
                ) : (
                <span>No traits available</span>
                )}
                </div>

            <div style={{ alignSelf: 'center', marginTop: '10px' }}>
              <a 
                href={cat.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="read-more-link"
                style={{ color: '#007BFF', textDecoration: 'underline', display: 'inline-block' }}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(cat.link, '_blank', 'noopener,noreferrer');
                }}
              >
                Read more
              </a>
            </div>
              

          </div>
        ))}
      </div>
      
      <button onClick={onStartOver} className="btn btn-dark">
        start over
      </button>
    </div>
  );
};

export default Result;