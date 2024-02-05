import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";

import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from "../../__generated__/graphql";
import { Dish } from "../../components/dish";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
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
        menu {
          id
          name
          price
          photo
          description
          options {
            name
            extra
            choices {
              name
              extra
            }
          }
        }
      }
    }
  }
`;

export const MyRestaurant = () => {
  const { id } = useParams();
  const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  console.log(data);
  return (
    <div>
      <div
        className="bg-gray-500 bg-center py-28 "
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="mb-9 text-3xl font-semibold">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <div className="">
          <Link
            to={`/restaurant/${id}/add-dish`}
            className="bg-black text-white py-3 px-4 font-semibold"
          >
            Add Dish &rarr;
          </Link>
          <Link
            to="/buy-promotion"
            className="bg-lime-700 text-white py-3 px-4 ml-6 font-semibold"
          >
            Buy Promotion &rarr;
          </Link>
        </div>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            "Please Upload Dish "
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Dish
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                  photo={dish.photo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
