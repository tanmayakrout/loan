FROM mysql:8

ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=home_loan_db

COPY init.sql /docker-entrypoint-initdb.d/

