# ---------- Build frontend ----------
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build


# ---------- Production image ----------
FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend source
COPY backend ./backend

# Copy frontend build into backend (adjust if using Vite or CRA)
COPY --from=frontend-build /app/frontend/dist ./backend/public

ENV NODE_ENV=production

WORKDIR /app/backend

EXPOSE 8000

CMD ["node", "src/index.js"]
