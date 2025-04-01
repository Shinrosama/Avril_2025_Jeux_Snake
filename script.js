window.onload = function()
{

    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let ctx;
    let delay = 100;
    let xCoord = 0;
    let yCoord = 0;

    init();

    function init()
    {
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        refreshCanvas();
    
    }

    function refreshCanvas()
    {
        xCoord += 5;
        yCoord += 5;
        ctx.clearRect(0,0,canvasWidth, canvasHeight);
        ctx.fillStyle = "#1C1C1C";
        ctx.fillRect(xCoord ,yCoord ,100 , 50);
        setTimeout(refreshCanvas, delay);
    }
}