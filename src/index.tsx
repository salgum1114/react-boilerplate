import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let rootElement = document.getElementById('root');
if (!rootElement) {
	rootElement = document.createElement('div');
	rootElement.id = 'root';
	document.body.append(rootElement);
}

const render = (Component: any) => ReactDOM.render(<Component />, rootElement);

render(App);

if (module.hot) {
	module.hot.accept('./App', () => render(App));
}
