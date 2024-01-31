import { gql, useMutation } from "@apollo/client";
import {
  CreateAccountMutationVariables,
  CreateRestaurantMutation,
} from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet-async";
const CREATE_RESTAURANT = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}
export const AddRestaurant = () => {
  const [createRestaurantMutation, { error, loading, data }] = useMutation<
    CreateRestaurantMutation,
    CreateAccountMutationVariables
  >(CREATE_RESTAURANT);

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormProps>({ mode: "onChange" });

  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>

      <div className="w-3/5 flex flex-col mx-auto items-center mt-52">
        <h1 className="text-3xl">Add Restaurant</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 w-full mt-7"
        >
          <input
            className="input"
            {...register("name", {
              required: "Name is required",
            })}
            name="name"
            placeholder="Name"
            type="text"
          />
          <input
            className="input"
            {...register("address", {
              required: "Address is required",
            })}
            name="address"
            placeholder="Address"
            type="text"
          />
          <input
            className="input"
            {...register("categoryName", {
              required: "Category Name is required",
            })}
            name="categoryName"
            placeholder="CategoryName"
            type="text"
          />
          <Button
            canClick={isValid}
            loading={loading}
            actionTest={"Create Restaurant"}
          ></Button>
        </form>
      </div>
    </div>
  );
};

// 여기 input의 name은 IFormProps의 이름과 같아야 한다.
