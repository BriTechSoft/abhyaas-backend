FROM node:alpine
RUN apk add --no-cache supervisor && rm -rf /tmp/* /var/cache/apk/*
COPY app.ini /etc/supervisor.d/
WORKDIR /app
COPY package.json .
RUN npm install
COPY src .
RUN npm install && npm rebuild
ENV API_PORT 50080
EXPOSE 50080
CMD ["/usr/bin/supervisord", "-n"]
