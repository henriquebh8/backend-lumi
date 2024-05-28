DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin') THEN
      CREATE ROLE admin WITH LOGIN PASSWORD 'admin';
   END IF;
END
$$;

DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lumi') THEN
      CREATE DATABASE lumi OWNER admin;
   END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE lumi TO admin;
