import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet-async";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from "../../__generated__/graphql";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}
type ApiType = IFormProps & {
  file: FileList;
};
export const AddDish = () => {
  const { id } = useParams();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState("");

  const [createDishMutation, { loading }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +id,
          },
        },
      },
    ],
  });

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    unregister,
  } = useForm<IFormProps>({ mode: "onChange", shouldUnregister: true });

  const onSubmit = async () => {
    try {
      const { name, price, description, file, ...rest } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: photo } = await (
        await fetch("http://localhost:4000/uploads/upload", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(photo);
      const optionObjects = optionsNumber.map((theId) => ({
        name: rest[`${theId}-optionName`],
        extra: +rest[`${theId}-optionExtra`],
      }));
      createDishMutation({
        variables: {
          input: {
            restaurantId: +id,
            name,
            photo,
            price: +price,
            description,
            options: optionObjects,
          },
        },
      });
      history.goBack();
    } catch (e) {
      console.log(e);
    }
  };
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };
  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
    unregister(`${idToDelete}-optionName`);
    unregister(`${idToDelete}-optionExtra`);
  };

  return (
    <div className="container">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>

      <div className="flex flex-col mx-auto items-center mt-52">
        <h2 className="text-3xl mb-10">Add Dish</h2>
        <form className="grid gap-3 w-3/5" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="input"
            {...register("name", {
              required: "Name is required",
            })}
            type="text"
            name="name"
            placeholder="Name"
          />
          <input
            className="input"
            {...register("price", {
              required: "Price is required",
            })}
            min={0}
            type="text"
            name="price"
            placeholder="Price"
          />
          <input
            className="input"
            {...register("description", {
              required: "Description is required",
            })}
            type="text"
            name="description"
            placeholder="Description"
          />

          <input
            {...register("file", { required: true })}
            type="file"
            accept="image/*"
            name="file"
          />

          <div className="my-10">
            <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
            <span
              onClick={onAddOptionClick}
              className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 "
            >
              Add Dish Option
            </span>
            {optionsNumber.length !== 0 &&
              optionsNumber.map((id) => (
                <div key={id} className="mt-5">
                  <input
                    {...register(`${id}-optionName`)}
                    name={`${id}-optionName`}
                    className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-800 border-2"
                    type="text"
                    placeholder="Option Name"
                  />
                  <input
                    {...register(`${id}-optionExtra`)}
                    name={`${id}-optionExtra`}
                    className="py-2 px-4 focus:outline-none focus:border-gray-800 border-2"
                    type="number"
                    min={0}
                    defaultValue={0}
                    placeholder="Option Extra"
                  />
                  <span
                    className="cursor-pointer text-white bg-gray-900 py-2 px-3 mt-5 ml-3 "
                    onClick={() => onDeleteClick(id)}
                    role="button"
                  >
                    Delete Option
                  </span>
                </div>
              ))}
          </div>

          <Button
            canClick={isValid}
            loading={loading}
            actionTest={"Create Dish"}
          />
        </form>
      </div>
    </div>
  );
};
