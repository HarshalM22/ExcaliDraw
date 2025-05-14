FROM node:22-alpine 
 
WORKDIR /app
 
COPY . .

RUN npm install -g pnpm@latest-10
RUN pnpm install 

EXPOSE 3000  
 
CMD [ "node", "apps/frontend/dist" ]