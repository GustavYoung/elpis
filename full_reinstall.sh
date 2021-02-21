#!/bin/bash
#Copyright 2019 Gustavo Santana
#(C) Mirai Works LLC
#tput setab [1-7] Set the background colour using ANSI escape
#tput setaf [1-7] Set the foreground colour using ANSI escape
black=`tput setaf 0`
red=`tput setaf 1`
green=`tput setaf 2`
white=`tput setaf 7`
bg_black=`tput setab 0`
bg_red=`tput setab 1`
bg_green=`tput setab 2`
bg_white=`tput setab 7`
ng=`tput bold`
reset=`tput sgr0`
#echo "${red}red text ${green}green text${reset}"


uxmal2_native='/home/uslu/uxmalstream/streamer/'
uxmal2_mgrtd='/home/uslu/uxmal_2.0/'
sleep_check='/home/uslu/adplay-alone/node_modules/sleep/'
virtual_ok='/home/uslu/uxmalstream/streamer/uploads/ads/ad1'
virtual_native='/home/uslu/uxmalstream/streamer/uploads/ads/ad1'
virtual_mgrtd='/home/uslu/uxmal_2.0/uploads/ads/ad1'
i_native=0
i_native_ok=0
i_mgrtd=0
i_mgrtd_ok=0

# Nombre de instancia para que no choque con la de uxmalstream
SERVICE="L_installer_V3.2";
echo "${red}${bg_white}${ng}Comenzando instalacion...${reset}";
cd /home/uslu/;

echo "Deteniendo servicios anterioresx2...";
sudo service Llayer-main stop && sudo service Llayer-banners stop;
sudo service Llayer-main stop && sudo service Llayer-banners stop;

echo "Purgando todas las instalaciones anteriores...";
sudo rm -rf /home/uslu/Llayer_utils/;
sudo rm -rf /home/uslu/adplay-alone/;
sudo rm -rf /home/uslu/elements/;
sudo rm fixl192.*;

echo "Clonando Modulos...";
  echo "App ropongi :)";
  sleep 5;
  echo "Parchando Modulos...";
  cp -R /home/uslu/elpis/mods/dbus-native /home/uslu/elpis/node_modules/;
  cp -R /home/uslu/elpis/mods/omxplayer-controll-ucp /home/uslu/elpis/node_modules/;
  cp -R /home/uslu/elpis/mods/omxplayer-controll3 /home/uslu/elpis/node_modules/;
  cp -R /home/uslu/elpis/mods/node-schedule /home/uslu/elpis/node_modules/;
  
  echo "Instalando Nucleo";
  cd /home/uslu/elpis/;
  npm install;
  npm install sleep;
  npm install node-cmd;

  echo "Instalando Nucleo";
  #cd /home/uslu/adplay-alone/;
  #tar -xzvf node_mods.tar.gz -C /home/uslu/adplay-alone/;
  #tar -xzvf node_gyp.tar.gz -C /home/uslu/adplay-alone/;

  #sudo npm install;
  #sudo npm install sleep --unsafe-perms;
  #sudo npm install node-cmd --unsafe-perms;
  sleep 10;
echo "Instalar servicios..."
sudo chmod +x /home/uslu/elpis/banner_sleep;
sudo chmod +x /home/uslu/elpis/bannerimg2;
sudo cp /home/uslu/elpis/Llayer-main /etc/init.d/Llayer-main;
sudo cp /home/uslu/elpis/Llayer-banners /etc/init.d/Llayer-banners;
sudo chmod +x /etc/init.d/Llayer-main;
sleep 1;
sudo chmod +x /etc/init.d/Llayer-banners;
sleep 1;
sudo update-rc.d Llayer-main defaults;
sleep 2;
sudo update-rc.d Llayer-banners defaults;
sleep 2;
reset;
clear;
echo "${green}${bg_black}${ng}Verifica que el crontab tenga las siguientes lineas activas."
echo "*/3 * * * * bash /home/uslu/elpis/elements_sync.sh"
echo "*/3 * * * * bash /home/uslu/elpis/Le_watch_dog.sh"
read -p "Presiona ENTER cuando estes listo para editar el crontab.${reset}"
sudo crontab -e;
sudo bash /home/uslu/elpis/Le_watch_dog.sh;
clear;
read -p "${green}${bg_black}${ng}Eso es todo. Presiona ENTER para salir."