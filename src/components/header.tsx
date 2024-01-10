import React from 'react'

import nuberLogo from '../images/uber-eats-logosvg.svg'
import { useMe } from '../hooks/useMe'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom'

// 이 header에서 api로 가지 않고 캐시로 간다.
export const Header: React.FC = () => {
  const { data } = useMe()

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-2xl text-white">
          {' '}
          <span>Please verify Your Email</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xlg:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <img src={nuberLogo} className="w-48 " alt="Nuber Eats" />
          <span className="text-xs">
            <Link to="/my-profile">
              <FontAwesomeIcon icon={faUser} className="text-2xl" />
            </Link>
          </span>
        </div>
      </header>
    </>
  )
}
