FROM node as builder

WORKDIR /usr/src/app

COPY . .

RUN yarn

RUN yarn build --dist-dir /usr/src/app/out

FROM nginx:alpine

EXPOSE 80

COPY --from=builder /usr/src/app/out /usr/share/nginx/html
