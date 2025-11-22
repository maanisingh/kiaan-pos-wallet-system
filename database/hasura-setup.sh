#!/bin/bash

# Kiaan POS Wallet - Hasura Configuration Script
# This script tracks tables and sets up relationships in Hasura

HASURA_URL="http://localhost:8095"
HASURA_ADMIN_SECRET="kiaan_admin_secret_2024"

echo "🚀 Starting Hasura Configuration..."
echo "=================================="
echo ""

# Function to execute Hasura metadata API
execute_hasura_api() {
  local query=$1
  curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "X-Hasura-Admin-Secret: $HASURA_ADMIN_SECRET" \
    -d "$query" \
    "$HASURA_URL/v1/metadata"
}

# 1. Track all tables
echo "📋 Step 1: Tracking tables..."
execute_hasura_api '{
  "type": "pg_track_table",
  "args": {
    "source": "default",
    "table": "customers"
  }
}'

execute_hasura_api '{
  "type": "pg_track_table",
  "args": {
    "source": "default",
    "table": "cards"
  }
}'

execute_hasura_api '{
  "type": "pg_track_table",
  "args": {
    "source": "default",
    "table": "branches"
  }
}'

execute_hasura_api '{
  "type": "pg_track_table",
  "args": {
    "source": "default",
    "table": "staff"
  }
}'

execute_hasura_api '{
  "type": "pg_track_table",
  "args": {
    "source": "default",
    "table": "transactions"
  }
}'

execute_hasura_api '{
  "type": "pg_track_table",
  "args": {
    "source": "default",
    "table": "top_ups"
  }
}'

execute_hasura_api '{
  "type": "pg_track_table",
  "args": {
    "source": "default",
    "table": "audit_logs"
  }
}'

echo "✅ Tables tracked successfully"
echo ""

# 2. Create relationships
echo "🔗 Step 2: Creating relationships..."

# Cards -> Customer relationship
execute_hasura_api '{
  "type": "pg_create_object_relationship",
  "args": {
    "source": "default",
    "table": "cards",
    "name": "customer",
    "using": {
      "foreign_key_constraint_on": "customer_id"
    }
  }
}'

# Customer -> Cards relationship (array)
execute_hasura_api '{
  "type": "pg_create_array_relationship",
  "args": {
    "source": "default",
    "table": "customers",
    "name": "cards",
    "using": {
      "foreign_key_constraint_on": {
        "table": "cards",
        "column": "customer_id"
      }
    }
  }
}'

# Transactions -> Card relationship
execute_hasura_api '{
  "type": "pg_create_object_relationship",
  "args": {
    "source": "default",
    "table": "transactions",
    "name": "card",
    "using": {
      "foreign_key_constraint_on": "card_uid"
    }
  }
}'

# Transactions -> Branch relationship
execute_hasura_api '{
  "type": "pg_create_object_relationship",
  "args": {
    "source": "default",
    "table": "transactions",
    "name": "branch",
    "using": {
      "foreign_key_constraint_on": "branch_id"
    }
  }
}'

# Transactions -> Staff relationship
execute_hasura_api '{
  "type": "pg_create_object_relationship",
  "args": {
    "source": "default",
    "table": "transactions",
    "name": "staff",
    "using": {
      "foreign_key_constraint_on": "staff_id"
    }
  }
}'

# Card -> Transactions relationship (array)
execute_hasura_api '{
  "type": "pg_create_array_relationship",
  "args": {
    "source": "default",
    "table": "cards",
    "name": "transactions",
    "using": {
      "foreign_key_constraint_on": {
        "table": "transactions",
        "column": "card_uid"
      }
    }
  }
}'

# Branch -> Transactions relationship (array)
execute_hasura_api '{
  "type": "pg_create_array_relationship",
  "args": {
    "source": "default",
    "table": "branches",
    "name": "transactions",
    "using": {
      "foreign_key_constraint_on": {
        "table": "transactions",
        "column": "branch_id"
      }
    }
  }
}'

# Staff -> Transactions relationship (array)
execute_hasura_api '{
  "type": "pg_create_array_relationship",
  "args": {
    "source": "default",
    "table": "staff",
    "name": "transactions",
    "using": {
      "foreign_key_constraint_on": {
        "table": "transactions",
        "column": "staff_id"
      }
    }
  }
}'

# Staff -> Branch relationship
execute_hasura_api '{
  "type": "pg_create_object_relationship",
  "args": {
    "source": "default",
    "table": "staff",
    "name": "branch",
    "using": {
      "foreign_key_constraint_on": "branch_id"
    }
  }
}'

# Branch -> Staff relationship (array)
execute_hasura_api '{
  "type": "pg_create_array_relationship",
  "args": {
    "source": "default",
    "table": "branches",
    "name": "staff_members",
    "using": {
      "foreign_key_constraint_on": {
        "table": "staff",
        "column": "branch_id"
      }
    }
  }
}'

# Branch -> Manager relationship
execute_hasura_api '{
  "type": "pg_create_object_relationship",
  "args": {
    "source": "default",
    "table": "branches",
    "name": "manager",
    "using": {
      "foreign_key_constraint_on": "manager_id"
    }
  }
}'

# Top-ups -> Transaction relationship
execute_hasura_api '{
  "type": "pg_create_object_relationship",
  "args": {
    "source": "default",
    "table": "top_ups",
    "name": "transaction",
    "using": {
      "foreign_key_constraint_on": "transaction_id"
    }
  }
}'

# Top-ups -> Card relationship
execute_hasura_api '{
  "type": "pg_create_object_relationship",
  "args": {
    "source": "default",
    "table": "top_ups",
    "name": "card",
    "using": {
      "foreign_key_constraint_on": "card_uid"
    }
  }
}'

# Card -> Top-ups relationship (array)
execute_hasura_api '{
  "type": "pg_create_array_relationship",
  "args": {
    "source": "default",
    "table": "cards",
    "name": "top_ups",
    "using": {
      "foreign_key_constraint_on": {
        "table": "top_ups",
        "column": "card_uid"
      }
    }
  }
}'

echo "✅ Relationships created successfully"
echo ""

# 3. Create permissions
echo "🔒 Step 3: Creating admin permissions..."

# For now, we'll create permissive admin permissions
# In production, you should restrict these based on JWT claims

for table in customers cards branches staff transactions top_ups audit_logs; do
  # Select permission
  execute_hasura_api "{
    \"type\": \"pg_create_select_permission\",
    \"args\": {
      \"source\": \"default\",
      \"table\": \"$table\",
      \"role\": \"admin\",
      \"permission\": {
        \"columns\": \"*\",
        \"filter\": {},
        \"allow_aggregations\": true
      }
    }
  }"

  # Insert permission
  execute_hasura_api "{
    \"type\": \"pg_create_insert_permission\",
    \"args\": {
      \"source\": \"default\",
      \"table\": \"$table\",
      \"role\": \"admin\",
      \"permission\": {
        \"check\": {},
        \"columns\": \"*\"
      }
    }
  }"

  # Update permission
  execute_hasura_api "{
    \"type\": \"pg_create_update_permission\",
    \"args\": {
      \"source\": \"default\",
      \"table\": \"$table\",
      \"role\": \"admin\",
      \"permission\": {
        \"columns\": \"*\",
        \"filter\": {},
        \"check\": null
      }
    }
  }"

  # Delete permission
  execute_hasura_api "{
    \"type\": \"pg_create_delete_permission\",
    \"args\": {
      \"source\": \"default\",
      \"table\": \"$table\",
      \"role\": \"admin\",
      \"permission\": {
        \"filter\": {}
      }
    }
  }"
done

echo "✅ Admin permissions created successfully"
echo ""

echo "=================================="
echo "🎉 Hasura configuration completed!"
echo "=================================="
echo ""
echo "📍 Hasura Console: http://localhost:8095/console"
echo "🔑 Admin Secret: $HASURA_ADMIN_SECRET"
echo "📊 GraphQL Endpoint: http://localhost:8095/v1/graphql"
echo ""
