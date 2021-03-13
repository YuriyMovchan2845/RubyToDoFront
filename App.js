import React from 'react'
import './App.scss'
import Authorization from './components/Authorization'
import Main from './components/Main'
import Registration from './components/Registration'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom"


export default class App extends React.Component {

  render(){
    return(
      <Router>
        <Switch>
          <Route exact path='/' component={Main} />
          <Route path='/authorization' component={Authorization} />
          <Route path='/registration' component={Registration} />
        </Switch>
      </Router>
    );
  }
}