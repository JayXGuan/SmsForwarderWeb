FROM node:20-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

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