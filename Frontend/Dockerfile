FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_TOSS_CLIENT_KEY
ARG VITE_TOSS_CUSTOMER_KEY

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_TOSS_CLIENT_KEY=$VITE_TOSS_CLIENT_KEY
ENV VITE_TOSS_CUSTOMER_KEY=$VITE_TOSS_CUSTOMER_KEY

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm -g i pnpm && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm i; fi

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# 커스텀 nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]