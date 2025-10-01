# Development Dockerfile for frontend development only
FROM node:20-alpine

WORKDIR /app

# Install dependencies for building native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Expose dev server port
EXPOSE 1420

# Expose Vitest UI port
EXPOSE 51204

# Default command for development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
