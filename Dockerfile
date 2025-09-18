# Development Dockerfile for Lilt GUI
FROM node:18-alpine AS development

# Install system dependencies
RUN apk add --no-cache \
    curl \
    build-base \
    openssl-dev \
    musl-dev \
    pkgconfig

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Tauri CLI
RUN cargo install tauri-cli

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose development port
EXPOSE 1420

# Development command
CMD ["npm", "run", "tauri:dev"]

# Production build stage
FROM development AS build

# Build the application
RUN npm run build
RUN npm run tauri:build

# Final production image
FROM alpine:latest AS production

# Install runtime dependencies
RUN apk add --no-cache ca-certificates

# Copy built application
COPY --from=build /app/src-tauri/target/release/lilt-gui /usr/local/bin/

# Create app directory
RUN mkdir -p /app

WORKDIR /app

# Expose any necessary ports
EXPOSE 8080

# Run the application
CMD ["lilt-gui"]