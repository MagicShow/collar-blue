FROM node:22-alpine

WORKDIR /app

# Copy server package files and install
COPY server/package*.json ./
RUN npm ci --omit=dev

# Copy server source
COPY server/src ./src

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["sh", "-c", "cd server && node src/index.js"]
