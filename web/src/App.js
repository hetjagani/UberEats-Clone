import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { Provider } from 'react-redux';
import { LightTheme, BaseProvider, styled } from 'baseui';
import store from './store';

import LandingPage from './pages/LandingPage/LandingPage';
import AuthPage from './pages/AuthPage/AuthPage';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

const engine = new Styletron();

function App() {
  return (
    <Provider store={store}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme}>
          <Router>
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route
                path="/auth/login"
                component={(props) => <AuthPage {...props} flow="login" />}
              />
              <Route
                path="/auth/registeruser"
                component={(props) => <AuthPage {...props} flow="register" role="user" />}
              />
              <Route
                path="/auth/registerres"
                component={(props) => <AuthPage {...props} flow="register" role="restaurant" />}
              />
            </Switch>
          </Router>
        </BaseProvider>
      </StyletronProvider>
    </Provider>
  );
}

export default App;
