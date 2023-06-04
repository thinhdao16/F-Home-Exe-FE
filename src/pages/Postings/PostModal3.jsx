import React from 'react'
import PropTypes from 'prop-types'

function PostModal3({ onNext, onBack }) {
  return (
    <>
      <div>PostMoal3</div>
      <button onClick={onNext}>Next</button>
      <button onClick={onBack}>Back</button>
    </>
  )
}

PostModal3.propTypes = {}

export default PostModal3
