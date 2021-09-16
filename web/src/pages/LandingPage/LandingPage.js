import { useStyletron } from 'baseui';
import React, { useState } from 'react';
import { H1 } from 'baseui/typography';
import Header from './Header';
import { Drawer, ANCHOR, SIZE } from 'baseui/drawer';
import { Button, SIZE as BSIZE } from 'baseui/button';
import { Input, SIZE as ISIZE, ADJOINED } from 'baseui/input';

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
          <span style={{ marginLeft: '20px', width: 500 }}>
            <Button size={BSIZE.large}>Sign up</Button>
          </span>
        </div>
      </div>
      <Drawer
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        anchor={ANCHOR.left}
        size={SIZE.auto}
      >
        <div className={buttonStyle}>
          <Button className={buttonStyle} size={BSIZE.large}>
            <span className={labelStyle}>Sign in</span>
          </Button>
        </div>
        <div className={buttonStyle}>
          <Button className={buttonStyle} size={BSIZE.large}>
            <span className={labelStyle}>Add your restaurant</span>
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default LandingPage;
