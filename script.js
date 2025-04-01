window.onload = function()
{
// on définit la largeur et la hauteur de l'espace de jeux (canvas) en pixels
    let canvasWidth = 900;
    let canvasHeight = 600;
// on définit la taille de base d'une partie du serpent    
    let blockSize = 30;
    let ctx;
// on définit le délai entre chaque déplacement du serpent en milisecondes    
    let delay = 100;
    let snakee;
//on appelle la fonction init
    init();
// on crée la fonction init qui définit l'état de base de la page
    function init()
    {
        //on crée le canvas dans le projet
        let canvas = document.createElement('canvas');
        // on lui attribut ses dimensions
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        //on crée la bordure de l'espace de jeux
        canvas.style.border = "1px solid";
        //on place le canvas dans le body de la page
        document.body.appendChild(canvas);
        //on donne un contexte au canvas
        ctx = canvas.getContext("2d");
        // on a defini le serpent de base qui a une taille de 3 blocs
        snakee = new snake([[6,4],[5,4],[4,4]]);
        refreshCanvas();
    
    }
// on définit la fonction qui met a jours la progression du jeux 
    function refreshCanvas()
    {
    
        ctx.clearRect(0,0,canvasWidth, canvasHeight);
        snakee.advance();    
        snakee.draw();
        setTimeout(refreshCanvas, delay);
    }

// on crée une fontion pris prend en compte le contexte et la position d'un bloc (corps du serpent)
    function drawBlock(ctx, position)
    {
        //en pixels on prends la position (dans le tableau) qu'on multiplie par la taille du bloc
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        //on veu remplir un rectangle a la position x et y et a la hauteur et largeur d'un bloc
        ctx.fillRect(x, y, blockSize, blockSize);
    }
// on definit le comportement du corps du serpent, la couleur, le mouvement 
    function snake(body)
    {
        this.body = body;
        //on crée une methode pour dessiner le corps du serpent
        this.draw = function()
        {
            //on sauvegarde le contexte du canvas avant de continuer
            ctx.save();
            //on donne sa couleur au serpent
            ctx.fillStyle = "#1C1C1C";
            //pour dessiner le serpent on crée une boucle
            for(let i = 0; i < this.body.length; i++)
            {
                //on crée une fonction qui crée un bloc
                drawBlock(ctx, this.body[i]);
            }
            //on restore le contexte
            ctx.restore();
        }
//on crée une fontion pour faire avancer le serpent
        this.advance = function()
        {
            //on définit la nouvelle position de la tête avec slice qui crée une copie de la tête   
            let nextPosition = this.body[0].slice();
            //on fait ensuite avancer de 1 l'éllément sur l'axe des x
            nextPosition[0] += 1;
            //on rajoute au debut du corps du serpent la nouvelle position (le serpent est plus long d'un élément)
            this.body.unshift(nextPosition);
            // on retire le dernier ellémént du tableau ( pour conserver la taille du serpent)
            this.body.pop();
        }
    }
}