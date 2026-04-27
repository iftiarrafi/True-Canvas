# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci  # Removed --omit=dev since nodemon is in dependencies

# Stage 2: Production image
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p uploads

EXPOSE 4000


CMD ["npm", "run", "dev"]