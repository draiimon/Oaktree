# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
COPY server.js ./

# Install dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]

