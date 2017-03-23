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
- pip install python-twitter
- pip install pytz

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

1. static폴더로 이동한다.
```bash
$> cd daesun/static
```

2. nvm(node version manager) 설치
> https://github.com/creationix/nvm 를 참고하여 설치한다.

3. node 설치
```bash
$ daesun/static> nvm install v6.9.1
```

4. node plugin을 설치
```bash
$ daesun/static> npm install
```

5. browser에서 사용한 library를 설치
```bash
$ daesun/static> node_modules/.bin/bower install
```


# 기타 명령어
CORS 추가
```bash
gsutil cors set cors-gs.json gs://daesun2017.appspot.com
```

static파일 업로드
```bash
gsutil rsync -d -R static/ gs://daesun2017.appspot.com/static
```