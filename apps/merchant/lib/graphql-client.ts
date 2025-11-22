import { cacheExchange, Client, fetchExchange } from 'urql'

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_URL || 'http://localhost:8095/v1/graphql'
const HASURA_ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET || 'kiaan_admin_secret_2024'

export const graphqlClient = new Client({
  url: HASURA_GRAPHQL_URL,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    return {
      headers: {
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
    }
  },
})
