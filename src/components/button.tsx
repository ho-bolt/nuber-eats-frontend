import React from 'react'

interface IButtonProps {
  canClick: boolean
  loading: boolean
  actionTest: string
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionTest,
}) => (
  <button
    className={`text-lg font-medium focus:outline-none text-white py-4 transition-colors ${
      canClick
        ? 'bg-zinc-900  hover:bg-zinc-950'
        : 'bg-zinc-400 pointer-events-none'
    } `}
  >
    {loading ? 'Loading...' : actionTest}
  </button>
)
