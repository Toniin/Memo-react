import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// serviceWorker permet de faire un lien entre le système d'exploitation 
// et le navigateur (notification, ...) ==> VOIR LE PWA
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
