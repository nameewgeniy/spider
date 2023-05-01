# syntax=docker/dockerfile:1

FROM golang:1.19 AS build
ENV GOPRIVATE gitlab.llo.su
ENV CGO_ENABLED=0

ARG NAME
ARG CI_JOB_TOKEN

WORKDIR /go/src/service

COPY . .

RUN go mod download && \
    go build --ldflags "-s -v -w" -o ./bin/application ./cmd/

FROM alpine:latest
WORKDIR /app
COPY --from=build /go/src/service/bin/application ./application
RUN chown nobody: /app -R

USER nobody
CMD ["/app/application"]