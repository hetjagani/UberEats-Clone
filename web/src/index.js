import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import store from './store';
import { Provider } from 'react-redux';
import { LightTheme, BaseProvider } from 'baseui';
import reportWebVitals from './reportWebVitals';

const engine = new Styletron();

ReactDOM.render(
  <Provider store={store}>
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <App />
      </BaseProvider>
    </StyletronProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
