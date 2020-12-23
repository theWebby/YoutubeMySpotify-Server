# Server

Purely for authentication. Hosted somewhere in the clouds.

## Start Server

```js
SPOTIFY_CID=spotify_cid SPOTIFY_SECRET=spotify_secret node app
```

### Docker

docker build --tag yms-server:1.0 .
docker run --rm -p 3000:3000 yms-server

---

docker run --rm -it -v ~/testSSL:/root/testSSL:ro -p 3000:3000

- `--rm` -> Deletes instance when it is stopped
- `-it` -> Makes container like a terminal session
- `-v` -> Mount volume
- `../:ro` -> Read only
- `-p` -> Map ports (publish ports)

## Fargate

### Pushing to ECR

Login

```sh
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 126326300119.dkr.ecr.eu-west-2.amazonaws.com
```

Build

```sh
docker build --tag yms-server:1.0 .
```

Tag

```sh
docker tag [imageID] 126326300119.dkr.ecr.eu-west-2.amazonaws.com/youtubemyspotify
```

Push

```sh
docker push 126326300119.dkr.ecr.eu-west-2.amazonaws.com/youtubemyspotify
```

Deploy

```sh
docker system prune -f
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 126326300119.dkr.ecr.eu-west-2.amazonaws.com
docker build --tag yms-server:1.0 .
docker tag yms-server:1.0 126326300119.dkr.ecr.eu-west-2.amazonaws.com/youtubemyspotify
docker push 126326300119.dkr.ecr.eu-west-2.amazonaws.com/youtubemyspotify
aws ecs update-service --cluster youtubemyspotify --service youtubemyspotify-service --force-new-deployment
```
