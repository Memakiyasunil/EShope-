# Stage 1: Build the React application
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install framer-motion

COPY . .
# We don't need to specify VITE_API_URL here because we will use relative path '/api' in docker-compose.yml
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the static built files from the build stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
