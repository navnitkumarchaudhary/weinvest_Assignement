import React, { Component } from 'react';
import './App.css';
import * as Api from './api/Api';
import { connect } from 'react-redux';
import LoadingIcon from './components/LoadingIcon';
import { savAnswer } from './store/action/Action';
import Quiz from '../src/components/childcomponent/Quiz';
import AnswerItem from '../src/components/childcomponent/AnswerItem';

let timerId = null;
class App extends Component {

  state = {
    counter: 0,
    questionId: 1,
    question: '',
    answer: '',
    answerOptions: [],
    questionList: [],
    showResult: false,
    isLoading: false,
    isError: false,
    countDownTime: 10
  };


  componentDidMount() {

    this.setState({ isLoading: true })

    Api.getQuestionList().then(resp => {
      // console.log(resp);
      this.setState({
        questionList: resp.results,
        isLoading: false,
        isError: false,
        question: resp.results[0].question,
        answerOptions: this.getAnswerlist(resp.results[0])
      })
      this.calculateCountDownTimer();
    }).catch(err => {
      console.error(err);
      this.setState({
        questionList: [],
        isLoading: false,
        isError: true,
        question: "",
        answerOptions: []
      })
    })
  }

  // get all Answer options
  getAnswerlist = (item) => {
    let alloptions = [];
    if (item) {
      alloptions = [...item.incorrect_answers, item.correct_answer];
    }
    return alloptions;
  }


  // on selection of any option of any question
  onAnswerSelected = (event) => {

    this.setState({
      answer: event.currentTarget.value
    });
    // console the submited answer as per requirement

    let { questionList, questionId, counter } = this.state;

    if (event.currentTarget.value) {
      console.log("submitted answer is", event.currentTarget.value, "which is", this.checkGivenAnswertype(questionList[counter], event.currentTarget.value));
      this.props.onsubmitanswer(questionId, event.currentTarget.value, this.checkGivenAnswertype(questionList[counter], event.currentTarget.value), this.getIndexOfSelectedOption(event.currentTarget.value));
    }

    this.checkNextQestionCondition();
  }


  // get the index of selected option
  getIndexOfSelectedOption = (selectedoption) => {
    let { answerOptions } = this.state;
    if (answerOptions) {
      for (let i = 0; i < answerOptions.length; i++) {
        if (answerOptions[i] === selectedoption) {
          return i;
        }
      }
    }
    return 0;
  }
  // check that Answer is right or wrong
  checkGivenAnswertype = (item, selectedoption) => {
    if (selectedoption === item.correct_answer) {
      return true;
    }
    return false;
  }

  // check next question condition
  checkNextQestionCondition = () => {
    let { questionList, questionId } = this.state;
    if (questionId < questionList.length) {
      if (timerId) {
        clearInterval(timerId);
      }
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setState({ showResult: true, countDownTime: 0 }), 300);
    }
  }

  // set next question after submit the answer
  setNextQuestion = () => {
    let { questionList, counter, questionId } = this.state;
    counter = counter + 1;
    questionId = questionId + 1;
    if (questionList && questionList.length >= questionId) {
      this.setState({
        counter: counter,
        questionId: questionId,
        question: questionList[counter].question,
        answerOptions: this.getAnswerlist(questionList[counter]),
        answer: '',
        countDownTime: 10
      });

      this.calculateCountDownTimer();
    }
  }


  // main function to call timer function for each question
  calculateCountDownTimer = () => {
    timerId = null;
    timerId = setInterval(() => this.countDownTimer(), 1000);
  }

  // call this function after every one sec
  countDownTimer = () => {
    // Update the count down every 1 second
    let { countDownTime } = this.state;
    let seconds = Math.floor(countDownTime - 1);
    countDownTime = seconds;
    if (countDownTime > 0) {
      this.setState({
        countDownTime: countDownTime
      })
    }

    // If the count down is over, clear the previos timer & call for the next question 
    if (countDownTime <= 0) {
      clearInterval(timerId);
      timerId = null;
      this.checkNextQestionCondition();
    }
  }


  // setup of quiz question
  renderQuiz = () => {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={this.state.questionList.length}
        onAnswerSelected={this.onAnswerSelected}
      />
    );
  }

  // set the result
  renderResult = () => {
    let { questionansList } = this.props;
    let answerlistcontent = null;
    let zero_count = 0, one_count = 0, two_count = 0, three_count = 0;
    if (questionansList && questionansList.length > 0) {
      // loop to check foe all the answer should not be same as mentiones in assignment
      for (let i = 0; i < questionansList.length; i++) {
        switch (questionansList[i].answerIndex) {
          case 0:
            zero_count += 1;
            break;
          case 1:
            one_count += 1;
            break;
          case 2:
            two_count += 1;
            break;
          case 3:
            three_count += 1;
            break;
          default:
            break;
        }
      }


      if ((zero_count === questionansList.length || one_count === questionansList.length || two_count === questionansList.length || three_count === questionansList.length) && questionansList.length === this.state.questionList.length) {
        return answerlistcontent = (<div><h2>Your Score</h2><br></br><h3>Your have submitted same answer to each questions. So this will not be accpetable. </h3></div>)
      }

      answerlistcontent = (<div><h2>Your Score</h2><table ><tbody>
        {questionansList.map((item, index) => {
          return <AnswerItem key={index} questionno={item.id} answer={item.answer} answertype={item.answertype}></AnswerItem>
        })}
      </tbody></table></div>)
    } else {
      answerlistcontent = (<div><h2>Your Score</h2><br></br><h3>Your have scored 0.</h3></div>)
    }

    return answerlistcontent;
  }


  render() {
    let { isLoading, showResult, isError, countDownTime } = this.state;
    let content = null;
    let countDownTimecontent = null;

    if (isLoading) {
      content = <LoadingIcon></LoadingIcon>
    } else if (isError) {
      content = (<div><span>Something went wrong. Please check your internet connection.</span></div>)
    } else {
      countDownTimecontent = `Timer : ${countDownTime} Sec`
      content = (<div>{showResult ? this.renderResult() : this.renderQuiz()}</div>)
    }

    return (
      <div className="App">
        <div className="App-header">
          <div>
            <span className="header">Trivia Game</span>
            <span className="timer">{countDownTimecontent}</span>
          </div>
        </div>

        <div className="container">
          {content}
        </div>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { questionansList } = state;

  return {
    questionansList
  }
}

let mapDispatchToProps = (dispatch) => {

  return {
    onsubmitanswer: (questionId, option, anstype, answerIndex) => {
      dispatch(savAnswer(questionId, option, anstype, answerIndex))
    }
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(App);
