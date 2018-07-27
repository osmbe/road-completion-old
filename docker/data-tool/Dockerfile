FROM ubuntu:14.04.5
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  python3-pip \
  python3-dev \
  ipython \
  git-core \
  libpq-dev \
  libjpeg-dev \
  binutils \
  libproj-dev \
  gdal-bin \
  libxml2-dev \
  libxslt1-dev \
  zlib1g-dev \
  libffi-dev \
  libssl-dev \
  language-pack-pt

RUN dpkg-reconfigure locales
# Set the locale
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV LC_CTYPE en_US.UTF-8
RUN locale

RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*

RUN sudo apt-get update
RUN sudo apt-get install -y osmosis


COPY . /road-completion

ENTRYPOINT cd ./road-completion/osm && sh get-data.sh && cd ../urbis && sh get-data.sh && cd ../mobigis && sh get-data.sh && cd ../wegenregister && sh get-data.sh
#ENTRYPOINT cd ./road-completion/wegenregister && sh get-data.sh

