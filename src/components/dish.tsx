import React from "react";
import { DishOption } from "../__generated__/graphql";

interface IDishProps {
  id?: number;
  name: string;
  description: string;
  price: number;
  photo?: string | null;
  isCustomer?: boolean;
  options?: DishOption[] | null;
  orderStarted?: boolean;
  isSelected?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  children?: React.ReactNode;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  name,
  description,
  price,
  photo,
  isCustomer = false,
  orderStarted = false,
  options,
  addItemToOrder,
  isSelected,
  removeFromOrder,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };

  return (
    <div
      className={`py-4 pb-8 px-8 border hover:border-gray-800 transition-all ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <div className="flex  justify-between ">
        <div className="mb-5">
          <h3 className="text-lg font-semibold">
            {name}
            {orderStarted && (
              <button
                className={`text-white py-1 focus:outline-none text-base ml-4 px-4  ${
                  !isSelected ? "bg-zinc-600 " : "bg-red-500"
                }`}
                onClick={onClick}
              >
                {!isSelected ? "Add" : "Remove"}
              </button>
            )}
          </h3>
          <h4>{description}</h4>
        </div>
        <div
          className="px-20 py-18 bg-center bg-cover"
          style={{ backgroundImage: `url(${photo})` }}
        ></div>
      </div>
      <span>${price} </span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className=" mt-5 mb-3 my-3 font-semibold">Dish Options : </h5>
          {dishOptions}
        </div>
      )}
    </div>
  );
};
