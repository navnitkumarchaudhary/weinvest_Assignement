import React from 'react';

const AnswerItem = props => {
    return (
        <tr>
            <td>Q. No. {props.questionno}</td>
            <td>{props.answer}</td>
            <td>{props.answertype.toString()}</td>
        </tr>
    )
}

export default AnswerItem;