prod:
	docker-compose up

dev:
	docker-compose -f docker-compose.dev.yml up

build:
	docker build -t gcr.io/luce-studio-site/cms:v$(v) .

push:
	docker push gcr.io/luce-studio-site/cms:v$(v)

cluster:
	gcloud container clusters create cms --num-nodes=2

get-cluster:
	gcloud container clusters get-credentials cms

deploy:
	kubectl run cms --image=gcr.io/luce-studio-site/cms:v$(v) --port 8000

roll-up:
	kubectl set cms deployment/cms cms=gcr.io/luce-studio-site/cms:v$(v)

expose:
	kubectl expose deployment cms --type=LoadBalancer --port 80 --target-port 8000

service:
	kubectl get service