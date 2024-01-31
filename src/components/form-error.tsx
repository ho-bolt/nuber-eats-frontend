import React from "react";
interface IFormErrorProps {
  errorMessage: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => (
  <span role="alert" className="font-bold text-red-500">
    {errorMessage}
  </span>
);
