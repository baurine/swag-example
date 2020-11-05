.PHONY: server

default: server

server:
	go build -o bin/web main.go

api:
	swag init --exclude ui
	cd ui && yarn gen:api

run:
	bin/web
