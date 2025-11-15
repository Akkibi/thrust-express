maps:
	python3 generate_maps.py

build:
	make maps
	yarn build
