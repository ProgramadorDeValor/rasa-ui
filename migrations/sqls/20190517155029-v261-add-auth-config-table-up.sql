create table auth_config
(
    auth_id SMALLSERIAL,
    auth_type varchar (50) not null COLLATE pg_catalog."default" DEFAULT 'user',
    user_name varchar null,
    user_password varchar null,
    token varchar null,
    apiurl varchar null,
    adalinstance VARCHAR null,
    adaltenantid varchar null,
    adalclientid varchar null,
    active BOOLEAN DEFAULT FALSE,
    PRIMARY Key (auth_id)
)
WITH (
  OIDS = FALSE
)
TABLESPACE pg_default;

--Sets Default config
-- pwd = admin
INSERT INTO auth_config (auth_type, user_name, user_password, active) VALUES ('user','admin', '$2b$10$ucE7ZBZm4TPg..L8mrVhuu6XMS34xdbPqly6XzFzw043sPHbV2dCu', true);