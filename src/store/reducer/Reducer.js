import { SAVE_QUESTIONS_ANSWER } from '../action/Action'

const initalstate = {
    questionansList: []
}

const reducer = (state = initalstate, action) => {
    if (action.type === SAVE_QUESTIONS_ANSWER) {
        let optionobj = {
            id: action.questionId,
            answer: action.option,
            answertype: action.anstype,
            answerIndex: action.answerIndex
        }
        let questionansList = state.questionansList.concat(optionobj);
        return Object.assign({}, state, { questionansList });
    }
    return state;
}

export default reducer;