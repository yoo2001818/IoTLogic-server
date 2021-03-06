FROM knjcode/rpi-node-armv7:latest
ENV NODE_ENV production
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
RUN npm install pg pg-hstore
COPY . /usr/src/app
EXPOSE 8000
CMD [ "/usr/src/app/start.sh" ]
