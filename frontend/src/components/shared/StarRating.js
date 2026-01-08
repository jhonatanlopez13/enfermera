import React from 'react';

const StarRating = ({ rating, onRatingChange, readOnly = false, size = 'fs-5' }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="d-flex align-items-center">
            {stars.map((star) => (
                <i
                    key={star}
                    className={`bi ${star <= rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'
                        } ${size} me-1 ${!readOnly ? 'cursor-pointer' : ''}`}
                    style={{ cursor: !readOnly ? 'pointer' : 'default' }}
                    onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
                    onMouseEnter={(e) => {
                        if (!readOnly) {
                            e.target.classList.remove('bi-star');
                            e.target.classList.add('bi-star-fill');
                            e.target.classList.add('text-warning');
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!readOnly && star > rating) {
                            e.target.classList.remove('bi-star-fill');
                            e.target.classList.remove('text-warning');
                            e.target.classList.add('bi-star');
                        }
                    }}
                ></i>
            ))}
            <span className="ms-2 text-muted fw-bold">
                {rating > 0 ? rating.toFixed(1) : '0.0'}
            </span>
        </div>
    );
};

export default StarRating;
