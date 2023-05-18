import React from 'react';

const starStyles = {
  display: 'inline-block',
  color: '#fdd835',
  cursor: 'pointer',
};

const emptyStarStyles = {
  ...starStyles,
  color: '#ccc',
};

const starRatingStyles = {
  fontSize: '24px',
};

const StarRating = ({ rating, setRating }) => {
    console.log(rating)
  const handleRatingClick = (newRating) => {
    if (rating === newRating) {
      setRating(newRating - 0.5);
    } else {
      setRating(newRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.floor(rating);
      const starStyle = isFilled ? starStyles : emptyStarStyles;
      const starSymbol = isFilled ? '★' : '☆';

      stars.push(
        <span
          key={i}
          style={starStyle}
          onClick={() => handleRatingClick(i)}
        >
          {starSymbol}
        </span>
      );
    }
    return stars;
  };

  return (
    <div style={starRatingStyles}>
      {renderStars()}
    </div>
  );
};

export default StarRating;
