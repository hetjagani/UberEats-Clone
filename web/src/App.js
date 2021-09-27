import LandingPage from './pages/LandingPage/LandingPage';
import AuthPage from './pages/AuthPage/AuthPage';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import DetailsPage from './pages/DetailsPage/DetailsPage';
import getLoginDetails from './utils/getLoginDetails';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import RestaurantDashboard from './pages/RestaurantDashboard/RestaurantDashboard';
import RestaurantsPage from './pages/RestaurantsPage/RestaurantsPage';
import RestaurantDetails from './pages/RestaurantsPage/RestaurantDetails';
import MyCartPage from './pages/MyCartPage/MyCartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';

function App() {
  const { role, id } = getLoginDetails();

  return (
    <div>
      <ToastContainer />
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/auth/login" component={(props) => <AuthPage {...props} flow="login" />} />
          <Route
            path="/auth/registeruser"
            component={(props) => <AuthPage {...props} flow="register" role="customer" />}
          />
          <Route
            path="/auth/registerres"
            component={(props) => <AuthPage {...props} flow="register" role="restaurant" />}
          />
          <Route
            exact
            path="/details"
            component={(props) => (
              <DetailsPage {...props} loginDetails={{ id, role }} update={false} />
            )}
          />
          <Route
            exact
            path="/details/update"
            component={(props) => (
              <DetailsPage {...props} loginDetails={{ id, role }} update={true} />
            )}
          />
          <Route exact path="/restaurants/:id" component={(props) => <RestaurantDetails />} />
          <Route exact path="/restaurants" component={(props) => <RestaurantsPage />} />
          <Route exact path="/orders/:id" component={(props) => <CheckoutPage />} />
          <Route exact path="/cart" component={(props) => <MyCartPage />} />
          <Route exact path="/dashboard" component={(props) => <RestaurantDashboard />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
