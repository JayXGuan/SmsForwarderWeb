FROM node:20-slim

WORKDIR /app

# Copy standalone build
COPY .next/standalone ./

# Copy static files
COPY .next/static ./.next/static

# Copy public files
COPY public ./public

# 确保数据目录存在且干净
RUN rm -rf /app/data && mkdir -p /app/data

# Set port
ENV PORT=9000

EXPOSE 9000

CMD ["node", "server.js"]