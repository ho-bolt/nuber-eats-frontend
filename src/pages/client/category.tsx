import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  CategoryQuery,
  CategoryQueryVariables,
} from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { Restaurant } from "../../components/restaurant";
import { useState } from "react";
import Page from "../../components/page";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Category = () => {
  const params = useParams();
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: page,
          slug: params.slug,
        },
      },
    }
  );
  const onNextPage = () => setPage((current) => current + 1);
  const onPrevPage = () => setPage((current) => current - 1);
  return (
    <div>
      <Helmet>
        <title> Category | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.category.restaurants?.map(
              (restaurant: any, index: number) => (
                <Restaurant
                  key={index}
                  id={restaurant.id}
                  coverImage={restaurant.coverImage}
                  name={restaurant.name}
                  categoryName={restaurant.categoryName}
                />
              )
            )}
          </div>
          <Page
            totalPages={data?.category?.totalPages}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
            pages={page}
          />
        </div>
      )}
    </div>
  );
};
