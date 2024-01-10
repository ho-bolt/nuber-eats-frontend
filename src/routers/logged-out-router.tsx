import React from 'react'
import { Switch } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Login } from '../pages/login'
import { CreateAccount } from '../pages/create-account'
import { NotFound } from '../pages/404'

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount />
        </Route>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  )
}

// react path 는 무언갈 포함하고 있다 혹은 있다면 이라는 전제를 두고 있다.
// 따라서 꼭 / 가 아니더라도 Login페이지로 이동한다.
// 혹 /afdfasf로 요청이 와도 /로 가게 된다 그래서 exact를 붙여준다.
// Switch는 한 번에 route 하나만 render하라고 알려주는 것
