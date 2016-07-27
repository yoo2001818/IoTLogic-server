FROM yoo2001818/armv7-node
ENV NODE_ENV production
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 8000
CMD [ "/usr/src/app/start.sh" ]
