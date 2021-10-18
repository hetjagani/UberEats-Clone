import { useStyletron } from 'baseui';
import { H2, H6, Label1 } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { Input } from 'baseui/input';
import { Button } from 'baseui/button';
import { Notification, KIND } from 'baseui/notification';
import axios from 'axios';
import { Select, SIZE, TYPE } from 'baseui/select';
import getLoginDetails from '../../utils/getLoginDetails';
import { useDispatch } from 'react-redux';
import { fetchAuthCustomer } from '../../actions/customers';
import { fetchAuthRestaurant } from '../../actions/restaurants';
import { setCookie } from 'react-use-cookie';
import notify from '../../utils/notify';

const AuthPage = ({ flow, role, ...props }) => {
  const [css, theme] = useStyletron();
  const container = css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
  });

  const formStyle = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
    width: '50vw',
  });

  const inputStyle = css({
    margin: '10px',
    width: '80%',
  });

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inprole, setInpRole] = useState([{ label: role, id: role }]);
  const [verifyPass, setVerifyPass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginRole, setLoginRole] = useState('');

  const history = useHistory();

  useEffect(() => {
    const email = query.get('email');
    if (email && email != '') {
      setEmail(email);
    }

    const loginDetails = getLoginDetails();
    if (loginDetails && loginDetails.role) {
      if (loginDetails.role == 'customer') {
        history.push('/restaurants');
      } else if (loginDetails.role == 'restaurant') {
        history.push('/dashboard');
      }
    }
  }, []);

  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const submitHandler = () => {
    if (flow === 'login' && (email == '' || password == '')) {
      setErrorMessage('Any field cannot be empty');
      return;
    }

    if (flow === 'register' && (email == '' || password == '' || validateEmail == '')) {
      setErrorMessage('Any field cannot be empty');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Invalid Email Address');
      return;
    }

    if (flow === 'register' && password !== verifyPass) {
      setErrorMessage('Input passwords do not match');
      return;
    }

    let authURL = '/auth/login';
    if (flow === 'register') {
      authURL = '/auth/signup';
    }

    axios
      .post(`${window.BACKEND_API_URL}${authURL}`, { email, password, role: inprole[0].id })
      .then((res) => {
        const { token } = res.data;
        setCookie('auth', token, { path: '/' });
        const tokenData = getLoginDetails();

        setLoginRole(tokenData.role);

        if (flow === 'login') {
          if (tokenData.role === 'customer') {
            // show restaurants page after login
            dispatch(fetchAuthCustomer(tokenData.id, token)).then(() => {
              history.push('/restaurants');
            });
          } else {
            // show user's restaurant details page
            dispatch(fetchAuthRestaurant(tokenData.id, token)).then(() => {
              history.push('/dashboard');
            });
          }
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        setErrorMessage(JSON.stringify(err.response.data));
      });
  };

  const focusFields = () => {
    setErrorMessage('');
  };

  if (isAuthenticated) {
    if (flow === 'register') {
      return <Redirect to={'/details'} />;
    } else {
      if (loginRole === 'customer') {
        return <Redirect to={'/restaurants'} />;
      } else if (loginRole === 'restaurant') {
        return <Redirect to={'/dashboard'} />;
      }
    }
  } else {
    return (
      <div className={container}>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 170" height="48" width="200">
            <path
              d="M787.3 105.2c0-21-16.8-37.5-38-37.5-20.9 0-38 16.5-38 37.5s17.1 37.5 38 37.5c21.2 0 38-16.5 38-37.5m31-61.4v122.9h-31.6v-11.1c-11 9.1-24.9 14.2-40 14.2-37.4 0-66.6-28.7-66.6-64.6 0-35.8 29.3-64.6 66.6-64.6 15.1 0 29 5.1 40 14.2v-11h31.6zm105 95h-23.8c-7.2 0-11.9-3.1-11.9-9.7V71.6h35.6V43.8h-35.6v-35h-31.9v35h-24v27.9h24V137c0 16.5 11.9 29.6 33.3 29.6h34.2v-27.8zm72 31c36.5 0 57.1-17.1 57.1-40.7 0-16.8-12.2-29.3-37.7-34.7l-27-5.4c-15.6-2.8-20.6-5.7-20.6-11.4 0-7.4 7.5-11.9 21.4-11.9 15.1 0 26.1 4 29.3 17.6h31.6c-1.7-25.6-20.6-42.7-58.8-42.7-33 0-56.2 13.4-56.2 39.3 0 17.9 12.8 29.6 40.3 35.3l30.1 6.8c11.9 2.3 15.1 5.4 15.1 10.2 0 7.7-9 12.5-23.5 12.5-18.2 0-28.7-4-32.7-17.6h-31.9c4.7 25.6 24.1 42.7 63.5 42.7M552.6.2h119.1v28.4h-86.9v40.7h84.6v27.6h-84.6v41.2h86.9v28.4H552.6V.2z"
              fill="#06c167"
            />
            <path
              d="M496 66.7V44.4h-8.5c-13.5 0-23.5 6.2-29.5 15.9v-15h-24.2v121.1h24.4V97.6c0-18.8 11.6-30.9 27.6-30.9H496zm-175.6 28c4.4-18.5 19.6-30.9 37.7-30.9s33.4 12.3 37.5 30.9h-75.2zM358.6 43c-36 0-63.4 28.7-63.4 62.9 0 36.1 28.5 63.2 65.6 63.2 22.5 0 40.9-9.7 53.2-25.9l-17.7-12.8c-9.2 12.1-21.3 17.8-35.6 17.8-20.8 0-37.5-14.7-40.9-34.4h100.4V106c.1-36.2-26-63-61.6-63M219 148.2c-23.7 0-42.6-18.8-42.6-42 0-23.5 19.1-42 42.6-42 23.2 0 42.3 18.5 42.3 42 .1 23.2-19 42-42.3 42m-66.5 18.3h24.2v-15.2c11.1 11.2 26.9 18 44 18 36.3 0 64.8-28.3 64.8-63.2 0-35.1-28.5-63.4-64.8-63.4-17.2 0-32.7 6.9-43.8 18V.2h-24.4v166.3zM66.6 147c23.5 0 41.6-17.8 41.6-44.2V.2h25.4v166.2h-25.2V151c-11.4 11.6-27.1 18.3-44.8 18.3-36.3 0-64.1-25.9-64.1-65.1V.2H25v102.6c0 26.9 17.9 44.2 41.6 44.2"
              fill="#142328"
            />
          </svg>
        </div>

        <div className={formStyle}>
          <div style={{ margin: '12px' }}>
            {flow === 'login' ? <H2>Welcome Back,</H2> : <H2>Welcome {role}</H2>}
          </div>

          <div className={inputStyle}>
            <Label1>Enter your email address to {flow}</Label1>
            <Input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              onFocus={focusFields}
            />
          </div>

          <div className={inputStyle}>
            <Label1>Enter password</Label1>
            <Input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onFocus={focusFields}
            />
          </div>

          {flow === 'register' && (
            <div className={inputStyle}>
              <Label1>Reenter your password</Label1>
              <Input
                value={verifyPass}
                type="password"
                onChange={(e) => setVerifyPass(e.target.value)}
                placeholder="Enter your password again"
                onFocus={focusFields}
              />
              <br />

              <Select
                backspaceRemoves={false}
                clearable={false}
                closeOnSelect={true}
                deleteRemoves={false}
                escapeClearsValue={false}
                options={[
                  { label: 'Customer', id: 'customer' },
                  { label: 'Restaurant', id: 'restaurant' },
                ]}
                value={inprole}
                ignoreCase={false}
                onBlurResetsInput={false}
                onCloseResetsInput={false}
                onSelectResetsInput={false}
                searchable={false}
                placeholder="Select Account Type"
                onChange={(params) => setInpRole(params.value)}
              />
            </div>
          )}
          {errorMessage && errorMessage != '' && (
            <Notification
              kind={KIND.negative}
              overrides={{
                Body: { style: { width: '38vw', margin: '10px' } },
              }}
            >
              {errorMessage}
            </Notification>
          )}
          <div style={{ margin: '10px', width: '50vw' }}>
            <Button $style={{ width: '80%' }} onClick={submitHandler}>
              {flow === 'login' ? 'Login' : 'Register'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default AuthPage;
