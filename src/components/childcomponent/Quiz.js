import React from 'react';
import QuizQuestion from './QuizQuestion';
import QuizCount from './QuizCount';
import QuizOption from './QuizAnsOption';

const Quiz = props => {

  return (
    <div key={props.questionId}>
      <QuizCount counter={props.questionId} totalquestion={props.questionTotal} />
      <QuizQuestion question={props.question} />
      <ul className="answerOptions">
        {props.answerOptions.map((item, index) => {
          return <QuizOption
            key={index}
            answerContent={item}
            answer={props.answer}
            questionId={props.questionId}
            onAnswerSelected={props.onAnswerSelected}
          />
        })}
      </ul>
    </div>
  );
}

export default Quiz;
