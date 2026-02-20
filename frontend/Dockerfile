FROM node:20-alpine AS builder

WORKDIR /app

# Declare build arguments for NEXT_PUBLIC env vars (needed at build time)
ARG NEXT_PUBLIC_API_URL=http://103.176.45.14:3000/api
ARG NEXT_PUBLIC_MAP_CENTER_LAT=-6.2
ARG NEXT_PUBLIC_MAP_CENTER_LNG=106.8
ARG NEXT_PUBLIC_MAP_ZOOM=11

# Expose as env vars during build so Next.js can bake them into the bundle
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MAP_CENTER_LAT=$NEXT_PUBLIC_MAP_CENTER_LAT
ENV NEXT_PUBLIC_MAP_CENTER_LNG=$NEXT_PUBLIC_MAP_CENTER_LNG
ENV NEXT_PUBLIC_MAP_ZOOM=$NEXT_PUBLIC_MAP_ZOOM

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js app (NEXT_PUBLIC_* are embedded into the bundle at this point)
RUN npm run build

# ---- Runner Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built output from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3001

CMD ["npm", "run", "start", "--", "-p", "3001"]