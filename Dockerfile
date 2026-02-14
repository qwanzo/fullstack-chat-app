# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and lockfile
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose backend port (your app defaults to PORT from .env)
EXPOSE 5001

# Start the server
CMD ["npm", "start"]
