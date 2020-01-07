stop:
	docker stop cms

clear:
	make stop
	docker system prune --volumes --force

clear-all:
	make stop
	docker system prune --volumes --force --all

fresh:
	make clear-all
	make dev

network:
	docker network inspect facile >/dev/null || docker network create --driver bridge facile

compose:
	make network
	docker-compose up

# prod:
# 	make network
# 	docker build -t facile .
# 	docker run -d \
# 		--restart=unless-stopped \
# 		--name=cms \
# 		--network=facile \
# 		-p 24040:24040 \
# 		--mount type=volume,target=/,source=cms,destination=/home/node/cms \
# 		facile

# dev:
# 	make network
# 	docker build -t facile .
# 	docker run -d \
# 		--restart=unless-stopped \
# 		--name=cms \
# 		--network=facile \
# 		-p 24040:24040 \
# 		-p 24050:24050 \
# 		--entrypoint=npm \
# 		--mount type=bind,source="$(CURDIR)"/,target=/home/node/cms \
# 		facile run dev

build:
	docker build -t lucestudio/facile:v$(v) -t lucestudio/facile:latest .

push:
	docker push lucestudio/facile

docker:
	make build v=$(v) && make push