import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import 'mapbox-gl/dist/mapbox-gl.css'

import "maplibre-gl/dist/maplibre-gl.css";

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
