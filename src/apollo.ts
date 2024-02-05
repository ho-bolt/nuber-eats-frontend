import { LOCALSTORAGE_TOKEN } from "./constants";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
  makeVar,
} from "@apollo/client";
import { createFragmentRegistry } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";
const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    fragments: createFragmentRegistry(gql`
      fragment RestaurantPartsFragment on Restaurant {
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
      }
    `),

    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
