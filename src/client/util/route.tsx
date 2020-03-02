/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
// import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { AppState } from '../redux/actions';
import { RouteComponentProps } from 'react-router-dom';
// with Router is needed sot that Auth and Protected children would
// have certain properties: history, etc.

const mapStateToProps = (state:AppState) => ({
  isLoggedIn: Boolean(state.userId),
});
interface RouteProps extends RouteComponentProps{
  path:string,
};
interface Props {
  isLoggedIn:boolean,
  component:any,
};
type AllProps = Props & RouteProps;

const Auth:React.FunctionComponent<AllProps> = ({ isLoggedIn, path, component: Component }) => (
  <Route
    path={path}
    render={(props) => (
      isLoggedIn ? <Redirect to="/" from="/" /> : <Component {...props} />
    )}
  />
);

const Protected:React.FunctionComponent<AllProps> = ({ isLoggedIn, path, component: Component }) => (
  <Route
    path={path}
    render={(props) => (
      isLoggedIn ? <Component {...props} /> : <Redirect to="/user/login" from="/" />
    )}
  />
);

// Auth.propTypes = {
//   isLoggedIn: PropTypes.bool.isRequired,
//   path: ReactRouterPropTypes.path.isRequired,
//   component: PropTypes.elementType.isRequired,
// };

// Protected.propTypes = {
//   isLoggedIn: PropTypes.bool.isRequired,
//   path: ReactRouterPropTypes.path.isRequired,
//   component: PropTypes.Profile.isRequired,
// };

export const AuthRoute = withRouter(
  connect(mapStateToProps)(Auth)
);

export const ProtectedRoute = withRouter(
  connect(mapStateToProps)(Protected)
);