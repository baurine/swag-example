.PHONY: server

default: server

server:
	go build -o bin/web main.go

run:
	bin/web
