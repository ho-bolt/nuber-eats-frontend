import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from "../../__generated__/graphql";
import { Restaurant } from "../../components/restaurant";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import Page from "../../components/page";

const RESTAURANTS_QUERY = gql`
  query restaurantsPage($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }

  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: page,
      },
    },
  });
  const onNextPage = () => setPage((current) => current + 1);
  const onPrevPage = () => setPage((current) => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats </title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-900 w-full py-40 flex items-center justify-center"
      >
        <input
          {...register("searchTerm", { required: true, min: 3 })}
          type="Search"
          name="searchTerm"
          className="input rounded-md w-3/4 md:w-3/12 border-0"
          placeholder="Search Restaurants ... "
        />
      </form>

      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-2">
          <div className="flex justify-around max-w-screen-md mx-auto">
            {data?.allCategories.categories?.map(
              (category: any, index: number) => (
                <Link key={category.id} to={`/category/${category.slug}`}>
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
                </Link>
              )
            )}
          </div>
          <div className="grid mt-16 md:grid-cols-3  gap-x-5 gap-y-10 ">
            {data?.restaurants.results?.map(
              (restaurant: any, index: number) => (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id}
                  coverImage={restaurant.coverImage}
                  name={restaurant.name}
                  categoryName={restaurant?.category?.name}
                />
              )
            )}
          </div>
          <Page
            totalPages={data?.restaurants.totalPages}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
            pages={page}
          />
        </div>
      )}
      <div></div>
    </div>
  );
};
