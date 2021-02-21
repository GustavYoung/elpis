#!/bin/bash
#Copyright 2018 Gustavo Santana
#(C) Mirai Works LLC
#Desactivamos el puto cursor >P
sleep 35;

# Nombre de instancia para que no choque con la de uxmalstream
SERVICE="L_layer_v1";

# infinite loop!
while true; do
        if ps ax | grep -v grep | grep $SERVICE > /dev/null
        then
        sleep 1;
else
        sudo node /home/uslu/elpis/adplay-alone-mod.js;
        date;
        sleep 3;
#       done
fi
done
