
import axios from 'axios';
const ApiUrl = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"

// to get questionList
export const getQuestionList = () =>
  axios.get(ApiUrl)
    .then(res => res.data)


