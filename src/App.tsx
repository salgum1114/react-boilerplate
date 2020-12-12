import React from 'react';
import Helmet from 'react-helmet';
import { Route, BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Home from './components/Home';

class App extends React.Component {
	render() {
		return (
			<Router>
				<Helmet>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta name="title" content="React Boilerplate" />
					<meta name="description" content="React Boilerplate" />
					<meta property="og:title" content="React Boilerplate" />
					<meta property="og:description" content="React Boilerplate" />
					<meta property="og:type" content="website" />
					<meta property="og:site_name" content="React Boilerplate" />
					<meta property="og:locale" content="ko_KR" />
					<link rel="manifest" href={`${PUBLIC_URL}manifest.json`} />
					<link rel="shortcut icon" href={`${PUBLIC_URL}favicon.ico`} />
					<title>React Boilerplate</title>
				</Helmet>
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
