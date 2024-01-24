import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: number;
  coverImage: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImage,
  name,
  categoryName,
}) => (
  <Link to={`/restaurant/${id}`}>
    <div className="flex flex-col">
      <div
        style={{ backgroundImage: `url(${coverImage})` }}
        className="py-28 bg-cover bg-center mb-3"
      ></div>
      <h3 className="text-xl"> {name} </h3>
      <span className="border-t  py-2 mt-3 text-base opacity-50 border-gray-400">
        {categoryName}
      </span>
    </div>
  </Link>
);
