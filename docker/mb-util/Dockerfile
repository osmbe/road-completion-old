FROM python:2.7
MAINTAINER Open Summer of Code 2018

RUN easy_install mbutil
RUN mb-util -h

COPY . .
ENTRYPOINT sh convert.sh