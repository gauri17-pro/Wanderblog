# -------- Stage 1: Install Dependencies --------
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm ci 

# -------- Stage 2: Runtime Image --------
FROM node:20-alpine

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Security: run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000

CMD ["node", "server.js"]
