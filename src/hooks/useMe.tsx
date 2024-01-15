import { gql, useQuery } from "@apollo/client";
import { MeQuery } from "../__generated__/graphql";

const ME_QUERY = gql`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<MeQuery>(ME_QUERY);
};

// 이걸 hook으로 만든 이유는 apollo가 cache에서 가져올 수 있기 때문이다.
// useMe 같은 경우는 모든 페이지마다 내가 누군지 호출해야하기 때문에 hook으로 만들고
// cache에서 내 정보를 그때그때 가져올 수 있다.
