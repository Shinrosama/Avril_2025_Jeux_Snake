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
//on définit les dimencions de l'espace de jeux en blocs (une grille en blocs de 30 pixels)    
    let widthInBlocks = canvasWidth/blockSize;
    let heightInBlocks = canvasHeight/blockSize;
    let score;
    let timeOut;
//on appelle la fonction init
    init();
// on crée la fonction init qui définit l'état de base de la page
    function init(){
        //on crée le canvas dans le projet
        let canvas = document.createElement('canvas');
        // on lui attribut ses dimensions
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        //on crée la bordure de l'espace de jeux
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto"
        canvas.style.display = "block"
        canvas.style.backgroundColor = "#ddd"
        //on place le canvas dans le body de la page
        document.body.appendChild(canvas);
        //on donne un contexte au canvas
        ctx = canvas.getContext("2d");
        // on a defini le serpent de base qui a une taille de 3 blocs
        snakee = new snake([[6,4],[5,4],[4,4]], "right");
        applee = new apple([10, 10]);
        score = 0;
        refreshCanvas();
    
    }
// on définit la fonction qui met a jours la progression du jeux 
    function refreshCanvas(){
        //on fait avancer le serpent    
        snakee.advance();

        if(snakee.checkColision())
        {
            gameOver()
          
        }
        else
        {
            if(snakee.isEatingApple(applee)){
                score++;
                snakee.ateApple = true;
                do {
                   applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee)) 
            }
            ctx.clearRect(0,0,canvasWidth, canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            
            timeOut = setTimeout(refreshCanvas, delay);
        }

    }
    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        ctx.strokeText("Game Over", centerX, centerY - 180);
        ctx.fillText("Game Over", centerX, centerY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyez sur la touche espace pour rejouer", centerX, centerY - 120);
        ctx.fillText("Appuyez sur la touche espace pour rejouer", centerX, centerY - 120 );
        ctx.restore();
    }

    function restart(){ 
        snakee = new snake([[6,4],[5,4],[4,4]], "right");
        applee = new apple([10, 10]);
        score = 0;
        clearTimeout(timeOut)
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        //on donne du style a notre score
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        //on corige un décalage en placant le texte par rapport au millieu
        ctx.textBaseline = "middle"
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore();
    }
// on crée une fontion pris prend en compte le contexte et la position d'un bloc (corps du serpent)eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
    function drawBlock(ctx, position){
        //en pixels on prends la position (dans le tableau) qu'on multiplie par la taille du bloc
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        //on veu remplir un rectangle a la position x et y et a la hauteur et largeur d'un bloc
        ctx.fillRect(x, y, blockSize, blockSize);
    }
// on definit le comportement du corps du serpent, la couleur, le mouvement 
    function snake(body, direction){
        this.body = body;
        //on definit une nouvelle propriété de directions pour le serpent
        this.direction = direction;
        //on defini si il a mangé une pome
        this.ateApple = false;
        //on crée une methode pour dessiner le corps du serpent
        this.draw = function()
        {
            //on sauvegarde le contexte du canvas avant de continuer
            ctx.save();
            //on donne sa couleur au serpent
            ctx.fillStyle = "#1C1C1C";
            //pour dessiner le serpent on crée une boucle
            for(let i = 0; i < this.body.length; i++){
                //on crée une fonction qui crée un bloc
                drawBlock(ctx, this.body[i]);
            }
            //on restore le contexte
            ctx.restore();
        }
//on crée une fontion pour faire avancer le serpent
        this.advance = function(){
            //on définit la nouvelle position de la tête avec slice qui crée une copie de la tête   
            let nextPosition = this.body[0].slice();
            //on crée un switch qui va analiser notre direction
            switch(this.direction){
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

            if (!this.ateApple){
              // on retire le dernier ellémént du tableau ( pour conserver la taille du serpent)
                this.body.pop();   
            } else {
                this.ateApple = false;    
            }
        }
        //on crée une nouvelle méthode pour donner au serpent sa direction (toute direction n'est pas permise en fonction de la postion du serpent)
        this.setDirection = function(newDirection){
            //on crée une variable pour les directions permises
            let alloweDirections;
            //on crée un switch sur la direction actuelle, pour definir les directions permises
            switch(this.direction){
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
            if(alloweDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        }
        //on crée une fonction comme une methode pour verifier les colision
        this.checkColision = function(){
            //on détermine la colision avec les murs
            let wallColision = false;
            //on détermine la colision avec le corps du serpent
            let snakeColision = false;
            //on défini la tête du serpent
            let head = this.body[0];
            //on défini le corps du serpent
            let rest = this.body.slice(1);
            //on tétaille le x et le y de la tête
            let snakeX = head[0];
            let snakeY = head[1];
            // on détermine les coordonées minimales et maximales permises
            let minX = 0;
            let minY = 0;
            let maxX = widthInBlocks - 1;
            let maxY = heightInBlocks - 1;
            //on crée une variable pour verifier si la tête n'est pas dans l'espace de jeux
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            let isNotBetweenHorVerticalWalls = snakeY < minY || snakeY > maxY;
            // on détermine les conditions pour savoir si il y a colision
            if(isNotBetweenHorizontalWalls || isNotBetweenHorVerticalWalls){
                wallColision = true;
            }
            /*pour verifier les cilisions de la tête avec le corps, on verifie si les coordonnées 
            de la tête correspondent a celles d'un des éléments du reste du corp*/
            for(let i = 0; i < rest.length; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                {
                   snakeColision = true; 
                }
            }
            return wallColision || snakeColision;
        };
        // on verifi si le serpent est entrain de manger une pomme, on donne en argument les coordonées d'une pomme
        this.isEatingApple = function(appleToEat){
            //on definit la tete dont la position est egale au corps a la position 0
            let head = this.body[0];
            //on verifie que les coordonées x et y de la tête du serpent sent egales aux coordonées x et y de la pomme
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false; 
        }
    }

    //on veu créer la pomme
    function apple(position){
        this.position = position;
        this.draw = function(){
            //on sauvegarde la configuration actuelle du contexte
            ctx.save();
            //on donne la couleur a utiliser
            ctx.fillStyle = "#33cc33"
            //on definit la création de la pomme qui est un rond
            ctx.beginPath();
            //on lui donne son rayon qui est égale a la moitié d'un bloc (taille du bloc divisé par deux)
            let radius = blockSize/2;
            //pour définir la position d'un cercle on se base sur son centre d'ou la position du bloc plus le rayon
            let x = this.position[0]*blockSize + radius;
            let y = this.position[1]*blockSize + radius;
            //on utilise la fonction qui permet de dessiner un cercle 
            ctx.arc(x, y, radius, 0, Math.PI*2, true)
            //on rempli le cercle de la couleur choisie
            ctx.fill()
            // on restaure le contexte précédemment sauvé
            ctx.restore();
        }
        this.setNewPosition = function(){
            /*on utilise math.random pour obtenir un nombre aléatoire entre 0 et 1
            les valeurs du random n'étant pas forcement des nombre entier on utilise Math.round pour arondir
            on multiplie le résultat par le nombre de blocs -1
            */
            let newX = Math.round(Math.random() * (widthInBlocks - 1))
            let newY = Math.round(Math.random() * (heightInBlocks - 1))
            this.position = [newX, newY]
        }
        //on veut eviter que la pomme apparaisse sur le serpent
        this.isOnSnake = function(snakeToCheck){
            let isOnSnake = false;
            //on verifie si la pomme est sur un bloc du serpent
            for(let i = 0; i < snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    }
//on veu créer un évenement quand l'utilisateur appuie sur une touche de son clavier
    document.onkeydown = function handleKeyDown(e){
        //chaque touche appuyée a un code, ce code est donné par l'évenement (e)
        let key = e.keyCode;
        //ensuite on veu donner une direction au serpent en fonction de la touche appuyée
        let newDirection;
        switch(key){
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
            case 32:
                restart();
                return;
            //si aucune des situations précédentes ne se produit alors on reviens au début
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}