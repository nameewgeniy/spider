#!/bin/bash
set -e

clickhouse client -n <<-EOSQL
    CREATE DATABASE IF NOT EXISTS spider;
    CREATE TABLE IF NOT EXISTS spider.spider (x Int32) ENGINE = Log;
EOSQL