#!/bin/bash
#Copyright 2018-2021 Gustavo Santana
#(C) Mirai Works LLC
#
sleep 1;
# Nombre de instancia para que no choque con la de uxmalstream

resolution=$(tvservice -s | grep -oP '[[:digit:]]{1,4}x[[:digit:]]{1,4} ')
a="1920x1080 "
b="1280x720 "
c="720x480 "
d="320x240 "

SERVICE="Banner_layer_L";

BANNERPATH="/home/uslu/elements/Banners";

echo "$resolution"

if [ "$resolution" == "$a" ]
then
        boxed="--win 0,0,1920,1080";
elif [ "$resolution" == "$b" ]; 
then
        boxed="--win 0,0,1280,720";
elif [ "$resolution" == "$c" ]; 
then
        boxed="--win 23,37,695,443";
elif [ "$resolution" == "$d" ]; 
then
        exit;
fi
echo "$boxed"
# infinite loop!
while true; do
        if ps ax | grep -v grep | grep $SERVICE > /dev/null
        then
        sleep 1;
else
	for entry in $BANNERPATH/*
	do
	/home/uslu/elpis/banner_sleep 333600;
	( cmdpid="$BASHPID";
          (sleep 25; sudo killall bannerimg2 && killall bannerimg2) \
         & while !  /home/uslu/elpis/bannerimg2 $boxed -l 16 -k "$entry";
           do
               echo "Todo listo";
               exit;
           done )
	done
fi
done
