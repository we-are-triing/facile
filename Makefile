network:
	docker network inspect facile >/dev/null || docker network create --driver bridge facile

prod:
	make network
	docker-compose up

dev:
	make network
	docker-compose -f docker-compose.dev.yml up

build:
	docker build -t lucestudio/facile:v$(v) -t lucestudio/facile:latest .

push:
	docker push lucestudio/facile

docker:
	make build v=$(v) && make push