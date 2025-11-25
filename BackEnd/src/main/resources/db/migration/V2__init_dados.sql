-- Inserção de 5 Usuários
INSERT INTO usuario (nome, email, senha) VALUES
('Ana Carolina Sá', 'carolzinha.da.globo@email.com', '$2a$12$kbCR.zLBVFJjT8BUvrhcgeh./O2Pi5e4m1s6kYUjnXh8RjsD4LtHy'),
('Caio Santos', 'caiosantos.dev@email.com', '$2a$12$rL0U5r8J/.95BrJHPE4vx.7P4gm6XUyB7/O7/WOSIlS0Fxxukt8VS'),
('Flavio Alecio', 'flavio.cybersec.audit@email.com', '$2a$12$./2c5nxuaKDeXRh1WQp1I.2YijbK9hH3JplQdIGyv09bdPxyRvQcy'),
('Vinicius Saidy', 'vs.amo.glorioso@email.com', '$2a$12$.94OyxYG.iCqUnGyc0aQBOyci/EeQiypw2iBNh5t25RiqgMNyni7G'),
('Marcelo Areas', 'professor.dos.joguinhos@email.com', '$2a$12$cxym59E/AssE6wZZQ52vN.TZHH/pDslR2y/BooKTN.2yLNEpeUdAG');

-- Inserção das Categorias Padrão (sem alterações)
INSERT INTO categoria (nome) VALUES
('Eletrônicos'),
('Acessórios'),
('Chaves'),
('Carteiras'),
('Documentos'),
('Roupas'),
('Livros'),
('Outros');

-- Inserção de 10 Itens com status e endereços ajustados
-- 3 itens com status 'MATCHING'
-- 7 itens com status 'RECUPERADO'
-- Endereços localizados no CEFET-RJ

-- Item 1: Perdido pelo Usuário 1 (Ana Carolina Sá)
INSERT INTO item (usuario_id, nome, data_criacao, data_evento, data_devolucao, descricao, tipo, status, localizacao) VALUES
(1, 'Celular iPhone 13', '2025-10-01 14:30:00', '2025-10-01 14:30:00', NULL, 'iPhone 13 azul, com capa preta e um pequeno arranhão na tela.', 'PERDIDO', 'MATCHING', 'Perto do ginásio, na arquibancada');

-- Item 2: Achado pelo Usuário 2 (Caio Santos)
INSERT INTO item (usuario_id, nome, data_criacao, data_evento, data_devolucao, descricao, tipo, status, localizacao) VALUES
(2, 'Carteira de Couro Marrom', '2025-10-02 09:00:00', '2025-10-02 09:00:00', '2025-10-04 10:00:00', 'Encontrada em uma das mesas. Contém CNH em nome de "José Pereira".', 'ACHADO', 'RECUPERADO', 'Dentro do pavilhão E, primeiro andar');

-- Item 3: Perdido pelo Usuário 3 (Flavio Alecio)
INSERT INTO item (usuario_id, nome, data_criacao, data_evento, data_devolucao, descricao, tipo, status, localizacao) VALUES
(3, 'Fones de Ouvido Sony WH-1000XM4', '2025-09-28 18:00:00', '2025-09-28 18:00:00', NULL, 'Headphone preto, estava dentro de sua case preta.', 'PERDIDO', 'MATCHING', 'Biblioteca, mesa próxima à janela');

-- Item 4: Perdido pelo Usuário 1 (Ana Carolina Sá)
INSERT INTO item (usuario_id, nome, data_criacao, data_evento, data_devolucao, descricao, tipo, status, localizacao) VALUES
(1, 'Livro "Cálculo Volume 1"', '2025-10-03 12:00:00', '2025-10-03 12:00:00', '2025-10-06 09:00:00', 'Edição de capa dura, com marcações a lápis.', 'PERDIDO', 'RECUPERADO', 'Laboratório de Física, Bloco C');

-- Item 5: Achado pelo Usuário 4 (Vinicius Saidy)
INSERT INTO item (usuario_id, nome, data_criacao, data_evento, data_devolucao, descricao, tipo, status, localizacao) VALUES
(4, 'Molho de Chaves', '2025-10-04 19:45:00', '2025-10-04 19:45:00', '2025-10-05 15:00:00', 'Contém 3 chaves e um chaveiro de metal.', 'ACHADO', 'RECUPERADO', 'Corredor do Bloco A, próximo à sala 102');

-- Item 6: Achado pelo Usuário 5 (Marcelo Areas)
INSERT INTO item (usuario_id, nome, data_criacao, data_evento, data_devolucao, descricao, tipo, status, localizacao) VALUES
(5, 'Guarda-chuva preto', '2025-10-05 08:20:00', '2025-10-05 08:20:00', '2025-10-06 08:00:00', 'Guarda-chuva grande, deixado ao lado do bebedouro.', 'ACHADO', 'RECUPERADO', 'Pátio da cantina principal');

-- Item 7: Perdido pelo Usuário 2 (Caio Santos)
INSERT INTO item (usuario_id, nome, data_criacao, data_evento, data_devolucao, descricao, tipo, status, localizacao) VALUES
(2, 'Casaco de Moletom Cinza', '2025-09-30 22:00:00', '2025-09-30 22:00:00', NULL, 'Moletom com capuz, tamanho M, da marca Adidas.', 'PERDIDO', 'MATCHING', 'Auditório principal, cadeira H12');

-- Item 8: Perdido pelo Usuário 4 (Vinicius Saidy)
INSERT INTO item (usuario_id, nome, data_criacao, data_evento, data_devolucao, descricao, tipo, status, localizacao) VALUES
(4, 'RG - Carteira de Identidade', '2025-10-01 11:00:00', '2025-10-01 11:00:00', '2025-10-02 09:00:00', 'Documento de identidade em nome de Fernanda S. Souza.', 'PERDIDO', 'RECUPERADO', 'Secretaria acadêmica (achados e perdidos)');

-- Item 9: Achado pelo Usuário 3 (Flavio Alecio)
INSERT INTO item (usuario_id, nome, data_criacao, data_evento, data_devolucao, descricao, tipo, status, localizacao) VALUES
(3, 'Kindle Paperwhite', '2025-10-05 16:10:00', '2025-10-05 16:10:00', '2025-10-06 17:00:00', 'Encontrado em um banco de madeira perto da quadra.', 'ACHADO', 'RECUPERADO', 'Área externa, próximo à quadra de vôlei');

-- Item 10: Perdido pelo Usuário 5 (Marcelo Areas)
INSERT INTO item (usuario_id, nome, data_criacao, data_evento, data_devolucao, descricao, tipo, status, localizacao) VALUES
(5, 'Óculos de Grau', '2025-10-02 13:00:00', '2025-10-02 13:00:00', '2025-10-03 10:00:00', 'Armação preta, de metal. Deixado sobre a mesa.', 'PERDIDO', 'RECUPERADO', 'Sala de estudos do pavilhão E');

-- Relacionando Itens com Categorias
INSERT INTO item_categoria (item_id, categoria_id) VALUES
(1, 1), -- Item 1 (iPhone 13) -> Eletrônicos
(2, 4), -- Item 2 (Carteira) -> Carteiras
(2, 5), -- Item 2 (Carteira) -> Documentos (pois contém CNH)
(3, 1), -- Item 3 (Fones de Ouvido) -> Eletrônicos
(3, 2), -- Item 3 (Fones de Ouvido) -> Acessórios
(4, 7), -- Item 4 (Livro) -> Livros
(5, 3), -- Item 5 (Molho de Chaves) -> Chaves
(6, 2), -- Item 6 (Guarda-chuva) -> Acessórios
(7, 6), -- Item 7 (Casaco) -> Roupas
(8, 5), -- Item 8 (RG) -> Documentos
(9, 1), -- Item 9 (Kindle) -> Eletrônicos
(10, 2); -- Item 10 (Óculos de Grau) -> Acessórios