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

ENV SPOTIFY_CID=7d6e6d5684a3404e834793cca7f8382d
ENV SPOTIFY_SECRET=18cdd7e2215e40289d5475f71b53eb5e

EXPOSE 3000 443
CMD [ "node", "app.js" ]