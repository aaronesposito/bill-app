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
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY . .
RUN npm run build

# Prod runtime
# Prod runtime
FROM nginx:alpine AS prod

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our nginx config into the default site
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]