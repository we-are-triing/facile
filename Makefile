network:
	docker network inspect facile >/dev/null || docker network create --driver bridge facile

prod:
	make network
	docker build -t facile .
	docker run \
		--restart=unless-stopped \
		--name=cms \
		--network=facile \
		-p 24040:24040 \
		facile

dev:
	make network
	docker build -t facile .
	docker run \
		--restart=unless-stopped \
		--name=cms \
		--network=facile \
		-p 24040:24040 \
		-p 24050:24050 \
		--entrypoint=npm \
		facile run dev

build:
	docker build -t lucestudio/facile:v$(v) -t lucestudio/facile:latest .

push:
	docker push lucestudio/facile

docker:
	make build v=$(v) && make push