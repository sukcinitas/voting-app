import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { receiveCurrentUser, AppState, ActionTypes } from '../../redux/actions';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

axios.defaults.withCredentials = true;

interface ILoginDispatchProps {
  login: (user:AppState) => void,
};

type AllProps = AppState & ILoginDispatchProps;

interface ILoginState {
  username:string,
  password:string,
  errorMessage:string,
};

class Login extends React.Component<AllProps, ILoginState> {
  static propTypes: { login: PropTypes.Validator<(...args: any[]) => any>; };
  constructor(props:AllProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    if(e.currentTarget.name === 'username') {
      this.setState({
        username: e.currentTarget.value,
      });
    }
    if( e.currentTarget.name === 'password') {
    this.setState({
      password: e.currentTarget.value,
    });
    }
  }

  handleSubmit(e:React.MouseEvent<HTMLButtonElement>) {
    const { username, password } = this.state;
    const { login } = this.props;
    e.preventDefault();
    axios.post('http://localhost:8080/api/user/login', { username, password })
      .then((res) => {
        if (res.data.isAuthenticated) {
          login(res.data.sessionUser);
        } else {
          this.setState({ errorMessage: res.data.error });
        }
      });
  }

  render() {
    const { errorMessage } = this.state;
    return (
      <form className="form">

        <h1>Login</h1>

        <label
          htmlFor="username"
          className="label"
        >
          Username
        </label>
        <input type="text" name="username" id="username" onChange={this.handleChange} className="input" />

        <label
          htmlFor="password"
          className="label"
        >
          Password
        </label>
        <input type="password" name="password" id="password" onChange={this.handleChange} className="input" />

        <button data-testid="login-btn" type="button" onClick={this.handleSubmit} className="label">Login</button>

        <ErrorMessage errorMessage={errorMessage} />

        <span>
          Do not have an account?
          <Link to="/user/register">Register</Link>
        </span>

      </form>
    );
  }
}

const mapDispathToProps = (dispatch:Dispatch<ActionTypes>) => ({
  login: (user:AppState) => dispatch(receiveCurrentUser(user)),
});

export default connect<{}, ILoginDispatchProps>(null, mapDispathToProps)(Login);
