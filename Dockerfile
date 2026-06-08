FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN npm config set fund false
RUN npm config set audit false
RUN npm config set loglevel verbose
RUN npm config set update-notifier false

COPY package.json package-lock.json ./

RUN npm ci

COPY global.d.ts ./
COPY next.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.mjs ./
COPY tsconfig.json ./
COPY public ./public
COPY src ./src

ENV NEXT_STANDALONE_BUILD=true
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ARG PORT=4000

ENV PORT=$PORT
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE $PORT

CMD ["node", "server.js"]
