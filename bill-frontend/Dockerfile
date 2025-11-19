# Base deps
FROM node:lts-bullseye AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Dev stage (optional)
FROM base AS dev
WORKDIR /app
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5004"]

# Build stage
FROM base AS build
WORKDIR /app
COPY . .
RUN npm run build

# Prod runtime
FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist ./
# If you need custom nginx.conf, copy it too
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]