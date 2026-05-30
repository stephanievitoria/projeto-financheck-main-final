CREATE TABLE IF NOT EXISTS tb_perfil_financeiro (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    usuario_id BIGINT NOT NULL
);

ALTER TABLE tb_usuario
    ADD COLUMN IF NOT EXISTS controle_familiar BOOLEAN DEFAULT FALSE;

UPDATE tb_usuario
SET controle_familiar = FALSE
WHERE controle_familiar IS NULL;

ALTER TABLE tb_usuario
    ALTER COLUMN controle_familiar SET DEFAULT FALSE;

INSERT INTO tb_perfil_financeiro (nome, tipo, usuario_id)
SELECT u.nome, 'RESPONSAVEL', u.id
FROM tb_usuario u
WHERE NOT EXISTS (
    SELECT 1
    FROM tb_perfil_financeiro p
    WHERE p.usuario_id = u.id
      AND p.tipo = 'RESPONSAVEL'
);

ALTER TABLE tb_transacao
    ADD COLUMN IF NOT EXISTS perfil_id BIGINT;

UPDATE tb_transacao t
SET perfil_id = p.id
FROM tb_perfil_financeiro p
WHERE t.perfil_id IS NULL
  AND p.usuario_id = t.usuario_id
  AND p.tipo = 'RESPONSAVEL';

ALTER TABLE tb_meta
    ADD COLUMN IF NOT EXISTS perfil_id BIGINT;

UPDATE tb_meta m
SET perfil_id = p.id
FROM tb_perfil_financeiro p
WHERE m.perfil_id IS NULL
  AND p.usuario_id = m.usuario_id
  AND p.tipo = 'RESPONSAVEL';

ALTER TABLE tb_transacao
    ALTER COLUMN perfil_id SET NOT NULL;

ALTER TABLE tb_meta
    ALTER COLUMN perfil_id SET NOT NULL;
