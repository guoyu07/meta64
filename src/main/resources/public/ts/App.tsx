import * as ReactRouter from 'react-router-dom';
import * as React from 'react';

//todo-2: get these types of imports working.
//see: https://github.com/webpack-contrib/css-loader
//import './App.css';
import { Search } from './pages/Search';
import { Timeline } from './pages/Timeline';
import { Home } from "./pages/Home";

/* This code was part of my original experiment that used a 'router' but i am not currently
using a router and the entire SPA runs at Home.tsx
*/

export class App extends React.Component {
  constructor() {
    super(null);
    console.log("App element constructed.");
  }

  render() {
    console.log("App element rendering.");
    return (
      <ReactRouter.BrowserRouter>
        <div>
          <ReactRouter.Route exact path="/" component={Home} />
          <ReactRouter.Route exact path="/search" component={Search} />
          <ReactRouter.Route exact path="/timeline" component={Timeline} />
        </div>
      </ReactRouter.BrowserRouter>
    );
  }
}

