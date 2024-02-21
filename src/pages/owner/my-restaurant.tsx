import { gql, useQuery, useSubscription } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryPie,
  VictoryTheme,
  VictoryVoronoiContainer,
  VictoryZoomContainer,
} from "victory";
import { Link } from "react-router-dom";

import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
  PendingOrdersSubscription,
} from "../../__generated__/graphql";
import { Dish } from "../../components/dish";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

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
        orders {
          id
          createdAt
          total
        }
      }
    }
  }
`;

const PENDING_ORDER_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      id
      status
      total
      driver {
        email
      }
      customer {
        email
      }
      restaurant {
        name
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

  const { data: subscriptionData } = useSubscription<PendingOrdersSubscription>(
    PENDING_ORDER_SUBSCRIPTION
  );
  const history = useHistory();

  useEffect(() => {
    // 아이디가 있다는 건 주문이 들어왔다는 것
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData]);

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
              {data?.myRestaurant.restaurant?.menu.map(
                (dish: any, index: number) => (
                  <Dish
                    key={index}
                    name={dish.name}
                    description={dish.description}
                    price={dish.price}
                    photo={dish.photo}
                    addItemToOrder={dish.id}
                  />
                )
              )}
            </div>
          )}
          <div className="mt-20 mb-10">
            <h4 className="text-center text-2xl font-medium">Sales</h4>
            <div className="   mx-auto">
              <VictoryChart
                theme={VictoryTheme.material}
                width={window.innerWidth}
                height={500}
                domainPadding={50}
                containerComponent={<VictoryZoomContainer />}
              >
                <VictoryLine
                  labels={({ datum }: any) => `$${datum.y}`}
                  labelComponent={
                    <VictoryLabel
                      style={{ fontSize: 15 }}
                      renderInPortal
                      dy={-20}
                    />
                  }
                  data={data?.myRestaurant.restaurant?.orders?.map(
                    (order: any) => ({
                      x: order.createdAt,
                      y: order.total,
                    })
                  )}
                  interpolation="natural"
                  style={{ data: { strokeWidth: 5 } }}
                />
                {/* <VictoryAxis
                  style={{ tickLabels: { fontSize: 18 } as any }}
                  dependentAxis
                  tickFormat={(tick) => `$${tick}`}
                /> */}
                <VictoryAxis
                  style={{ tickLabels: { fontSize: 18 } }}
                  tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
                />
              </VictoryChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//Victory 그래프는 감싸고 있는 상위 div에 크기 결정됨
