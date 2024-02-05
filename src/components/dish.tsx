import React from "react";

interface IDishProps {
  name: string;
  description: string;
  price: number;
  photo?: string | null;
}

export const Dish: React.FC<IDishProps> = ({
  name,
  description,
  price,
  photo,
}) => {
  return (
    <div className="pt-4 pb-8 px-8 border hover:border-gray-800 transition-all">
      <div className="flex  justify-between ">
        <div className="mb-5">
          <h3 className="text-lg font-semibold">{name}</h3>
          <h4>{description}</h4>
        </div>
        <div
          className="px-20 py-18 bg-center bg-cover"
          style={{ backgroundImage: `url(${photo})` }}
        ></div>
      </div>
      <span>${price} </span>
    </div>
  );
};
