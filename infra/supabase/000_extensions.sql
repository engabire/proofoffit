-- Enable required extensions
create extension if not exists pgcrypto;
create extension if not exists vector;
create extension if not exists pg_cron;
create extension if not exists pg_stat_statements;