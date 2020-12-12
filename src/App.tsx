import React from 'react';
import { Route, BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Home from './components/Home';

class App extends React.Component {
	render() {
		return (
			<Router>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/about">About</Link>
					</li>
					<li>
						<Link to="/dashboard">Dashboard</Link>
					</li>
				</ul>

				<hr />
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route path="/about">
						<About />
					</Route>
					<Route path="/dashboard">
						<Dashboard />
					</Route>
				</Switch>
			</Router>
		);
	}
}

export default App;
