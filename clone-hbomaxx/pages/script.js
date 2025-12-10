// Função para mostrar a tela de cadastro
function mostrarCadastro() {
    document.getElementById('cadastro').style.display = 'block';
    document.getElementById('login').style.display = 'none';
}

// Função para mostrar a tela de login
function mostrarLogin() {
    document.getElementById('cadastro').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

// Função para cadastrar o usuário
document.getElementById('formCadastro').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value.toLowerCase();
    const senha = document.getElementById('senha').value;
    const endereco = document.getElementById('endereco').value;
    const telefone = document.getElementById('telefone').value;

    const usuario = {
        nome: nome,
        email: email,
        senha: senha,
        endereco: endereco,
        telefone: telefone
    };

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuarios.some(u => u.email === email)) {
        alert('Já existe um usuário com esse email.');
        return;
    }

    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Cadastro realizado com sucesso!');
    mostrarLogin();
});

// Função para realizar o login
document.getElementById('formLogin').addEventListener('submit', function(event) {
    event.preventDefault();

    const emailLogin = document.getElementById('emailLogin').value.toLowerCase();
    const senhaLogin = document.getElementById('senhaLogin').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuario = usuarios.find(u => u.email === emailLogin && u.senha === senhaLogin);

    if (usuario) {
        const avatar = document.getElementById('avatar');
        const nomeUsuario = document.getElementById('nomeUsuario');

        avatar.textContent = usuario.nome.charAt(0).toUpperCase();
        nomeUsuario.textContent = usuario.nome;

        document.getElementById('usuarioLogado').style.display = 'flex';
        alert('Login realizado com sucesso!');
        
        iniciarJogo();
    } else {
        alert('Email ou senha incorretos!');
    }
    
    function mostrarCadastro() {
        document.getElementById('login').style.display = 'none';
        document.getElementById('cadastro').style.display = 'block';
    }
    
    function mostrarLogin() {
        document.getElementById('cadastro').style.display = 'none';
        document.getElementById('login').style.display = 'block';
    }
    
});

// Função para iniciar o jogo da cobrinha
function iniciarJogo() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('restartButton').style.display = 'none'; // Esconde o botão de restart inicialmente
    document.getElementById('countdown').style.display = 'block';

    let countdown = 3;
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = countdown;

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownElement.style.display = 'none'; // Oculta a contagem regressiva
            startGame();
        }
    }, 1000);
}

// Função para iniciar o jogo (lógica principal do jogo da cobrinha)
function startGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const box = 20;
    let snake = [{ x: 10 * box, y: 10 * box }];
    let food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    let direction = 'right';
    let score = 0;
    let gameSpeed = 120;

    function draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i === 0 ? 'green' : 'green';
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, box, box);

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 10, canvas.height - 10);

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (direction === 'left') snakeX -= box;
        if (direction === 'up') snakeY -= box;
        if (direction === 'right') snakeX += box;
        if (direction === 'down') snakeY += box;

        if (snakeX === food.x && snakeY === food.y) {
            food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
            score++;
        } else {
            snake.pop();
        }

        let newHead = { x: snakeX, y: snakeY };
        snake.unshift(newHead);

        if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(snake)) {
            clearInterval(gameInterval);
            alert('Game Over! Score: ' + score);
            document.getElementById('restartButton').style.display = 'block'; // Exibe o botão de restart
        }
    }

    function collision(snake) {
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                return true;
            }
        }
        return false;
    }

    function update() {
        draw();
    }

    function control(e) {
        // Teclas de seta
        if (e.keyCode === 37 && direction !== 'right') direction = 'left';  // seta esquerda
        if (e.keyCode === 38 && direction !== 'down') direction = 'up';    // seta cima
        if (e.keyCode === 39 && direction !== 'left') direction = 'right'; // seta direita
        if (e.keyCode === 40 && direction !== 'up') direction = 'down';    // seta baixo
    
        // Teclas W, A, S, D
        if (e.keyCode === 65 && direction !== 'right') direction = 'left';  // tecla A
        if (e.keyCode === 87 && direction !== 'down') direction = 'up';    // tecla W
        if (e.keyCode === 83 && direction !== 'up') direction = 'down';    // tecla S
        if (e.keyCode === 68 && direction !== 'left') direction = 'right'; // tecla D
    }
    
    document.addEventListener('keydown', control);

    const gameInterval = setInterval(update, gameSpeed);
}

// Função para reiniciar o jogo
function restartGame() {
    document.getElementById('restartButton').style.display = 'none';
    startGame();
}
