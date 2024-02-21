import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  EditOrderMutation,
  EditOrderMutationVariables,
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderStatus,
  OrderUpdatesSubscription,
  OrderUpdatesSubscriptionVariables,
  UserRole,
} from "../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { useMe } from "../hooks/useMe";

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
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
  }
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
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

const EDIT_ORDER = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

export const Order = () => {
  const params = useParams();
  const { data: userData } = useMe();
  const [editOrderMutation] = useMutation<
    EditOrderMutation,
    EditOrderMutationVariables
  >(EDIT_ORDER);
  const { data, subscribeToMore } = useQuery<
    GetOrderQuery,
    GetOrderQueryVariables
  >(GET_ORDER, {
    variables: {
      input: {
        id: +params.id,
      },
    },
  });

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +params.id,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: OrderUpdatesSubscription } }
        ) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data]);

  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: +params.id,
          status: newStatus,
        },
      },
    });
  };

  // const { data: subscriptionData } = useSubscription<
  //   OrderUpdatesSubscription,
  //   OrderUpdatesSubscriptionVariables
  // >(ORDER_SUBSCRIPTION, {
  //   variables: {
  //     input: {
  //       id: +params.id,
  //     },
  //   },
  // });
  // console.log("!!!", subscriptionData);
  return (
    <div className="flex w-2/5 mx-auto  max-w-screen-sm flex-col justify-center mt-40 border border-gray-700">
      <Helmet>
        <title>Order #{params.id} | Nuber Eats</title>
      </Helmet>
      <div className=" bg-darkIndigo-100 text-white text-center py-3 font-semibold">
        Order #{params.id}
      </div>
      <div className="px-5">
        <div className="flex justify-center py-7">
          <div className="text-3xl">${data?.getOrder.order?.total}</div>
        </div>
        <div className="border-t border-gray-700 py-3">
          <span className="font-bold">
            Prepared by : {data?.getOrder.order?.restaurant?.name}{" "}
          </span>
        </div>
        <div className="border-t border-gray-700 py-3">
          <span className="font-bold">
            Deliver To : {data?.getOrder.order?.customer?.email}{" "}
          </span>
        </div>
        <div className="border-t border-gray-700 py-3">
          <span className="font-bold">
            Driver :
            {data?.getOrder.order?.driver?.email
              ? data?.getOrder.order?.driver?.email
              : "  Not yet"}
          </span>
        </div>
        {userData?.me.role === UserRole.Client && (
          <div className="border-t border-gray-700 flex justify-center py-7">
            <div className="text-2xl">
              Status : {data?.getOrder.order?.status}
            </div>
          </div>
        )}
        {userData?.me.role === UserRole.Owner && (
          <>
            {data?.getOrder.order?.status === OrderStatus.Pending && (
              <div className="border-t border-gray-700 flex justify-center py-7">
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                  className="btn font-semibold w-full text-center"
                >
                  Accept Order
                </button>
              </div>
            )}
            {data?.getOrder.order?.status === OrderStatus.Cooking && (
              <div className="border-t border-gray-700 flex justify-center py-7">
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                  className="btn font-semibold w-full text-center"
                >
                  Order Cooked
                </button>
              </div>
            )}
            {data?.getOrder.order?.status !== OrderStatus.Cooking &&
              data?.getOrder.order?.status !== OrderStatus.Pending && (
                <div className="border-t border-gray-700 flex justify-center py-7">
                  <div className="text-2xl">
                    Status : {data?.getOrder.order?.status}
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

// subscribeToMore를 사용하면
// useQuery와 useSubscription을 따로 사용할 필요없다.
