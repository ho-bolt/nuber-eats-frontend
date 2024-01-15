// confirm email, edit profile과 같이 user들이 공통적으로 가지고 있는 부분들을 user폴더에 넣고 client, driver, restaurant, owner로 분리
import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../__generated__/graphql";
import { useLocation } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import { useHistory } from "react-router-dom";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

/*
useQuery

return 속성에 흥미로운 속성이 있는데 그것은 바로 refetch이다. 
refetch는 함수인데 이걸 호출하면 query를 다시 fetch해준다. 

*/

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      // cache에 write 여기서의 id는 cache id임
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push("/");
    }
  };

  const [verifyEmailMutation] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted,
  });
  const location = useLocation();
  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmailMutation({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);
  return (
    <div className="mt-52 flex flex-col items-center justify-center ">
      <h2 className="text-lg mb-2 font-extrabold">Confirming email....</h2>
      <h4 className="text-gray-600 text-sm">
        Please wait, don't close the page
      </h4>
    </div>
  );
};
