docker ps
docker stop ecd1
docker images
/----------------------------------------------------------/
docker rm conatiner_id
docker rmi image_name
docker build -t node-mongo-docker .
docker run -it -p 9000:8080 node-mongo-docker
/----------------------------------------------------------/

FOR DOCKER HUB DEPLOYMENT
docker images
docker tag image_name:latest hvaishnavi/image_name
docker images
docker push hvaishnavi/image_name

PULL FROM DOCKER HUB
docker pull hvaishnavi/image_name
docker images
docker run -p 8080:8080 hvaishnavi/image_name