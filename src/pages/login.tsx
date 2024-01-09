import React from 'react'
import { useForm } from 'react-hook-form'
import { FormError } from '../components/form-error'
import { ApolloError, gql, useMutation } from '@apollo/client'
import { LoginMutation, LoginMutationVariables } from '../__generated__/graphql'
import nuberLogo from '../images/uber-eats-logosvg.svg'
import { Button } from '../components/button'
import { Link } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { isLoggedInVar } from '../apollo'
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
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ILoginForm>({
    mode: 'onChange',
  })

  // loading == mutation 실행중,
  // error == mutation이 error 반환
  // onCompleted는 login이 있다는 것을 의미한다.

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data
    if (ok) {
      isLoggedInVar(true)
    }
  }

  /* useMutation은 array를 return하는데
     첫 원소는 반드시 호출해줘야 하는 mutation function이다. 
     두번째 원소는 object이다. 
   */
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
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
  }
  // tailwind-css lg == large screen 이다.  즉 큰 화면일 땐 margin-top을 28주고 디폴트는 10 준다.
  // css를 할 때 항상 모바일 먼저 해야하고 기본 class name은 항상 모바일로 시작해야 한다.
  // react-helmet은 document의 head를 변경할 수 있게 해준다.
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <HelmetProvider>
        <Helmet>
          <title>Login | Nuber </title>
        </Helmet>
      </HelmetProvider>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage={'Please enter a vaild email'} />
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
          <Button canClick={isValid} loading={loading} actionTest={'Log In'} />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Nuber?{' '}
          <Link
            to="/create-account"
            className=" text-black font-bold hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}
