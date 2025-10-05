#!/bin/bash
podman run -d \
  --name blureserve-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=blureserve \
  -v blureserve_db_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15
