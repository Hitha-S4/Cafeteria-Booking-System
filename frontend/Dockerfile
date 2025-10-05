# Use Node.js as base image
FROM node:16

# Set working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Expose port for the frontend
EXPOSE 3000

# Start the frontend app
CMD ["npm", "start"]
