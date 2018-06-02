//Dropdown NAV
const nav_btn = document.querySelector('.menu-btn');
const dropdown_link = document.querySelector('.dropped');

nav_btn.addEventListener('click', slideMenu);

function slideMenu() {
  const menu = this.parentNode.querySelector('#main-ul');
  menu.classList.toggle('slide');
}

// function showContent() {
// const content = this.parentNode.querySelector('.dropdown-content');
//   content.classList.toggle('show');
// }
// END DROPDOWN NAV

//BEGIN TITLE
(function() {

    let width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');


        // create points
        points = [];
        for(let x = 0; x < width; x = x + width/20) {
            for(let y = 0; y < height; y = y + height/20) {
                let px = x + Math.random()*width/20;
                let py = y + Math.random()*height/20;
                let p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(let i = 0; i < points.length; i++) {
            let closest = [];
            let p1 = points[i];
            for(let j = 0; j < points.length; j++) {
                let p2 = points[j]
                if(!(p1 == p2)) {
                    let placed = false;
                    for(let k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(let k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(let i in points) {
            let c = new Circle(points[i], 2+Math.random()*2, 'rgba(10,10,10,0.1)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
        largeHeader.style.height = height+'px';
        target = {x: width/2, y: height/2};
    }

    function mouseMove(e) {
        let posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        initHeader()
    }

    // animation
    function initAnimation() {
        animate();
        for(let i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(let i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circle.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return
        for(let i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(10,10,10, 0.1)';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        let _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(10,10,10, 0.1)';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

})();
//END TITLE CARD

//TITLE CARD TEXT TRANSITION START
class TextScramble {
  constructor(el){
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText){
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length,newText.length);
    const promise = new Promise((resolve)=>this.resolve = resolve);

    this.queue = [];
    for(let i = 0;i<length;i++){
      const from = oldText[i] || '';
      const to  = newText[i] || '';
      const start = Math.floor(Math.random()*150);
      const end = Math.floor(Math.random()*150) + start;
      this.queue.push({from,to,start,end});
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update(){
    let output = '';
    let complete = 0;
    for(let i=0,n=this.queue.length;i<n;i++){
      let {from,to,start,end,char} = this.queue[i];

      if(this.frame >= end){
        complete++;
        output += to;
      }else if(this.frame >= start){
        if(!char || Math.random() < 0.28){char = this.randomChar();this.queue[i].char = char;}
        output += `<span class='dud'>${char}</span>`;
      }else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if(complete === this.queue.length){this.resolve();}else{
      this.frameRequest = requestAnimationFrame(this.update);this.frame++;}
  }

  randomChar(){
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

const phrases = [
  'Developer',
  'Creative',
  'Inquisitive',
]

const el = document.querySelector('.thin');
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(()=>{
    setTimeout(next,1600)
  })
  counter = (counter+1) % phrases.length
}

next()

//Scroll on triangle click
$("#scroll").click(function() {
    $('html,body').animate({
        scrollTop: $(".about").offset().top -60},
        'slow');
});
