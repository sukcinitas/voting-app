/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import ErrorMessage from '../ErrorMessage/ErrorMessage.jsx';
import './CreatePollForm.css';

axios.defaults.withCredentials = true;

class CreatePollForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      question: '',
      optionCount: 2,
      options: [1, 2],
      option1: '',
      option2: '',
      errorMessage: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addOption = this.addOption.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { history, username } = this.props;
    const {
      options, name, question, option1, option2,
    } = this.state;
    if (!name || !question || !option1 || !option2) {
      this.setState({
        errorMessage: 'Poll name, question/statement and at least two options are required for submission!',
      });
      return;
    }
    const optionsList = {};
    options.forEach((option) => {
      if (this.state[`option${option}`] === '') {
        return;
      }
      optionsList[this.state[`option${option}`]] = 0;
    });
    const poll = {
      name,
      question,
      options: optionsList,
      createdBy: username,
    };
    axios.post('http://localhost:8080/api/user/create-poll', poll)
      .then((res) => {
        if (res.data.redirect) {
          history.push(`/polls/${res.data.id}`);
        }
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.response.data,
        });
      });
  }

  addOption(e) {
    e.preventDefault();
    const { optionCount } = this.state;
    const optionName = `option${optionCount + 1}`;
    this.setState((prevState) => ({
      optionCount: prevState.optionCount + 1,
      options: [...prevState.options, prevState.optionCount + 1],
      [optionName]: '',
    }));
  }

  render() {
    const {
      name, question, options, errorMessage,
    } = this.state;
    const optionsList = options.map((item) => (
      <input
        key={`option${item}`}
        aria-label={`option${item}`}
        className="input--poll"
        type="text"
        name={`option${item}`}
        onChange={this.handleChange}
        value={this.state[`option${item}`]}
      />
    ));
    return (
      <form className="form--poll">

        <h1 className="header1">Create</h1>
        <h1 className="header2">Poll</h1>

        <label
          className="label--poll"
          htmlFor="name"
        >
          Poll name
        </label>
        <input
          className="input--poll"
          type="text"
          id="name"
          name="name"
          onChange={this.handleChange}
          value={name}
        />


        <label
          className="label--poll"
          htmlFor="question"
        >
          Poll question/statement
        </label>
        <input
          className="input--poll"
          type="text"
          id="question"
          name="question"
          onChange={this.handleChange}
          value={question}
        />

        <label className="label--poll" htmlFor="answers">Poll options</label>
        <div id="options" name="answers">
          {optionsList}
        </div>

        <button type="button" onClick={this.addOption}> + </button>
        <button type="submit" onClick={this.handleSubmit}>Submit</button>

        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </form>
    );
  }
}

CreatePollForm.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  username: state.username,
});

export default connect(mapStateToProps)(CreatePollForm);
