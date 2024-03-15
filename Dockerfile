# using light weight node 20 alpine
FROM node:20-alpine3.18 as builder

# create directory
WORKDIR /build

# copy source code into build directory
COPY . /build

# npm install legecy peer deps as we are having trouble with paystack version
RUN npm install --legacy-peer-deps

# compile source code in production mode
RUN npm run build --configuration=production

# using the stable nginx alpine
FROM nginx:stable-alpine

# copy nginx config into nginx
COPY --from=builder /build/.nginx/nginx.conf /etc/nginx/conf.d

# copy product build into nginx html folder
COPY --from=builder /build/dist/capstone /usr/share/nginx/html

# expose port 80
EXPOSE 80
