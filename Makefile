run:
	@node --watch app/app.js

d.build: 
	@docker build -f build/Dockerfile . -t spider

d.run: d.build 
	@docker run -p 8080:8080 spider:latest