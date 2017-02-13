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
