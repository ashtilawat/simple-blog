import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@fontsource/space-mono/700.css';
import { extendTheme, ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Auth0Provider } from '@auth0/auth0-react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
  fonts: {
    heading: `'Space Mono', 'sans-serif'`
  }
};

const theme = extendTheme({ config });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
  >
    <ChakraProvider resetCSS={true} theme={theme}>
      <React.StrictMode>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </ChakraProvider>
  </Auth0Provider>
);
