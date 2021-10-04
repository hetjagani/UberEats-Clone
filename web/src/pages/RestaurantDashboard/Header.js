import * as React from 'react';
import { useStyletron } from 'baseui';
import { Layer } from 'baseui/layer';
import { AppNavBar, setItemActive } from 'baseui/app-nav-bar';
import { useSelector } from 'react-redux';
import { RiEdit2Line, RiLogoutBoxRLine } from 'react-icons/ri';
import { CgList } from 'react-icons/cg';
import { AiOutlineUser } from 'react-icons/ai';
import { GrHome } from 'react-icons/gr';
import { useHistory } from 'react-router';
import { clearData } from '../../utils/clearData';

const Header = () => {
  const [css, theme] = useStyletron();

  const loginRestaurant = useSelector((state) => {
    return state.restaurants.loginRestaurant;
  });

  const [userItems, setUserItems] = React.useState([
    { icon: GrHome, label: 'Home' },
    { icon: AiOutlineUser, label: 'Customers' },
    { icon: CgList, label: 'Orders' },
    { icon: RiEdit2Line, label: 'Edit Profile' },
    { icon: RiLogoutBoxRLine, label: 'Logout' },
  ]);

  const imgURL =
    loginRestaurant.media && loginRestaurant.media.length > 0 && loginRestaurant.media[0].url;

  const history = useHistory();

  const handelNavItem = (item) => {
    switch (item.label) {
      case 'Home':
        history.push('/dashboard');
        break;
      case 'Customers':
        history.push('/customers');
        break;
      case 'Edit Profile':
        history.push('/details/update');
        break;
      case 'Orders':
        history.push('/orders/restaurants');
        break;
      case 'Logout':
        clearData();
        window.location.href = '/auth/login';
        break;
    }
  };

  return (
    <div>
      <Layer>
        <div
          className={css({
            boxSizing: 'border-box',
            width: '100vw',
            position: 'fixed',
            top: '0',
            left: '0',
          })}
        >
          <AppNavBar
            onMainItemSelect={() => alert(1)}
            title={loginRestaurant.name}
            userItems={userItems}
            onUserItemSelect={handelNavItem}
            username={loginRestaurant.name}
            userImgUrl={imgURL}
          />
        </div>
      </Layer>
    </div>
  );
};

export default Header;
