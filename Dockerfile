# ---------- Build frontend ----------
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build

# ---------- Build backend ----------
FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend source
COPY backend ./backend

# Copy frontend dist into backend/public
COPY --from=frontend-build /app/frontend/dist ./backend/public

ENV NODE_ENV=production

WORKDIR /app/backend

EXPOSE 5001

CMD ["node", "src/index.js"]

