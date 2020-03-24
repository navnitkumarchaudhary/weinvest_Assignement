const SAVE_QUESTIONS_ANSWER = "SAVE_QUESTIONS_ANSWER";

const savAnswer = (questionId, option, anstype, answerIndex) => {
    return {
        type: SAVE_QUESTIONS_ANSWER,
        questionId,
        option,
        anstype,
        answerIndex
    }
}

export {
    SAVE_QUESTIONS_ANSWER,
    savAnswer
}