import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  SeeRestaurantQuery,
  SeeRestaurantQueryVariables,
} from "../../__generated__/graphql";

const RESTAURANT_QUERY = gql`
  query seeRestaurant($input: SeeRestaurantInput!) {
    seeRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const params = useParams();
  const { loading, data } = useQuery<
    SeeRestaurantQuery,
    SeeRestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    variables: { input: { restaurantId: +params.id } },
  });
  console.log(data);
  return <h1>Restaurant</h1>;
};

// useLocation은 어디에 있는지 url을 알게 해줌
// useHistory는 이곳저곳 돌아다닐 수 있게 change, replace, push 할 수 있다.
// useParams는 parameter를 준다.
