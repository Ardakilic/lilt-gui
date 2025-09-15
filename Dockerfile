# Use Node.js 22 LTS
FROM node:22-alpine

# Install required packages for Electron
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    xvfb \
    dbus \
    gtk+3.0 \
    libxss \
    gconf \
    libasound2-dev \
    libgtk-3-dev \
    libgbm-dev

# Set environment variables for Electron
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    DISPLAY=:99

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create a script to start Xvfb and the app
RUN echo '#!/bin/sh\nXvfb :99 -ac -screen 0 1280x1024x16 &\nexec "$@"' > /usr/local/bin/xvfb-run.sh && \
    chmod +x /usr/local/bin/xvfb-run.sh

# Default command for running tests
CMD ["npm", "test"]

# For development, you can override with:
# docker run -it --rm -v $(pwd):/app -w /app lilt-gui npm run dev
