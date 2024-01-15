import React from "react";

interface IFormTitleProps {
  title: string;
}

export const FormTitle: React.FC<IFormTitleProps> = ({ title }) => (
  <h4 className="font-semibold text-2xl mb-3">{title}</h4>
);
