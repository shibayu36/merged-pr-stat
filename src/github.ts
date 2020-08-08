import { GraphQLClient } from "graphql-request";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export const graphQLClient = new GraphQLClient(GITHUB_GRAPHQL_ENDPOINT, {
  headers: {
    authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});
