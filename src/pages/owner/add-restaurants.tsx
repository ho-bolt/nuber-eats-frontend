import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useHistory } from "react-router-dom";

const CREATE_RESTAURANT = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;
interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { file, name, categoryName, address } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult?.myResturants,
            restaurants: [
              {
                address,
                category: { __typename: "Category", name: categoryName },
                coverImage: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
            ],
          },
        },
      });
      history.push("/");
    }
  };
  const [createRestaurantMutation, { error, loading, data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT, {
    onCompleted,
    refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
  });
  //refetchQueries 쿼리를 다시 fetch해줌
  // ex) 식당생성해서 db에 생겨도 브라우저에서는 새로 생긴걸 인지못함
  // 결국 새로고침을 해야 반영됨
  // 그래서 refetchQueries를 사용하면 원하는 query를 다시 한번 때림

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormProps>({ mode: "onChange" });

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImage } = await (
        await fetch("http://localhost:4000/uploads/upload", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(coverImage);
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImage,
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
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
          <input
            {...register("file", { required: true })}
            type="file"
            accept="image/*"
            name="file"
          />
          <Button
            canClick={isValid}
            loading={uploading}
            actionTest={"Create Restaurant"}
          ></Button>
          {data?.createRestaurant?.error && (
            <FormError errorMessage={data?.createRestaurant?.error}></FormError>
          )}
        </form>
      </div>
    </div>
  );
};

// 여기 input의 name은 IFormProps의 이름과 같아야 한다.
