import { gql } from 'urql'

// CUSTOMERS QUERIES & MUTATIONS

export const GET_CUSTOMERS = gql`
  query GetCustomers($limit: Int = 100, $offset: Int = 0, $order_by: [customers_order_by!] = {created_at: desc}) {
    customers(limit: $limit, offset: $offset, order_by: $order_by) {
      id
      full_name
      phone_number
      email
      date_of_birth
      address
      created_at
      updated_at
      cards_aggregate {
        aggregate {
          count
        }
      }
      cards {
        uid
        balance
        status
      }
    }
    customers_aggregate {
      aggregate {
        count
      }
    }
  }
`

export const GET_CUSTOMER_BY_ID = gql`
  query GetCustomerById($id: uuid!) {
    customers_by_pk(id: $id) {
      id
      full_name
      phone_number
      email
      date_of_birth
      address
      created_at
      updated_at
      cards {
        uid
        balance
        status
        daily_limit
        issued_at
        last_used_at
        transactions_aggregate {
          aggregate {
            count
            sum {
              amount
            }
          }
        }
      }
    }
  }
`

export const INSERT_CUSTOMER = gql`
  mutation InsertCustomer($object: customers_insert_input!) {
    insert_customers_one(object: $object) {
      id
      full_name
      phone_number
      email
    }
  }
`

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: uuid!, $set: customers_set_input!) {
    update_customers_by_pk(pk_columns: {id: $id}, _set: $set) {
      id
      full_name
      phone_number
      email
    }
  }
`

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: uuid!) {
    delete_customers_by_pk(id: $id) {
      id
    }
  }
`

// CARDS QUERIES & MUTATIONS

export const GET_CARDS = gql`
  query GetCards($limit: Int = 100, $offset: Int = 0, $order_by: [cards_order_by!] = {created_at: desc}) {
    cards(limit: $limit, offset: $offset, order_by: $order_by) {
      uid
      customer_id
      balance
      status
      daily_limit
      issued_at
      last_used_at
      created_at
      customer {
        id
        full_name
        phone_number
      }
      transactions_aggregate {
        aggregate {
          count
          sum {
            amount
          }
        }
      }
    }
    cards_aggregate {
      aggregate {
        count
        sum {
          balance
        }
      }
    }
  }
`

export const GET_CARD_BY_UID = gql`
  query GetCardByUid($uid: String!) {
    cards_by_pk(uid: $uid) {
      uid
      customer_id
      balance
      status
      daily_limit
      issued_at
      last_used_at
      expires_at
      created_at
      customer {
        id
        full_name
        phone_number
        email
      }
      transactions(order_by: {created_at: desc}, limit: 50) {
        id
        type
        amount
        balance_before
        balance_after
        status
        description
        created_at
        branch {
          name
        }
        staff {
          full_name
        }
      }
    }
  }
`

export const INSERT_CARD = gql`
  mutation InsertCard($object: cards_insert_input!) {
    insert_cards_one(object: $object) {
      uid
      customer_id
      balance
      status
    }
  }
`

export const UPDATE_CARD = gql`
  mutation UpdateCard($uid: String!, $set: cards_set_input!) {
    update_cards_by_pk(pk_columns: {uid: $uid}, _set: $set) {
      uid
      balance
      status
    }
  }
`

// TRANSACTIONS QUERIES

export const GET_TRANSACTIONS = gql`
  query GetTransactions($limit: Int = 100, $offset: Int = 0, $order_by: [transactions_order_by!] = {created_at: desc}) {
    transactions(limit: $limit, offset: $offset, order_by: $order_by) {
      id
      card_uid
      type
      amount
      balance_before
      balance_after
      status
      description
      created_at
      card {
        uid
        customer {
          full_name
        }
      }
      branch {
        name
        code
      }
      staff {
        full_name
      }
    }
    transactions_aggregate {
      aggregate {
        count
        sum {
          amount
        }
      }
    }
  }
`

export const GET_TRANSACTION_BY_ID = gql`
  query GetTransactionById($id: uuid!) {
    transactions_by_pk(id: $id) {
      id
      card_uid
      type
      amount
      balance_before
      balance_after
      payment_method
      payment_reference
      status
      description
      metadata
      created_at
      card {
        uid
        customer {
          id
          full_name
          phone_number
        }
      }
      branch {
        id
        name
        code
        location
      }
      staff {
        id
        full_name
        email
      }
    }
  }
`

// BRANCHES QUERIES & MUTATIONS

export const GET_BRANCHES = gql`
  query GetBranches {
    branches(order_by: {created_at: asc}) {
      id
      name
      code
      location
      phone
      email
      is_active
      created_at
      manager {
        full_name
        email
      }
      staff_members_aggregate {
        aggregate {
          count
        }
      }
      transactions_aggregate {
        aggregate {
          count
          sum {
            amount
          }
        }
      }
    }
  }
`

export const GET_BRANCH_BY_ID = gql`
  query GetBranchById($id: uuid!) {
    branches_by_pk(id: $id) {
      id
      name
      code
      location
      phone
      email
      is_active
      created_at
      manager {
        id
        full_name
        email
        phone
      }
      staff_members {
        id
        full_name
        email
        role
        is_active
      }
      transactions(order_by: {created_at: desc}, limit: 100) {
        id
        type
        amount
        status
        created_at
        card {
          customer {
            full_name
          }
        }
      }
    }
  }
`

export const INSERT_BRANCH = gql`
  mutation InsertBranch($object: branches_insert_input!) {
    insert_branches_one(object: $object) {
      id
      name
      code
    }
  }
`

export const UPDATE_BRANCH = gql`
  mutation UpdateBranch($id: uuid!, $set: branches_set_input!) {
    update_branches_by_pk(pk_columns: {id: $id}, _set: $set) {
      id
      name
      code
    }
  }
`

// TOP-UPS QUERIES

export const GET_TOP_UPS = gql`
  query GetTopUps($limit: Int = 100, $offset: Int = 0) {
    top_ups(limit: $limit, offset: $offset, order_by: {initiated_at: desc}) {
      id
      card_uid
      amount
      source
      payment_provider
      phone_number
      payment_reference
      status
      initiated_at
      completed_at
      card {
        uid
        customer {
          full_name
        }
      }
    }
    top_ups_aggregate {
      aggregate {
        count
        sum {
          amount
        }
      }
    }
  }
`

// DASHBOARD STATS

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    customers_aggregate {
      aggregate {
        count
      }
    }
    cards_aggregate(where: {status: {_eq: active}}) {
      aggregate {
        count
        sum {
          balance
        }
      }
    }
    transactions_aggregate(where: {created_at: {_gte: "today"}}) {
      aggregate {
        count
      }
    }
    transactions_aggregate(where: {type: {_eq: purchase}, created_at: {_gte: "today"}}) {
      aggregate {
        sum {
          amount
        }
      }
    }
    top_ups_aggregate(where: {status: {_eq: completed}}) {
      aggregate {
        count
        sum {
          amount
        }
      }
    }
    branches_aggregate(where: {is_active: {_eq: true}}) {
      aggregate {
        count
      }
    }
  }
`
