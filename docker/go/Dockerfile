FROM golang:latest

WORKDIR /go/src/spider

RUN go build main.go

ENTRYPOINT ["go", "run main.go"]
