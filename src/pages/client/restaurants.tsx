import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from "../../__generated__/graphql";
import { url } from "inspector";

const RESTAURANTS_QUERY = gql`
  query restaurantsPage($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
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

export const Restaurants = () => {
  const { data, loading } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
  });
  return (
    <div>
      <form className="bg-gray-900 w-full py-40 flex items-center justify-center">
        <input
          type="Search"
          className="input rounded-md w-3/12 border-none"
          placeholder="Search Restaurants ... "
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8">
          <div className="flex justify-around max-w-screen-md mx-auto">
            {data?.allCategories.categories?.map(
              (category: any, index: number) => (
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-full bg-cover border  hover:bg-gray-100 cursor-pointer"
                    style={{ backgroundImage: `url(${category.coverImage})` }}
                    key={index}
                  ></div>
                  <span className="text-sm  font-bold mt-1">
                    {category.name}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
      <div></div>
    </div>
  );
};
