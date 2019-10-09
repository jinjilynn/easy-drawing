class Img {
    constructor(context, x, y, img, mouseClick, mouseOver) {
        let { src = '', width = 50, height = 50, offsetX = 0.5, offsetY = 0.5 } = img;
        this.x = x;
        this.y = y;
        this.context = context;
        this.src = src;
        if(typeof width === 'string' && width.indexOf('%') !== -1){
            width = (parseFloat(width) / 100) * context.canvas.width;
        }
        this.width = width;
        if(typeof height === 'string' && height.indexOf('%') !== -1){
            height = (parseFloat(height) / 100) * context.canvas.height;
        }
        this.height = height;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.click = mouseClick;
        this.over = mouseOver;
        this.reover = 0;
        this.GENAME = 'img'
    }
    createPath() {
        this.context.beginPath();
        this.context.rect(this.x - this.offsetX * this.width, this.y - this.height * this.offsetY, this.width, this.height)
    }
    async render() {
        this.image = new Image(this.width, this.height);
        this.image.src = this.src;
        await new Promise(resolve => {
            this.image.onload = () => {
                this.context.drawImage(this.image, this.x - this.offsetX * this.width, this.y - this.height * this.offsetY, this.width, this.height);
                resolve();
            }
        })
    }


}

export default Img;