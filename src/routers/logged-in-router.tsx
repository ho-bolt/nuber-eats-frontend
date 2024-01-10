import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Restaurants } from '../pages/client/restaurants'
import { NotFound } from '../pages/404'
import { Header } from '../components/header'
import { useMe } from '../hooks/useMe'
import { Redirect } from 'react-router-dom'
import { ConfirmEmail } from '../pages/user/confirm-email'

const ClientRoutes = () => (
  <>
    <Route path="/" exact>
      <Restaurants />
    </Route>
    <Route path="/confirm" exact>
      <ConfirmEmail />
    </Route>
  </>
)

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe()
  // 여기서 처음 호출
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wider">Loading.....</span>
      </div>
    )
  }
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        {data.me.role === 'Client' && <ClientRoutes />}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
