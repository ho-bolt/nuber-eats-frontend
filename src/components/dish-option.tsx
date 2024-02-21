import React from "react";

interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  extra: number;
  addOptionToItem: (dishId: number, optionName: string, extra: number) => void;
  dishId: number;
  removeOptionFromItem(dishId: number, optionName: string): void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra,
  addOptionToItem,
  removeOptionFromItem,
  dishId,
}) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name, extra);
    }
  };

  return (
    <span
      className={`flex border items-center justify-between cursor-pointer py-1 px-2 mb-1 w-2/6 ${
        isSelected ? "border-gray-800" : ""
      }`}
      onClick={onClick}
    >
      <h6 className="mr-2">{name}</h6>
      {extra && <h6 className="text-sm opacity-75">${extra}</h6>}
    </span>
  );
};
