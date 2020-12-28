import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { receiveCurrentUser } from '../../redux/actions';
import checkValidity from '../../util/checkValidity';

axios.defaults.withCredentials = true;

const Register = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    usernameErr: '',
    emailErr: '',
    passwordErr: '',
    usernameTaken: false,
    emailTaken: false,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = e.currentTarget;
    const newErrors = { ...errors };
    switch (name) {
      case 'username':
        newErrors.usernameErr =
          e.currentTarget.value.length < 5 ||
          e.currentTarget.value.length > 30
            ? 'Username must be 5-30 characters long!'
            : '';
        setUsername(value);
        break;
      case 'email':
        newErrors.emailErr = checkValidity.checkEmail(
          e.currentTarget.value,
        );
        setEmail(value);
        break;
      case 'password':
        newErrors.passwordErr = checkValidity.checkPassword(
          e.currentTarget.value,
        );
        setPassword(value);
        break;
      default:
        return;
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { usernameErr, emailErr, passwordErr } = errors;
    if (usernameErr !== '' || emailErr !== '' || passwordErr !== '') {
      return;
    }

    axios
      .post('/api/user/register', { username, email, password })
      .then(
        (res) => {
          const newErrors = {
            ...errors,
            usernameTaken: res.data.username_taken || false,
            emailTaken: res.data.email_taken || false,
          };
          setErrors(newErrors);
          if (res.data.success) {
            dispatch(receiveCurrentUser(res.data.sessionUser));
          }
        },
        (err) => {
          setErrorMessage(
            err.response.data.message ||
              `${err.response.status}: ${err.response.statusText}`,
          );
        },
      );
  };

  const {
    usernameErr,
    passwordErr,
    emailErr,
    usernameTaken,
    emailTaken,
  } = errors;
  return (
    <div>
      <form className="form">
        <h1 className="heading form__heading">Register</h1>
        <label htmlFor="username" className="form__label">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={handleChange}
          className="form__input"
          required
          placeholder="Example: Vardenis"
        />
        <span className="form__notes">{` ${usernameErr}`}</span>

        <label htmlFor="email" className="form__label">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={handleChange}
          className="form__input"
          required
          placeholder="Example: vardenis@email.com"
        />
        <span className="form__notes"> {emailErr}</span>

        <label
          htmlFor="password"
          className="form__label"
          title="Password must be at least 10 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character!"
        >
          Password
          <FontAwesomeIcon
            icon={
              isPasswordVisible
                ? ['far', 'eye-slash']
                : ['far', 'eye']
            }
            className="eye-icon"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            title={
              isPasswordVisible ? 'Hide password!' : 'Show password!'
            }
          />
        </label>
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          name="password"
          id="password"
          onChange={handleChange}
          className="form__input"
          required
        />
        <span className="form__notes"> {passwordErr}</span>

        <div>
          <span className="form__notes">
            {usernameTaken ? ' Username is already in use' : ''}
          </span>
          <span className="form__notes">
            {emailTaken ? ' Email is already in use' : ''}
          </span>
          {errorMessage && (
            <ErrorMessage>{errorMessage}</ErrorMessage>
          )}
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="btn btn--submit"
          disabled={!username || !email || !password}
        >
          Register
        </button>
        <span className="form__notes--additional">
          Already have an account?{' '}
          <Link to="/user/login" className="link form__link">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
