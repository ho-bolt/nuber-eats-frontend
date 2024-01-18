import React from "react";
import { Link } from "react-router-dom";
import { FormError } from "../components/form-error";
import { FormTitle } from "../components/form-title";
import { Helmet } from "react-helmet-async";

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <Helmet>
      <FormTitle title={"Page Not Found"}></FormTitle>
    </Helmet>
    <h4 className="font-medium text-base mb-5">
      The page you are looking for does not exist or has moved{" "}
    </h4>

    <Link className="hover:underline text-black" to="/">
      {" "}
      Nuber Eats &rarr;
    </Link>
  </div>
);
