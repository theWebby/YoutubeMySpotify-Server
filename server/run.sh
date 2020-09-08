sudo docker build --tag yms-server:1.0 .
sudo docker stop $(sudo docker ps -a -q)
sudo docker run -it -v /etc/letsencrypt/:/etc/letsencrypt/:ro -v /home/ubuntu/YoutubeMySpotify-Server/server/logs:/usr/src/app/logs -p 3000:3000 -p 443:443 --restart unless-stopped yms-server:1.0

