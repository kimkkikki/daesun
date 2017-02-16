# daesun

- brew install python3
- brew install libmemcached

- pip install virtualenv
- virtualenv -p python3 daesun

- pip install django 
- pip install mysqlclient
- pip install pylibmc
- pip install hiredis
- pip install django-redis-cache

# DB Connenction
1. gcloud 인증 설정
```bash
gcloud auth application-default login
```
2. proxy 실행 (실행파일 다운로드 : https://cloud.google.com/sql/docs/mysql-connect-proxy)
```bash
./cloud_sql_proxy -instances=daesun2017:asia-east1:mysql=tcp:3306
```
3. MySQL 접속 (Username, Password는 서버것 그대로 사용)
```bash
mysql -u <USERNAME> -p --host 127.0.0.1
```

# JS/CSS 파일 설정

1. nvm(node version manager) 설치
> https://github.com/creationix/nvm 를 참고하여 설치한다.

2. node 설치
```bash
$> nvm install v6.9.1
```

3. node plugin을 설치
```bash
$> npm install
```

4. browser에서 사용한 library를 설치
```bash
$> node_modules/.bin/bower install
```


