import React from 'react';

const QuestionCount = props => {
  return (
    <div className="questionCount">
      Question <span>{props.counter}</span> of <span>{props.totalquestion}</span>
    </div>
  );
}


export default QuestionCount;
