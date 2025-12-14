# see all running containers
sudo docker ps

# see all containers (including stopped)
sudo docker ps -a

# run postgres container on the fastapi_net network in detached mode
docker run --name my-postgres-db --network fastapi_net -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres:latest

# run redis container on the fastapi_net network in detached mode
docker run --name my-redis-cache --network fastapi_net -p 6379:6379 -d redis:latest

# remove container by name
sudo docker rm my-postgres-db

# remove container by id
sudo docker rm <container_id>

# stop container by name
sudo docker stop my-redis-cache

# stop container by id
sudo docker stop <container_id>

# create network
sudo docker network create fastapi_net

# print logs of a container by name
sudo docker logs my-postgres-db

# run existing container by name
sudo docker start my-postgres-db