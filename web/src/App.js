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
import AddressesPage from './pages/AddressesPage/AddressesPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage/CustomerOrdersPage';
import RestaurantOrdersPage from './pages/RestaurantOrdersPage/RestaurantOrdersPage';
import CustomersPage from './pages/CustomersPage/CustomersPage';

function App() {
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
            component={(props) => <DetailsPage {...props} update={false} />}
          />
          <Route
            exact
            path="/details/update"
            component={(props) => <DetailsPage {...props} update={true} />}
          />
          <Route
            exact
            path="/restaurants/favourites"
            component={(props) => <RestaurantsPage favs={true} />}
          />
          <Route exact path="/restaurants/:id" component={(props) => <RestaurantDetails />} />
          <Route exact path="/restaurants" component={(props) => <RestaurantsPage />} />
          <Route exact path="/orders/customers" component={(props) => <CustomerOrdersPage />} />
          <Route exact path="/orders/restaurants" component={(props) => <RestaurantOrdersPage />} />
          <Route exact path="/orders/:id" component={(props) => <CheckoutPage />} />
          <Route exact path="/cart" component={(props) => <MyCartPage />} />
          <Route exact path="/addresses" component={(props) => <AddressesPage />} />
          <Route exact path="/dashboard" component={(props) => <RestaurantDashboard />} />
          <Route exact path="/customers" component={(props) => <CustomersPage />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
