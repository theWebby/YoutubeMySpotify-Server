FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ENV SPOTIFY_CID=    [SPOTIFY_CID]
ENV SPOTIFY_SECRET= [SPOTIFY_SECRET]

EXPOSE 3000 443
CMD [ "node", "app.js" ]