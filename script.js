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
//on crée la variable du serpent
    let snakee;
//on crée la variable de la pomme 
    let applee;
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
        snakee = new snake([[6,4],[5,4],[4,4]], "right");
        applee = new apple([10, 10]);
        refreshCanvas();
    
    }
// on définit la fonction qui met a jours la progression du jeux 
    function refreshCanvas()
    {
    
        ctx.clearRect(0,0,canvasWidth, canvasHeight);
        snakee.advance();    
        snakee.draw();
        applee.draw();
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
    function snake(body, direction)
    {
        this.body = body;
        //on definit une nouvelle propriété de directions pour le serpent
        this.direction = direction;

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
            //on crée un switch qui va analiser notre direction
            switch(this.direction)
            {
                //on defini les directions posibles sur l'axe des x ([0])   
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                //on defini les directions posibles sur l'axe des x ([1])                     
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("invalid direction");

                

            }
            //on rajoute au debut du corps du serpent la nouvelle position (le serpent est plus long d'un élément)
            this.body.unshift(nextPosition);
            // on retire le dernier ellémént du tableau ( pour conserver la taille du serpent)
            this.body.pop();
        }
        //on crée une nouvelle méthode pour donner au serpent sa direction (toute direction n'est pas permise en fonction de la postion du serpent)
        this.setDirection = function(newDirection)
        {
            //on crée une variable pour les directions permises
            let alloweDirections;
            //on crée un switch sur la direction actuelle, pour definir les directions permises
            switch(this.direction)
            {
                case "left":
                case "right":
                    alloweDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    alloweDirections = ["left", "right"];
                    break;
                //si aucune de ces situations ne se produit alors on renvoi le message suivant    
                default:
                    throw("invalid direction");
            }
            //on veux permettre le changement de direction si celle ci est permise
            //le idex of se base sur l'index des tableau de direction 
            if(alloweDirections.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
        }
    }

    //on veu créer la pomme
    function apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            //on sauvegarde la configuration actuelle du contexte
            ctx.save();
            //on donne la couleur a utiliser
            ctx.fillStyle = "#33cc33"
            //on definit la création de la pomme qui est un rond
            ctx.beginPath();
            //on lui donne son rayon qui est égale a la moitié d'un bloc (taille du bloc divisé par deux)
            let radius = blockSize/2;
            //pour définir la position d'un cercle on se base sur son centre d'ou la position du bloc plus le rayon
            let x = position[0]*blockSize + radius;
            let y = position[1]*blockSize + radius;
            //on utilise la fonction qui permet de dessiner un cercle 
            ctx.arc(x, y, radius, 0, Math.PI*2, true)
            //on rempli le cercle de la couleur choisie
            ctx.fill()
            // on restaure le contexte précédemment sauvé
            ctx.restore();
        }
    }
//on veu créer un évenement quand l'utilisateur appuie sur une touche de son clavier
    document.onkeydown = function handleKeyDown(e)
    {
        //chaque touche appuyée a un code, ce code est donné par l'évenement (e)
        let key = e.keyCode;
        //ensuite on veu donner une direction au serpent en fonction de la touche appuyée
        let newDirection;
        switch(key)
        {
            // le chiffre est le code de la direction
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            //si aucune des situations précédentes ne se produit alors on reviens au début
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}