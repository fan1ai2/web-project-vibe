FROM alpine:latest
WORKDIR /app
COPY sampleapp .env ./
RUN mkdir -p /app/data
EXPOSE 33101
CMD ["./sampleapp"]
