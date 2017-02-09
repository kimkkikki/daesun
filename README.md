# daesun

- brew install python3
- brew install libmemcached
- brew install memcached
- brew services start memcached

- pip install virtualenv
- virtualenv -p python3 daesun

- pip install django 
- pip install mysqlclient
- pip install pylibmc

# DB Connenction
1. gcloud 인증 설정
```bash
gcloud auth application-default login
```
2. proxy 실행
```bash
./cloud_sql_proxy -instances=mysql=tcp:3306
```
3. MySQL 접속 (Username, Password는 서버것 그대로 사용)
```bash
mysql -u <USERNAME> -p --host 127.0.0.1
```
