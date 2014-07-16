

Vector2 = function(x, y) { this.x = x; this.y = y; };

Vector2.prototype = {
    copy : function() { return new Vector2(this.x, this.y); },
    length : function() { return Math.sqrt(this.x * this.x + this.y * this.y); },
    sqrLength : function() { return this.x * this.x + this.y * this.y; },
    normalize : function() { var inv = 1/this.length(); return new Vector2(this.x * inv, this.y * inv); },
    negate : function() { return new Vector2(-this.x, -this.y); },
    add : function(v) { return new Vector2(this.x + v.x, this.y + v.y); },
    subtract : function(v) { return new Vector2(this.x - v.x, this.y - v.y); },
    multiply : function(f) { return new Vector2(this.x * f, this.y * f); },
    divide : function(f) { var invf = 1/f; return new Vector2(this.x * invf, this.y * invf); },
    dot : function(v) { return this.x * v.x + this.y * v.y; }
};

Vector2.zero = new Vector2(0, 0);

Particle = function(position, velocity, life, color, size) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = Vector2.zero;
    this.age = 0;
    this.life = life;
    this.color = color;
    this.size = size;
};

function ParticleSystem() {
    // Private fields
    var that = this;
    var particles = new Array();

    // Public fields
    // this.gravity = new Vector2(0, 2000);
    //this.effectors = new Array();

    // Public methods

    this.emit = function(particle) {
        particles.push(particle);
    };

    // ...
    this.simulate = function(dt) {
        aging(dt);
        applyGravity();
        //applyEffectors();
        
        kinematics(dt);
    };

    // ...

    // Private methods

    function aging(dt) {
        for (var i = 0; i < particles.length; ) {
            var p = particles[i];
            p.age += dt;
            if (p.age >= p.life)
                kill(i);
            else
                i++;
        }
    }

    function kill(index) {
        if (particles.length > 1)
            particles[index] = particles[particles.length - 1];
        particles.pop();
    }
    // ...
    function applyGravity() {
        for (var i in particles)
            particles[i].acceleration = that.gravity;
    }

    function applyBound() {
        for (var i in particles)
            ChamberBox(0, 0, 640, 960, particles[i]);
    }

    function kinematics(dt) {
        for (var i in particles) {
            var p = particles[i];
            p.position = p.position.add(p.velocity.multiply(dt));
            p.velocity = p.velocity.add(p.acceleration.multiply(dt));
        }
    }
    // ...
    this.render = function(ctx) {
        // this.gravity = new Vector2(0, 800);
        applyBound();
        for (var i in particles) {
            var p = particles[i];
            var alpha = 1 - p.age / p.life;
            ctx.fillStyle = "rgba("
                + Math.floor(p.color.r * 255) + ","
                + Math.floor(p.color.g * 255) + ","
                + Math.floor(p.color.b * 255) + ","
                + alpha.toFixed(2) + ")";
ctx.beginPath();
ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2, true);
ctx.closePath();
ctx.fill();
}
}
    this.renderStar = function(ctx, star){
        // this.gravity = new Vector2(0, 4000);
        for (var i in particles) {
            var p = particles[i];
            var alpha = 1 - p.age / p.life;
            ctx.drawImage(star, p.position.x, p.position.y);
}
    }
}

function ChamberBox(x1, y1, x2, y2, particle) {
    var t = function(particle) {
        if (particle.position.x - particle.size < x1 || particle.position.x + particle.size > x2)
            particle.velocity.x = -particle.velocity.x;
 
        if (particle.position.y - particle.size < y1 || particle.position.y + particle.size > y2)
            particle.velocity.y = -particle.velocity.y;
    };
    t(particle);
}

var ps = new ParticleSystem();// 最重要是多了这语句
var dt = 0.01;

function sampleDirection(angle1, angle2) {
    var t = Math.random();
    var theta = angle1 * t + angle2 * (1 - t);
    return new Vector2(Math.cos(theta), Math.sin(theta));
}

function randomDirection() {
    var theta = Math.random() * 2 * Math.PI;
    return new Vector2(Math.cos(theta), Math.sin(theta));
}

function sampleColor(color1, color2) {
    var t = Math.random();
    var m = {
        'r':color1[0] * t + color2[0] * (1-t),
        'g':color1[1] * t + color2[1] * (1-t),
        'b':color1[2] * t + color2[2] * (1-t),
    };
    return m;
}



// function step() {
//     ps.emit(new Particle(new Vector2(200, 200), sampleDirection().multiply(500), 1, {'r':255,'g':0,'b':0}, 5));
//     ps.simulate(dt);

//     ctx.clearRect(0, 0, 640, 640);
//     ps.render(ctx);
// }

// var setParticles = function(){
//     var c=document.getElementById("particleCanvas");
// var ctx=c.getContext("2d");
//     var counter = 0;
//     setTimeout(function(){
//         if (counter < 150){
//             if (counter % 20 === 0 && counter < 100){
//                 for (var i = 0; i < 20; i++){
//                     ps.emit(new Particle(new Vector2(200, 200), sampleDirection().multiply(500), 1, setHSVToRGB(Math.random()*360,100,100), 5));
//                 }
//             }
//             counter ++;
//             ps.simulate(dt);
//             ctx.clearRect(0, 0, 640, 640);
//             ps.render(ctx);
//             setTimeout(arguments.callee, 30);
//         }  
//         else{
//             clearRect(0, 0, 640, 640);
//         }
//     }, 30);
// }
// setParticles();
// setInterval(function(){
//     for (var i = 0; i < 5; i++){
//         step();
//     }    
// }, 30);

