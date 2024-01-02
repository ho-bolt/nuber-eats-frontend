import React from 'react'
import { LoggedOutRouter } from './routers/logged-out-router'
import { gql, useQuery, useReactiveVar } from '@apollo/client'
import { LoggedInRouter } from './routers/logged-in-router'
import { isLoggedInVar } from './apollo'

// @client를 뒤에 붙여줘야 서버한데 안가고 client cache로 간다.

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar)
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />
}

export default App
