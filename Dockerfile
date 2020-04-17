FROM node:13.8.0-alpine as BUILDER

USER root

COPY /package.json /app/package.json
WORKDIR /app

RUN npm install -dd
RUN npm rebuild

COPY . /app

# ENVS
ENV ETCD_URLS ""
ENV TELEGRAM_TOKEN ""
ENV ENVIRONMENT "dev"

RUN chmod +x run.sh

# RUN
CMD ["sh", "-C", "run.sh"]