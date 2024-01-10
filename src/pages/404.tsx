import React from 'react'
import { Link } from 'react-router-dom'

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <h2 className="font-semibold text-3xl mb-3">Page Not Found.</h2>
    <h4 className="font-medium text-base mb-5">
      The page you are looking for does not exist or has moved{' '}
    </h4>

    <Link className="hover:underline text-black" to="/">
      {' '}
      Nuber Eats &rarr;
    </Link>
  </div>
)
