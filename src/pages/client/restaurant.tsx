import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  CreateOrderInput,
  CreateOrderItemInput,
  CreateOrderMutation,
  CreateOrderMutationVariables,
  SeeRestaurantQuery,
  SeeRestaurantQueryVariables,
} from "../../__generated__/graphql";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { useHistory } from "react-router-dom";

const RESTAURANT_QUERY = gql`
  query seeRestaurant($input: SeeRestaurantInput!) {
    seeRestaurant(input: $input) {
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

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

export const Restaurant = () => {
  const params = useParams();
  const { loading, data } = useQuery<
    SeeRestaurantQuery,
    SeeRestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    variables: { input: { restaurantId: +params.id } },
  });
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderConfirm, setOrderConfirm] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const triggerStartOrder = () => {
    setOrderStarted(true);
  };

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  // 여기서 Boolean은 undefined는 false로 나머진 다 true로 리턴함
  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };

  // option 클릭하면 어떤 item인지 찾고 item에 option 추가
  // 이렇게 하는 이유는 새 state를 리턴하기 위함이다.
  const addOptionToItem = (
    dishId: number,
    optionName: string,
    optionExtra: number
  ) => {
    // dish 선택하지 않았다면 암것도 안함
    if (!isSelected(dishId)) {
      return;
    }

    const oldItem = getItem(dishId);
    console.log(oldItem);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((aOption: any) => aOption.name == optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          {
            dishId,
            options: [
              { name: optionName, price: optionExtra },
              ...(oldItem.options as any),
            ],
          },
          ...current,
        ]);
      }
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option: any) => option.name === optionName);
  };

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };

  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId,
          options: oldItem.options?.filter(
            (option: any) => option.name !== optionName
          ),
        },
        ...current,
      ]);
      return;
    }
  };

  const showBill = (orderItems: any) => {
    console.log("aaaaa", orderItems);
  };

  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };

  const history = useHistory();

  const onCompleted = (data: CreateOrderMutation) => {
    if (data.createOrder.ok) {
      const {
        createOrder: { ok, orderId },
      } = data;
      history.push(`/orders/${orderId}`);
    }
  };

  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });

  const triggerConfirmOrder = () => {
    if (placingOrder) {
      return;
    }

    if (orderItems.length === 0) {
      alert("Can't order empty basket");
      return;
    }

    // mutation이 loading하는 동안 2개의 order를 보내지 않는다.
    const ok = window.confirm("You are about to place an order");
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });

      setOrderConfirm(true);
      showBill(orderItems);
    }
  };

  return (
    <div>
      <div
        className=" py-48 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.seeRestaurant?.restaurant?.coverImage})`,
        }}
      >
        <div className="bg-white w-3/12 py-8 pl-44">
          <h4 className="text-4xl mb-4">
            {data?.seeRestaurant.restaurant?.name}
          </h4>
          <h5 className="text-sm font-light mb-2 ">
            {data?.seeRestaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.seeRestaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="container mt-20 flex flex-col items-end">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-10 ">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
              Confirm Order
            </button>
            <button
              onClick={triggerCancelOrder}
              className="btn px-10 bg-yellow-400 hover:bg-yellow-400"
            >
              Cancel Order
            </button>
          </div>
        )}

        <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {data?.seeRestaurant.restaurant?.menu.map(
            (dish: any, index: number) => (
              <Dish
                isSelected={isSelected(dish.id)}
                id={dish.id}
                orderStarted={orderStarted}
                key={index}
                name={dish.name}
                description={dish.description}
                price={dish.price}
                photo={dish.photo}
                isCustomer={true}
                options={dish.options}
                addItemToOrder={addItemToOrder}
                removeFromOrder={removeFromOrder}
              >
                {dish.options?.map((option: any, index: number) => (
                  <DishOption
                    key={index}
                    isSelected={isOptionSelected(dish.id, option.name)}
                    name={option.name}
                    extra={option.extra}
                    addOptionToItem={addOptionToItem}
                    dishId={dish.id}
                    removeOptionFromItem={removeOptionFromItem}
                  />
                ))}
              </Dish>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// useLocation은 어디에 있는지 url을 알게 해줌
// useHistory는 이곳저곳 돌아다닐 수 있게 change, replace, push 할 수 있다.
// useParams는 parameter를 준다.
