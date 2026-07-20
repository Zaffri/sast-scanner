#!/bin/sh
set -e

ACCESS_KEY="${GARAGE_DEFAULT_ACCESS_KEY:-default-key}"
BUCKET_TWO="${PROCESSED_BUCKET:-bucket-two}"

echo "Starting Garage entry script"
# /garage server --single-node &
/garage server --single-node --default-bucket &
GARAGE_PID=$!

echo "Waiting for Garage to initialize"
until /garage status >/dev/null 2>&1; do
  sleep 1
done

echo "Configuring cluster layout"

# Assign layout
NODE_ID=$(/garage status | grep -oE '^[a-f0-9]{16}' | head -n 1)
if [ -n "$NODE_ID" ]; then
  # Check if a layout is already applied to avoid "Invalid new layout version" errors
  if /garage status | grep -q "No layout configured"; then
    echo "No layout found. Assigning and applying version 1..."
    /garage layout assign -z "dc1" -c "10G" "$NODE_ID"
    /garage layout apply --version 1
  else
    echo "Layout already configured. Skipping layout assignment."
  fi
else
  echo "Error: Could not retrieve Garage Node ID."
  exit 1
fi


echo "Creating additional buckets: $BUCKET_TWO"
# /garage bucket create "$BUCKET_ONE" || true
/garage bucket create "$BUCKET_TWO" || true

echo "Granting permissions"
# /garage bucket allow "$BUCKET_ONE" --key "$KEY_NAME" --read --write
# /garage bucket allow "$BUCKET_TWO" --key "$KEY_NAME" --read --write
/garage bucket allow "$BUCKET_TWO" --key "${ACCESS_KEY}" --read --write || true

echo "Garage init complete"
# Bring the background garage server process back to the foreground to keep container alive
wait "$GARAGE_PID"
