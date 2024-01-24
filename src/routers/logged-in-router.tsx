import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { NotFound } from "../pages/404";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProtile } from "../pages/user/edit-profile";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";

const ClientRoutes = () => (
  <>
    <Route key={1} path="/" exact>
      <Restaurants />
    </Route>
    <Route key={2} path="/confirm" exact>
      <ConfirmEmail />
    </Route>
    <Route key={3} path="/edit-profile" exact>
      <EditProtile />
    </Route>
    <Route key={4} path="/search" exact>
      <Search />
    </Route>
    <Route key={5} path="/category/:slug">
      <Category />
    </Route>
    <Route key={6} path="/restaurant/:id">
      <Restaurant />
    </Route>
  </>
);

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  // 여기서 처음 호출
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wider">Loading.....</span>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        {data.me.role === "Client" && <ClientRoutes />}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
