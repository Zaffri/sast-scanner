FROM node:22.14.0-alpine

# Install dependencies and semgrep
RUN apk add --no-cache \
  python3 \
  py3-pip \
  build-base \
  python3-dev

RUN pip3 install --no-cache-dir --break-system-packages semgrep

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

CMD ["node", "index.js"]
