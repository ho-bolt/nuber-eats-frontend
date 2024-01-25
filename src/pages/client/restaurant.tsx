import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
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
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurant = () => {
  const params = useParams();
  const { loading, data } = useQuery<
    SeeRestaurantQuery,
    SeeRestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    variables: { input: { restaurantId: +params.id } },
  });
  return (
    <div>
      <div
        className=" py-48 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.seeRestaurant?.restaurant?.coverImage})`,
        }}
      >
        <div className="bg-white w-3/12 py-8 pl-44">
          <h4 className="text-4xl mb-4">
            {data?.seeRestaurant.restaurant?.name}
          </h4>
          <h5 className="text-sm font-light mb-2 ">
            {data?.seeRestaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.seeRestaurant.restaurant?.address}
          </h6>
        </div>
      </div>
    </div>
  );
};

// useLocation은 어디에 있는지 url을 알게 해줌
// useHistory는 이곳저곳 돌아다닐 수 있게 change, replace, push 할 수 있다.
// useParams는 parameter를 준다.
