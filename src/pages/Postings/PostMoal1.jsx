import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react';

function PostMoal1({ onNext }) {
  const [isAllowedNext, setIsAllowedNext] = useState(false);

  const handleNext = () => {
    if (isAllowedNext) {
      onNext();
    } else {
      alert('Bạn cần hoàn thành các bước trước để tiếp tục.');
    }
  };

  const handleInputChange = (event) => {
    setIsAllowedNext(event.target.checked);
  };
  return (
    <>
  <h1>Component 1</h1>
      <label>
        <input
          type="checkbox"
          checked={isAllowedNext}
          onChange={handleInputChange}
        />
        Tôi đã hoàn thành các bước trước
      </label>
      <button onClick={handleNext}>Next</button>
    </>


  )
}

PostMoal1.propTypes = {}

export default PostMoal1
