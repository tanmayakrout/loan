FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# COPY everything from backend folder
COPY . .

EXPOSE 5000

CMD ["npm", "start"]

