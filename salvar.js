const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const caminhoArquivo = path.join(__dirname, 'respostas.json');

// Cria o arquivo se não existir
if (!fs.existsSync(caminhoArquivo)) {
  fs.writeFileSync(caminhoArquivo, '[]');
}

// ROTA POST - Salvar nova resposta
app.post('/api/respostas', (req, res) => {
  const novaResposta = {
    ...req.body,
    recebidoEm: new Date().toISOString()
  };

  let respostasAtuais = [];
  try {
    const conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
    respostasAtuais = JSON.parse(conteudo);
  } catch (erro) {
    console.warn('Erro ao ler o arquivo:', erro);
  }

  respostasAtuais.push(novaResposta);
  fs.writeFileSync(caminhoArquivo, JSON.stringify(respostasAtuais, null, 2));

  console.log('✅ Resposta salva:', novaResposta);
  res.status(200).json({ status: 'ok', mensagem: 'Resposta registrada com sucesso!' });
});

// ROTA GET - Retornar todas as respostas
app.get('/api/respostas', (req, res) => {
  try {
    const conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
    const respostas = JSON.parse(conteudo);
    res.json(respostas);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao ler o banco de dados' });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
