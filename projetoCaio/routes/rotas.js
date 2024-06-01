const express = require('express');
const fs = require('fs').promises;
const router = express.Router();

async function lerJSON(caminho) {
    const data = await fs.readFile(caminho, 'utf8');
    return JSON.parse(data);
}

async function escreverJSON(caminho, conteudo) {
    const data = JSON.stringify(conteudo, null, 2);
    await fs.writeFile(caminho, data, 'utf8');
}

async function obterLivros() {
    return await lerJSON('./database/livros.json');
}

async function gravarLivros(livros) {
    await escreverJSON('./database/livros.json', livros);
}

router.get('/', async (req, res) => {
    try {
        const livros = await obterLivros();
        res.json(livros.livros);
    } catch (erro) {
        res.status(500).send('Erro ao obter a lista de livros');
    }
});

router.get('/:titulo', async (req, res) => {
    const { titulo } = req.params;
    try {
        const livros = await obterLivros();
        const livro = livros.livros.find(l => l.titulo.toLowerCase() === titulo.toLowerCase());

        if (livro) {
            res.json(livro);
        } else {
            res.status(404).json({ message: 'Livro não encontrado' });
        }
    } catch (erro) {
        res.status(500).send('Erro ao buscar o livro');
    }
});

router.post('/comprar', async (req, res) => {
    const { titulo } = req.body;
    try {
        const livros = await obterLivros();
        const livro = livros.livros.find(l => l.titulo === titulo);

        if (livro && livro.estoque > 0) {
            livro.estoque -= 1;
            await gravarLivros(livros);
            res.status(200).send('Livro comprado!');
        } else {
            res.status(400).send('Livro fora de estoque no momento!');
        }
    } catch (erro) {
        res.status(500).send('Erro ao comprar o livro');
    }
});

router.post('/adicionar', async (req, res) => {
    const { titulo, autor, genero, estoque, imagem } = req.body;
    try {
        const livros = await obterLivros();
        const novoLivro = { titulo, autor, genero, estoque, imagem };

        livros.livros.push(novoLivro);
        await gravarLivros(livros);
        res.status(201).send('Livro adicionado com sucesso');
    } catch (erro) {
        res.status(500).send('Erro ao adicionar o livro');
    }
});

module.exports = router;
