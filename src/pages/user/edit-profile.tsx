import React from "react";
import { useMe } from "../../hooks/useMe";
import { Button } from "../../components/button";
import { FormTitle } from "../../components/form-title";
import { useForm } from "react-hook-form";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from "../../__generated__/graphql";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProtile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { error, ok },
    } = data;

    // update cache
    if (ok && userData) {
      // 로그인된 email
      const {
        me: { email: prevEmail },
      } = userData;
      // 입력된 email
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${userData.me.id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };

  /*  mutation 이후 cache update하는 2가지 방법
    1. cache를 직접 update 한다. 

    2. query를 refetch -> cache를 update 해준다. 
     --> writeFragment 부분 빼고 refetch사용하면 된다. 
  

    진행 
    object의 id를 갖고 fragment를 write하고 data를 send한다. 





  */

  const [editProfile, { loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <FormTitle title={"Edit Profile | Nuber Eats"} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          {...register("email", {
            required: "Email is required",
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          type="email"
          placeholder="Email"
          ref={register("email").ref}
        />
        <input
          className="input"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <Button
          loading={loading}
          canClick={isValid}
          actionTest="Save Profile"
        />
      </form>
    </div>
  );
};
