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
                <div
                  key={index}
                  className="flex flex-col group cursor-pointer items-center "
                >
                  <div
                    className="w-16 h-16 rounded-full bg-cover border group-hover:bg-gray-200 "
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
          <div className="grid mt-10 grid-cols-3 gap-x-5 gap-y-10 ">
            {data?.restaurants.results?.map((restaurant, index: number) => (
              <div key={index}>
                <div
                  style={{ backgroundImage: `url(${restaurant.coverImage})` }}
                  key={index}
                  className="py-28 bg-cover bg-center mb-3"
                ></div>
                <h3 className="mt-3 text-xl font-semibold">
                  {" "}
                  {restaurant.name}{" "}
                </h3>
                <span className="border-t-2 border-gray-200">
                  {restaurant.category?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div></div>
    </div>
  );
};
