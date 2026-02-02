FROM node:20-slim
WORKDIR /server
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ postgresql-client && rm -rf /var/lib/apt/lists/*
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 9000
ENTRYPOINT ["/bin/sh", "start.sh"]
