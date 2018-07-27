FROM alpine:3.4
MAINTAINER Jake Skeates <jake@skeat.es>

ARG TIPPECANOE_RELEASE="1.14.4"

RUN apk add --no-cache sudo git g++ make libgcc libstdc++ sqlite-libs sqlite-dev zlib-dev bash \
 && addgroup sudo && adduser -G sudo -D -H tippecanoe && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers \
 && cd /root \
 && git clone https://github.com/mapbox/tippecanoe.git tippecanoe \
 && cd tippecanoe \
 && git checkout tags/$TIPPECANOE_RELEASE \
 && cd /root/tippecanoe \
 && make \
 && make install \
 && cd /root \
 && rm -rf /root/tippecanoe \
 && apk del git g++ make sqlite-dev

USER tippecanoe
WORKDIR /home/tippecanoe
COPY . /road-completion
RUN sudo mkdir /sharedfolder
ENTRYPOINT cd /road-completion/osm && sh get-data.sh && cd ../urbis && sh get-data.sh && cd ../mbtiles && sh convert.sh && cd ../wegenregister && sh get-data.sh
