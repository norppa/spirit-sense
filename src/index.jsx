import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from './main'
import Store from './Store'


import './style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Store>
            <Main />
        </Store>
    </React.StrictMode>
)
