FROM node:6
WORKDIR /app
COPY . /app
RUN npm rebuild node-sass --force
RUN npm install
ENTRYPOINT [ "npm", "start" ] 
EXPOSE 6001
