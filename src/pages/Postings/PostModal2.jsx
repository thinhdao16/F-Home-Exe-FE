import React from 'react'
import PropTypes from 'prop-types'

function PostModal2({ onNext, onBack }) {
  return (
    <>
      <div>PostMoal2</div>
      <button onClick={onNext}>Next</button>
      <button onClick={onBack}>Back</button>
    </>
  )
}

PostModal2.propTypes = {}

export default PostModal2
