import { useStyletron } from 'baseui';
import React, { useEffect, useState } from 'react';
import { H1 } from 'baseui/typography';
import Header from './Header';
import { Drawer, ANCHOR, SIZE } from 'baseui/drawer';
import { Button, SIZE as BSIZE } from 'baseui/button';
import { Input, SIZE as ISIZE, ADJOINED } from 'baseui/input';
import { Link, useHistory } from 'react-router-dom';
import getLoginDetails from '../../utils/getLoginDetails';

const LandingPage = () => {
  const [css, theme] = useStyletron();
  const main = css({
    backgroundImage: 'url("images/uber_landing.webp")',
    backgroundSize: 'cover',
    height: '100vh',
    width: '100vw',
  });

  const container = css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '30px',
    width: '80vw',
    height: '70vh',
  });

  const labelStyle = css({
    color: 'white',
    width: '256px',
    font: theme.typography.LabelMedium,
  });

  const buttonStyle = css({
    marginBottom: '20px',
    marginTop: '20px',
  });

  const history = useHistory();
  useEffect(() => {
    const loginDetails = getLoginDetails();
    if (loginDetails?.role) {
      if (loginDetails.role == 'customer') {
        history.push('/restaurants');
      } else if (loginDetails.role == 'restaurant') {
        history.push('/dashboard');
      }
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className={main}>
      <Header setIsOpen={setIsOpen} />
      <div className={container}>
        <H1 className={css({ fontWeight: 'bold' })}>Order food to your door</H1>
        <div className={css({ width: '80%', display: 'flex', justifyContent: 'flex-start' })}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />
          <Link to={`/auth/registeruser?email=${email}`}>
            <span style={{ marginLeft: '20px', width: 500 }}>
              <Button size={BSIZE.large}>Sign up</Button>
            </span>
          </Link>
        </div>
        <span className={css({ fontWeight: 'bold', margin: '5px' })}>
          Click Here to <Link to={'/auth/registerres'}>add your restaurant</Link>
        </span>
      </div>
      <Drawer
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        anchor={ANCHOR.left}
        size={SIZE.auto}
      >
        <div className={buttonStyle}>
          <Link to={'/auth/login'}>
            <Button className={buttonStyle} size={BSIZE.large}>
              <span className={labelStyle}>Sign in</span>
            </Button>
          </Link>
        </div>
        <div className={buttonStyle}>
          <Link to={'/auth/registerres'}>
            <Button className={buttonStyle} size={BSIZE.large}>
              <span className={labelStyle}>Add your restaurant</span>
            </Button>
          </Link>
        </div>
      </Drawer>
    </div>
  );
};

export default LandingPage;
