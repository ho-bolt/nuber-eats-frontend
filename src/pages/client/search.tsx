import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from "../../__generated__/graphql";
import { Restaurant } from "../../components/restaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  // 현재 어디있는 지 알 수 있다
  const location = useLocation();
  const history = useHistory();
  const [callQuery, { loading, data, called }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT);
  console.log("data", data);
  useEffect(() => {
    const [_, query] = location.search.split("?term=");
    if (!query) {
      return history.replace("/");
    }
    callQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [history, location]);

  return (
    <div>
      <h1>
        <Helmet>
          <title>Search | Nuber Eats</title>
        </Helmet>
      </h1>
      <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10 mx-auto">
        {data?.searchRestaurant.restaurants?.map(
          (restaurant: any, index: number) => (
            <Restaurant
              key={index}
              id={restaurant.id}
              coverImage={restaurant.coverImage}
              name={restaurant.name}
              categoryName={restaurant.category.name}
            />
          )
        )}
      </div>
    </div>
  );
};
