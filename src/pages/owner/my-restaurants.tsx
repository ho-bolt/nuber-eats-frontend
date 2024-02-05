import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
  MyRestaurantDocument,
  MyRestaurantsQuery,
} from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";

export const MY_RESTAURANTS_QUERY = gql`
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

//readQuery : 캐시에서 직접 Graphql쿼리를 실행할 수 있다.
// writeQuery : Graphql 쿼리와 일치하는 모양으로 캐시에 데이터를 쓸 수 있다.
// 데이터 옵션이 필요하다는 점을 제외하고는 readQuery와 유사
//Combine read, write Query : 이 2개를 결합하면 현재 캐시된 데이터를 가져오고 선택적으로 수정할 수 있다.
// restaurants를 가지고 완전히 대체하는 게 아니라 새로운 restaurants를 더 만드는 것

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
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.myRestaurants.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                name={restaurant.name}
                id={restaurant.id + ""}
                coverImage={restaurant.coverImage}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
