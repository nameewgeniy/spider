run:
	@docker-compose -f build/docker-compose.yaml up -d
	@node --watch app/app.js

d.build: 
	@docker build -f build/Dockerfile . -t spider

d.run: d.build 
	@docker run -p 8080:8080 spider:latest