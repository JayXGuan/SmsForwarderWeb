FROM node:20-slim

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copy standalone build
COPY .next/standalone ./

# Copy static files
COPY .next/static ./.next/static

# Copy public files
COPY public ./public

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Set port
ENV PORT=9000

EXPOSE 9000

CMD ["node", "server.js"]