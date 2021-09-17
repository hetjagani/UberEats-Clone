import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { Provider } from 'react-redux';
import { LightTheme, BaseProvider, styled } from 'baseui';
import store from './store';

import LandingPage from './pages/LandingPage/LandingPage';
import AuthPage from './pages/AuthPage/AuthPage';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import DetailsPage from './pages/DetailsPage/DetailsPage';
import getLoginDetails from './utils/getLoginDetails';

const engine = new Styletron();

function App() {
  const loginDetails = getLoginDetails();
  return (
    <Provider store={store}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme}>
          <Router>
            {!loginDetails ? (
              <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route
                  path="/auth/login"
                  component={(props) => <AuthPage {...props} flow="login" />}
                />
                <Route
                  path="/auth/registeruser"
                  component={(props) => <AuthPage {...props} flow="register" role="customer" />}
                />
                <Route
                  path="/auth/registerres"
                  component={(props) => <AuthPage {...props} flow="register" role="restaurant" />}
                />
              </Switch>
            ) : (
              <Switch>
                <Route
                  exact
                  path="/details"
                  component={(props) => <DetailsPage {...props} loginDetails={loginDetails} />}
                />
                <Route
                  exact
                  path="/restaurants"
                  component={(props) => <AuthPage {...props} flow="register" role="restaurant" />}
                />
                <Route
                  exact
                  path="/restaurants/dashboard"
                  component={(props) => <AuthPage {...props} flow="register" role="restaurant" />}
                />
                {loginDetails.role === 'customer' ? (
                  <Route path="*" component={LandingPage} />
                ) : (
                  <Route path="*" component={LandingPage} />
                )}
              </Switch>
            )}
          </Router>
        </BaseProvider>
      </StyletronProvider>
    </Provider>
  );
}

export default App;
