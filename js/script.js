class Memorama {
    constructor() {
        this.totalTarjetas = [];
        this.numeroTarjetas = 0;
        this.verificador = [];
        this.errores = 0;
        this.dificultad = '';
        this.imagenesCorrectas = [];
        this.agregador = [];
        this.intentos = 0;

        // Selecotres de HTML
        this.$contenedorGeneral = document.querySelector('.contenedor-general');
        this.$contenedorTarjetas = document.querySelector('.contenedor-tarjetas');
        this.$bloqueo = document.querySelector('.pantalla-bloqueada');
        this.$mensaje = document.querySelector('h2.mensaje');
        this.$errorContenedor = document.createElement('div');
        this.$nivelDificultad = document.createElement('div');
        this.$divDificultad = document.querySelector('.dificultad');
        this.$erroresDiv = document.querySelector('.errores');

        //llamado a los eventos
        this.eventListener();
    }

    eventListener(){
        window.addEventListener('DOMContentLoaded', () => {
            this.selectDificultad();
            this.cargaTarjetas();
            window.addEventListener('contextmenu', e => {
                e.preventDefault();
            }, false);
        })
    }

    selectDificultad() {
        const mensaje = prompt('Selecciona el nivel de dificultad: fácil, intermedio o difícil. Si no se selecciona un nivel, por default ser{a intermedio.');
        
        if(!mensaje){
            this.intentos = 5;
            this.dificultad = 'Intermedio';
        } else {
            if(mensaje.toLowerCase() === 'facil' || mensaje.toLowerCase() === 'fácil'){
                this.intentos = 7;
                this.dificultad = 'Fácil';
            } else if (mensaje.toLowerCase() === 'intermedio') {
                this.intentos = 5;
                this.dificultad = 'Intermedio';
            } else if (mensaje.toLowerCase() === 'dificil' || mensaje.toLowerCase() === 'difícil') {
                this.intentos = 3;
                this.dificultad = 'Difícil';
            } else {
                this.intentos = 5;
                this.dificultad = 'Intermedio';
            }
        }

        this.contenedorError();
        this.mensajeIntentos();
    }

    async cargaTarjetas(){
        const resp = await fetch('../memo.json');
        const data = await resp.json();
        this.totalTarjetas = data;
        if (this.totalTarjetas.length > 0){
            this.totalTarjetas.sort(orden);
            function orden(a, b){
                return Math.random() - 0.5;
            }
        }

        this.numeroTarjetas = this.totalTarjetas.length;
        
        let html = '';
        this.totalTarjetas.forEach(card => {
            html += `<div class="tarjeta">
                        <img class="tarjeta-img" src=${card.src} alt="imagenes memorama">            
                    </div>`
        })

        this.$contenedorTarjetas.innerHTML = html;
        this.startGame();
    }

    startGame() {
        const tarjetas = document.querySelectorAll('.tarjeta');
        tarjetas.forEach(tarjeta => {
            tarjeta.addEventListener('click', e => {

                if(!e.target.classList.contains('acertada') && !e.target.classList.contains('tarjeta-img')){
                    this.clickCard(e);
                }
            });
        })
    }

    clickCard(e) {

        this.girarTarjeta(e)
        //saber solo el src de la tarjeta seleccionada
        let srcImg = e.target.childNodes[1].attributes[1].value;
        let f = this.verificador.push(srcImg);

        //todo el div de la tarjeta seleccionada
        let tarjeta = e.target;
        this.agregador.unshift(tarjeta);
        this.comparador();
    }

    girarTarjeta(e) {
        e.target.style.backgroundImage = 'none';
        e.target.style.backgroundColor = 'white';
        e.target.childNodes[1].style.display = 'block';
    }

    reverseCard(arrReverse){
        arrReverse.forEach(tarjeta => {
            setTimeout(() => {
                tarjeta.style.backgroundImage = 'url(../img/cover.jpg)';
                tarjeta.childNodes[1].style.display = 'none';
            }, 1000);
        })

    }

    fijarTarjeta(arrCard){
        arrCard.forEach(tarjeta => {
            tarjeta.classList.add('acertada');
            this.imagenesCorrectas.push(tarjeta);
            this.winner();
        })

    }

    comparador() {
        if(this.verificador.length == 2){
            if(this.verificador[0] === this.verificador[1]){
                this.fijarTarjeta(this.agregador);
            } else {
                this.reverseCard(this.agregador);
                this.errores++;
                this.incrementadorError();
                this.lose();
            }
            this.verificador.splice(0);
            this.agregador.splice(0);
        }
    }

    winner(){
        if(this.imagenesCorrectas.length === this.numeroTarjetas){
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Has encontrado todos los pares! 👏🏻',
                showConfirmButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                } 
            })
        }
    }

    lose() {
        if(this.errores === this.intentos) {
            setTimeout(() => {
                Swal.fire({
                    icon: 'error',
                    title: '¡Has perdido el juego! 😪',
                  })
            }, 1000)
            setTimeout(() => {
                location.reload();
            }, 4000)
        }
    }

    incrementadorError() {
        this.$erroresDiv.innerText = `Errores: ${this.errores}`
    }

    contenedorError() {
        this.$errorContenedor.classList.add('error');
        this.incrementadorError();
        this.$contenedorGeneral.appendChild(this.$errorContenedor);
    }

    mensajeIntentos() {
        this.$nivelDificultad.classList.add('nivel-dificultad');
        this.$divDificultad.innerText = `Dificultad: ${this.dificultad}`;
        this.$contenedorGeneral.appendChild(this.$nivelDificultad);
    }
}

new Memorama();