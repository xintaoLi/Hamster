import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PlayingGame from './Playing'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<PlayingGame />, document.getElementById('root'));
registerServiceWorker();
