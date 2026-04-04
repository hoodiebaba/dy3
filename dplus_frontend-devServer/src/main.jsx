import React from 'react'
import ReactDOM from 'react-dom/client'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import App from './App.jsx'
import './index.css'

/** Legacy inline handlers in `index.html` (e.g. copyToClipboard) expect global Swal — CDN removed. */
if (typeof window !== 'undefined') {
  window.Swal = Swal
}

import 'mapbox-gl/dist/mapbox-gl.css'

import "maplibre-gl/dist/maplibre-gl.css";
import '@deck.gl/widgets/stylesheet.css';

import { BrowserRouter } from 'react-router-dom'  
import { Provider } from 'react-redux'
import store from './store'
import * as Unicons from '@iconscout/react-unicons';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename='/'>
        <App />
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>,
)
