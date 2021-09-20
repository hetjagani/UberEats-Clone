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

function App() {
  const { role, id } = getLoginDetails();

  const { type, message, description } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (type && message && description) {
      toast[type](`${message} \n${description}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [description, type, message]);

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
            component={(props) => <DetailsPage {...props} loginDetails={{ id, role }} />}
          />
          <Route exact path="/restaurants" component={(props) => <div>Restaurants Page</div>} />
          <Route exact path="/dashboard" component={(props) => <RestaurantDashboard />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
