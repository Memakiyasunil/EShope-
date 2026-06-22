FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Vite requires --host to bind to all network interfaces inside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
