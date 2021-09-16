import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { Provider } from 'react-redux';
import { LightTheme, BaseProvider, styled } from 'baseui';
import { StatefulInput } from 'baseui/input';
import store from './store';

import LandingPage from './pages/LandingPage/LandingPage';

const engine = new Styletron();

function App() {
  return (
    <Provider store={store}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme}>
          <LandingPage />
        </BaseProvider>
      </StyletronProvider>
    </Provider>
  );
}

export default App;
