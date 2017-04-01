#!/bin/sh
sudo apt-get update && sudo apt-get upgrade

sudo apt-get install -y unzip

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs