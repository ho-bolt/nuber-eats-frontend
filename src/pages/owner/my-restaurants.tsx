import { gql, useQuery } from "@apollo/client";
import { MyRestaurantsQuery } from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
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

export const MyRestaurants = () => {
  const { data } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="container">
        <h1 className="text-3xl font-bold mb-5">My Restaurants </h1>
        {data?.myRestaurants.ok &&
        data?.myRestaurants?.restaurants?.length === 0 ? (
          <>
            <h4 className="mb-5 ">You have no Restaurants</h4>
            <Link to="/add-restaurant" className="font-bold hover:underline">
              Create One &rarr;
            </Link>
          </>
        ) : (
          <div>i have restaurants</div>
        )}
      </div>
    </div>
  );
};
