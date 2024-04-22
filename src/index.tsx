import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import 'index.scss';
import React, { useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from "state";
import Pages from "pages";
import { settingsSelector } from "state/settings";
import {
  shallowEqual,
  useSelector,
} from "react-redux";


const App = () => {
  const { mode, color } = useSelector(settingsSelector, shallowEqual);
  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: [
            'Roboto',
            'sans-serif',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
        },
        palette: {
          mode,
          primary: {
            main: color,
          },
        },

      }),
    [mode, color]
  );


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/">
        <Pages />
      </BrowserRouter>
      <ToastContainer
        theme="light"
        position="top-center"
        closeButton={false}
        hideProgressBar={true}
        closeOnClick={true}
      />
    </ThemeProvider>
  )
}

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>,
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
