import React, { FC } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { GameScreen } from './screens/GameScreen'
import { HomeScreen } from './screens/HomeScreen'

const App: FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/game/:token">
          <GameScreen />
        </Route>
        <Route path="/">
          <HomeScreen />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
