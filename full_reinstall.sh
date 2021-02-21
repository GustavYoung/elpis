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

sleep 1;

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
SERVICE="L_installer_V3.1";
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

echo "Clonando repositorio...";
git clone https://github.com/GustavYoung/Llayer_utils.git;
echo "repo fini";
echo "Creando directorios";
mkdir /home/uslu/elements;

echo "Descargando nucleo...";
scp -r -P 3113 uxmal-ftp@uxm3.uxmalstream.com:/home/uxm3-bk/CLIENTES/desarrollo/adplay/adplay-alone/ /home/uslu/;
sleep 5;
echo "Clonando Modulos...";
if [ -d "$uxmal2_native" ]; then
  cp -R /home/uslu/uxmalstream/streamer/node_modules/ /home/uslu/adplay-alone/;
  echo "App nueva :)";
  sleep 5;
  echo "Parchando Modulos...";
  cp -R /home/uslu/adplay-alone/dbus-native /home/uslu/adplay-alone/node_modules/;
  cp -R /home/uslu/adplay-alone/omxplayer-controll-ucp /home/uslu/adplay-alone/node_modules/;
  cp -R /home/uslu/adplay-alone/omxplayer-controll3 /home/uslu/adplay-alone/node_modules/;
  
  echo "Instalando Nucleo";
  cd /home/uslu/adplay-alone/;
  npm install;
  npm install sleep;
  npm install node-cmd;
  
  echo "Parchando Flotantes...";
  sudo cp /home/uslu/Llayer_utils/fspatch/video.signal.sh /home/uslu/adsplayer/video.signal.sh;
  sudo service AdsPlayer restart;
  cd /home/uslu/;
  sleep 5;
  reset;
  clear;
fi
if [ -d "$uxmal2_mgrtd" ]; then
  cp -R /home/uslu/uxmal_2.0/node_modules/ /home/uslu/adplay-alone/;
  echo "App migrada :S"
  sleep 5;
  
  echo "Parchando Modulos...";
  cp -R /home/uslu/adplay-alone/dbus-native /home/uslu/adplay-alone/node_modules/;
  cp -R /home/uslu/adplay-alone/omxplayer-controll-ucp /home/uslu/adplay-alone/node_modules/;
  cp -R /home/uslu/adplay-alone/omxplayer-controll3 /home/uslu/adplay-alone/node_modules/;
  
  echo "Instalando Nucleo";
  cd /home/uslu/adplay-alone/;
  #scp -r -P 3113 uxmal-ftp@uxm3.uxmalstream.com:/home/uxm3-bk/CLIENTES/desarrollo/adplay/node/node_modules/ /home/uslu/adplay-alone/;
  scp -P 3113 uxmal-ftp@uxm3.uxmalstream.com:/home/uxm3-bk/CLIENTES/desarrollo/adplay/node/node_mods.tar.gz /home/uslu/adplay-alone/;
  tar -xzvf node_mods.tar.gz -C /home/uslu/adplay-alone/;
  scp -P 3113 uxmal-ftp@uxm3.uxmalstream.com:/home/uxm3-bk/CLIENTES/desarrollo/adplay/node/node_gyp.tar.gz /home/uslu/adplay-alone/;
  tar -xzvf node_gyp.tar.gz -C /home/uslu/adplay-alone/;
  scp -r -P 3113 uxmal-ftp@uxm3.uxmalstream.com:/home/uxm3-bk/CLIENTES/desarrollo/adplay/node/.node-gyp/ /home/uslu/;
  #sudo npm install;
  #sudo npm install sleep --unsafe-perms;
  #sudo npm install node-cmd --unsafe-perms;
  sleep 10;
  
  echo "Parchando Flotantes...";
  sudo cp /home/uslu/Llayer_utils/fspatch/video.signal.sh /home/uslu/adsplayer/video.signal.sh;
  sudo service AdsPlayer restart;
  sleep 3;
  cd /home/uslu/;
  reset;
  clear;
fi
echo "Actualizando modulos 201...";
scp -P 3113 uxmal-ftp@uxm3.uxmalstream.com:/home/uxm3-bk/CLIENTES/desarrollo/adplay/logo1.sh /home/uslu/;
sudo cp /home/uslu/logo1.sh /home/uslu/libgpng/logo1.sh;
scp -P 3113 uxmal-ftp@uxm3.uxmalstream.com:/home/uxm3-bk/CLIENTES/desarrollo/adplay/adplay-alone/adplay-alone-mod.js /home/uslu/adplay-alone/;
sudo killall glibimg;
sleep 10;
echo "Instalar servicios..."
sudo cp /home/uslu/Llayer_utils/Llayer-main /etc/init.d/Llayer-main;
sudo cp /home/uslu/Llayer_utils/Llayer-banners /etc/init.d/Llayer-banners;
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
if [ ! \( -e "${sleep_check}" \) ]
then
     echo "${red}${bg_black}${ng}La instalacion esta dañada.${reset}";
     echo "%ERROR: Module ${sleep_check} does not exist!" >&2
     echo "Intentando reparar:"
     scp -r -P 3113 uxmal-ftp@uxm3.uxmalstream.com:/home/uxm3-bk/CLIENTES/desarrollo/adplay/node/node_modules/ /home/uslu/adplay-alone/;
     echo "Se forzo una instalacion de modulos es importante revisar que el screen funcione correctamente"
fi
echo "Vinculando anuncios con audio...";
echo "${green}${bg_black}${ng}Desactiva los ads2."
echo "en la linea #54 donde dice ads2 hay que poner no"
echo "en la linea #58 donde dice flotantes hay que poner no"
read -p "Presiona ENTER cuando estes listo para editar el automatico.${reset}"
sudo vim /home/uslu/gstool/cliente.cfg;
clear;
if [ -d "$uxmal2_mgrtd" ]; then
  echo "App migrada :S"
#Comprobacion de Link virtual.
while [ $i_mgrtd_ok -lt 5 ]
do
  echo "Intentos: $i_mgrtd"
  sudo rm -rf /home/uslu/uxmal_2.0/uploads/ads/ad1;
  ln -s /home/uslu/elements/Spots_con_audio/ /home/uslu/uxmal_2.0/uploads/ads/ad1;
  ((i_mgrtd++));
  if [ ! -L "${virtual_mgrtd}" ]
  then
     echo "%ERROR: El link ${virtual_mgrtd} no es valido!" >&2
     echo "Reintentando crear link"
     sudo ln -s /home/uslu/elements/Spots_con_audio/ /home/uslu/uxmal_2.0/uploads/ads/ad1;
     else
     echo "Link Valido!!!";
     i_mgrtd_ok=11;
  fi     
  if [[ "$i_mgrtd_ok" == '11' ]]; then
    break
  fi
done
  sleep 5;
  reset;
  clear;
fi
if [ -d "$uxmal2_native" ]; then
  echo "App nativa :)";
  #Comprobacion de Link virtual.
while [ $i_native_ok -lt 5 ]
do
  echo "Intentos: $i_native"
  sudo rm -rf /home/uslu/uxmalstream/streamer/uploads/ads/ad1;
  ln -s /home/uslu/elements/Spots_con_audio/ /home/uslu/uxmalstream/streamer/uploads/ads/ad1;
  ((i_native++));
  if [ ! -L "${virtual_native}" ]
  then
     echo "%ERROR: El link ${virtual_native} no es valido!" >&2
     echo "Reintentando crear link"
     sudo ln -s /home/uslu/elements/Spots_con_audio/ /home/uslu/uxmalstream/streamer/uploads/ads/ad1;
     else
     echo "Link Valido!!!";
     i_native_ok=11;
  fi     
  if [[ "$i_native_ok" == '11' ]]; then
    break
  fi
done
  sleep 5;
  reset;
  clear;
fi
clear;
echo "${green}${bg_black}${ng}Reemplaza "uxm-ivan" en la linea #2 por"
echo "el usuario del cliente ej:uxm-heineken"
echo "si es necesario tambien ajusta la velocidad en kb/s en la linea #3"
echo "Este paso es nuevo asi que se tiene que volver a realizar la config."
read -p "Presiona ENTER cuando estes listo para editar el archivo.${reset}"
vim /home/uslu/Llayer_utils/sync.cfg;
reset;
clear;
echo "${green}${bg_black}${ng}Se va a lanzar el sincronizador manualmente"
echo "en caso necesario confirma la llave escribiendo yes"
echo "y pulsando ENTER revisa que los archivos sean correctos ${reset}"
sudo bash /home/uslu/Llayer_utils/elements_sync.sh;
sleep 5;
reset;
clear;
echo "${green}${bg_black}${ng}Verifica que el crontab tenga las siguientes lineas activas."
echo "*/3 * * * * bash /home/uslu/Llayer_utils/elements_sync.sh"
echo "*/3 * * * * bash /home/uslu/Llayer_utils/Le_watch_dog.sh"
read -p "Presiona ENTER cuando estes listo para editar el crontab.${reset}"
sudo crontab -e;
sudo bash /home/uslu/Llayer_utils/Le_watch_dog.sh;
clear;
read -p "${green}${bg_black}${ng}Eso es todo. Presiona ENTER para salir."