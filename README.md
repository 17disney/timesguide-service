# 17disney-timesguide-service

```shell
docker stop 17disney-timesguide-service \
&& docker rm 17disney-timesguide-service \
&& cd /app/timesguide-service \
&& docker build -t 17disney-timesguide-service . \
&& docker run -e TZ="Asia/Shanghai" -d -p 28101:7001 --name 17disney-timesguide-service \
--mount type=bind,source=/app/config/17disney-timesguide-service,target=/app/config \
17disney-timesguide-service
```
