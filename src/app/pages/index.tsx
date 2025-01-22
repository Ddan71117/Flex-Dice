// pages/index.js
import { useQuery, gql } from "@apollo/client";
import client from "../lib/apolloClient";

const GET_HELLO = gql`
  query {
    hello
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_HELLO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <h1>{data.hello}</h1>;
}
