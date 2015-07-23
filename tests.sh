#!/bin/bash
##############################################################################
#title           :tests.sh
#
#                       description
#-----------------------------------------------------------------------------
#	Odpala testy mocha:
#	sh tests.sh
#	Możemy dodawać zmienne środowiskowe:
#	DEBUG=horpyna:view sh tests.sh
#	Możemy wywołać określony plik w testach:
#	sh tests.sh -f core.js
#	Możemy dać parametry do DEBUG horpyna przez
#	sh tests.sh -f core.js -d view
#	co będzie równe:
#	DEBUG=horpyna:view sh tests.sh -f core.js
#-----------------------------------------------------------------------------
#												params
#-----------------------------------------------------------------------------
#	-i wyswietli listę wszystkich plików w katalogu testu i pozwoli wybrać który
#	ma się odpalić. Nie ma wartości
#	-t określamy czas w milisekundach ile ma każde wywołanie trwać domyślnie 3000
#	-f konkretny plik testów jaki chcemy odpalić
#	-d parametry DEBUG czyli ta wartość
# -l zmienna środowiskowa HORPYNA_LOG ma wartości all | error | mute
# zastosowanie pełne:
# sh tests.sh -t 1000 -f jade.js -d view -l all
#
#-----------------------------------------------------------------------------
#author		 :Krzysztof Sztompka
#date            :20150721
#version         :1.0.0
#==============================================================================
test_dir_path="./test"
mocha_dir_path="./node_modules/.bin/mocha"
node_env="test"
timeout=3000
separator="/"
# zczytuje parametry jeśli jakieś skrypt ma, i pozwala otrzymać ich wartości
for ((i=1;i<=$#;i++));
do
	if [ ${!i} = "-i" ]
	then ((i++))
		index=1;
	elif [ ${!i} = "-t" ];
	then ((i++))
		timeout=${!i};
	elif [ ${!i} = "-f" ];
	then ((i++))
		file=${!i};
	elif [ ${!i} = "-d" ];
	then ((i++))
		debug=${!i};
	elif [ ${!i} = "-l" ];
	then ((i++))
		log=${!i};
	fi
done;

if [ "$index" = "1" ]
then
	list=`find $test_dir_path -maxdepth 1 -type f `
	select selectFile in $list
	do
		test_dir_path=$selectFile
		file=""
		separator=""
		break
	done
fi

if [ "$debug" != "" ]
then
	debug="DEBUG=horpyna:$debug"
fi

if [ "$log" != "" ]
then
	log="HORPYNA_LOG=$log"
fi

command="NODE_ENV=$node_env $debug $log $mocha_dir_path --check-leaks --timeout $timeout $test_dir_path$separator$file"
env $command
