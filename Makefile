run:
	@docker-compose -f build/docker-compose.yaml up -d
	@pnpm start

d.build: 
	@docker build -f build/Dockerfile . -t spider

d.run: d.build 
	@docker run -p 8080:8080 spider:latest

prod:
	@docker-compose -f build/docker-compose.yaml up -d --build