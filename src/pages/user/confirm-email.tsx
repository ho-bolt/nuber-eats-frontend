// confirm email, edit profile과 같이 user들이 공통적으로 가지고 있는 부분들을 user폴더에 넣고 client, driver, restaurant, owner로 분리
import { gql, useMutation } from '@apollo/client'
import React, { useEffect } from 'react'
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from '../../__generated__/graphql'
import { useLocation } from 'react-router-dom'

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`

export const ConfirmEmail = () => {
  const [verifyEmailMutation, { loading: verifyEmail }] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION)
  const location = useLocation()
  useEffect(() => {
    const [_, code] = window.location.href.split('code=')
    verifyEmailMutation({
      variables: {
        input: {
          code,
        },
      },
    })
  }, [])
  return (
    <div className="mt-52 flex flex-col items-center justify-center ">
      <h2 className="text-lg mb-2 font-extrabold">Confirming email....</h2>
      <h4 className="text-gray-600 text-sm">
        Please wait, don't close the page
      </h4>
    </div>
  )
}
