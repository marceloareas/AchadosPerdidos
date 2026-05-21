CREATE TABLE password_reset_token (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    usuario_id INTEGER NOT NULL,
    data_expiracao TIMESTAMP NOT NULL,
    CONSTRAINT fk_usuario_token FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);