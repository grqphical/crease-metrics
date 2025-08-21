FROM go:1.24 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go .

RUN CGO_ENABLED=0 GOOS=linux go build -o /backend

FROM alpine:latest AS build-release-stage

WORKDIR /

COPY --from=build-stage /backend /backend

EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["/backend"]