FROM node:13

RUN echo "UTC" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

WORKDIR /usr/src
COPY ["package.json", "package-lock.json", "/usr/src/"]
RUN npm install -g sequelize sequelize-auto tedious
RUN npm install

COPY . .

EXPOSE 80

CMD npm start