import * as React from 'react';
import { useStyletron } from 'baseui';
import { Layer } from 'baseui/layer';
import { ChevronDown, Delete, Overflow, Upload } from 'baseui/icon';
import { AppNavBar, setItemActive } from 'baseui/app-nav-bar';
import { useSelector } from 'react-redux';
import { RiEdit2Line, RiLogoutBoxRLine } from 'react-icons/ri';

const Header = () => {
  const [css, theme] = useStyletron();

  const loginRestaurant = useSelector((state) => {
    return state.restaurants.loginRestaurant;
  });

  const [userItems, setUserItems] = React.useState([
    { icon: RiEdit2Line, label: 'Edit Profile' },
    { icon: RiLogoutBoxRLine, label: 'Logout' },
  ]);

  const imgURL =
    loginRestaurant.media && loginRestaurant.media.length > 0 && loginRestaurant.media[0].url;

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
            title={loginRestaurant.name}
            userItems={userItems}
            onUserItemSelect={(item) => console.log('user', item)}
            username={loginRestaurant.name}
            userImgUrl={imgURL}
          />
        </div>
      </Layer>
    </div>
  );
};

export default Header;
