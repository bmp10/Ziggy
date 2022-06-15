let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let flappy = 250;
let flappysize = 50;
let vel = 3;

let pipewidth = 100;
let pipegap = 200;

let root2 = 2 ** 0.5

class Pipe {
    constructor(width, height, x, gap) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.gap = gap;
    }

    check() {
        //x check
        if (this.x <= 100 + flappysize && this.x + this.width >= 100) {
            //y check
            if (flappy + flappysize >= canvas.height - this.height || flappy <= canvas.height - (this.height + this.gap)) {
                return true
            }
        }
    }

    fix() {
        if (this.x < -this.width) {
            this.x = canvas.width;
            this.height = Math.random() * (canvas.height - 300) + 100;
        }
    }

    draw() {
        ctx.fillStyle = 'gray';

        ctx.beginPath();
        ctx.rect(this.x, 0, this.width, canvas.height - (this.height + this.gap));
        ctx.fill();

        ctx.beginPath();
        ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
        ctx.fill();
    }

    update() {
        this.x -= 10;

        this.fix();
        this.draw();
        return this.check();
    }

    dist2(pos) {
        let topclosest = [Math.min(this.x + this.width, Math.max(this.x, pos[0])), Math.min(canvas.height - (this.height + this.gap), Math.max(0, pos[1]))]
        let bottomclosest = [Math.min(this.x + this.width, Math.max(this.x, pos[0])), Math.min(canvas.height, Math.max(canvas.height - this.height, pos[1]))]

        let ret = Math.min((topclosest[0] - pos[0]) ** 2 + (topclosest[1] - pos[1]) ** 2, (bottomclosest[0] - pos[0]) ** 2 + (bottomclosest[1] - pos[1]) ** 2)

        return ret
    }
}

let pipe = new Pipe(100, 200, 1000, pipegap);

document.addEventListener("keydown", function(e) {
    vel *= -1
})

function ani() {
    let crash = false;

    flappy -= vel;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pipe.update()) {
        crash = true;
    }

    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.rect(0, canvas.height - 100, canvas.width, 100);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#EEAA00';
    ctx.rect(100, flappy, flappysize, flappysize);
    ctx.fill();



    let flappycenter = [100 + flappysize / 2, flappy + flappysize / 2]

    let updist = pipe.x <= flappycenter[0] && flappycenter[0] <= pipe.x + pipe.width ? flappycenter[1] - (canvas.height - pipe.height - pipe.gap) : undefined;
    let downdist = pipe.x <= flappycenter[0] && flappycenter[0] <= pipe.x + pipe.width ? canvas.height - flappycenter[1] - pipe.height : (canvas.height - 100) - flappycenter[1];
    let rightdist = canvas.height - pipe.height <= flappycenter[1] || flappycenter[1] <= canvas.height - (pipe.height + pipe.gap) ? pipe.x - 100 - flappysize / 2 : undefined;
    let urdist = 0;
    let drdist = 0;

    for (i = 0; i < 10; i++) {
        urdist += pipe.dist2([flappycenter[0] + urdist, flappycenter[1] - urdist]) ** 0.5 / root2;
        
        drdist += Math.min(pipe.dist2([flappycenter[0] + drdist, flappycenter[1] + drdist]) ** 0.5, canvas.height - 100 - (flappycenter[1] + drdist)) / root2;
    }
    
    ctx.beginPath();
    ctx.moveTo(flappycenter[0], flappycenter[1]);
    ctx.lineTo(flappycenter[0], flappycenter[1] - updist);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(flappycenter[0], flappycenter[1]);
    ctx.lineTo(flappycenter[0], flappycenter[1] + downdist);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(flappycenter[0], flappycenter[1]);
    ctx.lineTo(flappycenter[0] + rightdist, flappycenter[1]);
    ctx.stroke();

    ctx.lineWidth = 10;

    ctx.beginPath();
    ctx.moveTo(flappycenter[0], flappycenter[1]);
    ctx.lineTo(flappycenter[0] + urdist, flappycenter[1] - urdist);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(flappycenter[0], flappycenter[1]);
    ctx.lineTo(flappycenter[0] + drdist, flappycenter[1] + drdist);
    ctx.stroke();


    if (flappy > canvas.height - 100 - flappysize || crash) return

    requestAnimationFrame(ani);
}

ani()
