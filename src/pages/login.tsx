import React from 'react'
import { useForm } from 'react-hook-form'
import { FormError } from '../components/form-error'
import { ApolloError, gql, useMutation } from '@apollo/client'
import {
  LoginInput,
  LoginMutation,
  LoginMutationVariables,
} from '../__generated__/graphql'

export const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`

interface ILoginForm {
  email: string
  password: string
}

export const Login = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginForm>()

  // loading == mutation 실행중,
  // error == mutation이 error 반환
  // onCompleted는 login이 있다는 것을 의미한다.

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data
    if (ok) {
      console.log(token)
    }
  }
  const onError = (error: ApolloError) => {
    console.log(error.graphQLErrors)
  }
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
    onError,
  })

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues()
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      })
    }
    loginMutation()
  }
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7  rounded-lg text-center">
        <h3 className="font-bold text-lg text-gray-800">Log In </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid  gap-3 mt-5 px-5"
        >
          <input
            {...register('email', { required: 'Email is required' })}
            name="email"
            type="email"
            placeholder="Email"
            className="input mb-3"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 3,
                message: 'Password must be more than 8 chars',
              },
            })}
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <button className="btn mt-3">
            {loading ? 'Loading...' : 'Log In'}
          </button>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
      </div>
    </div>
  )
}
