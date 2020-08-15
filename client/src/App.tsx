import React, { FC } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { Game } from './Game'
import { Home } from './Home'

const App: FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/game/:token">
          <Game />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
