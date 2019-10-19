
const times = [];
let fps;

function refreshLoop() {
  const now = performance.now();
  while (times.length > 0 && times[0] <= now - 1000) {
    times.shift();
  }
  times.push(now);
  fps = times.length;
}

var counter = 0;
var init = Date.now();

var render = (object) => {
  object.elem.style.top = object.top + 'px';
  object.elem.style.left = object.left  + 'px';
}

var createElement = () => {
  var div = document.createElement("div");
  div.classList = ['login-box']
  return {
    elem: div,
    top: Math.round(Math.random() * (window.innerHeight -4)) ,
    left: Math.round(Math.random() * (window.innerWidth -4)) ,
    width: 4,
    height: 4,
    direction: [Math.random() < 0.5 ? -1 : 1, Math.random() < 0.5 ? -1 : 1]
  };
}

hasCollision = (rect1, rect2) => {
  if (rect1 === rect2) {
    return false;
  }
  if (rect1.left < rect2.left + rect2.width &&
    rect1.left + rect1.width > rect2.left &&
    rect1.top < rect2.top + rect2.height &&
    rect1.top + rect1.height > rect2.top) {
    return true;
  }
  return false;
}

var move = (object, elements) => {
  if ((object.left + object.width + 1) > window.innerWidth) {
    object.direction[0] = -1
  }
  if ((object.top + object.height + 1)  > window.innerHeight) {
    object.direction[1] = -1
  }
  if ((object.left - 1) < 0) {
    object.direction[0] = 1
  }
  if ((object.top - 1)  < 0) {
    object.direction[1] = 1
  }
  object.left += object.direction[0]
  object.top += object.direction[1]
  
  collisions = elements.filter(function (el) {
    return hasCollision(object, el)
  });
  if (collisions.length > 0) {
    object.left -= object.direction[0]
    object.top -= object.direction[1]
    object.direction[0] *= -1
    object.direction[1] *= -1
    collisions[0].direction[0] *= -1
    collisions[0].direction[1] *= -1
  }
}


window.onload = function(){
  var elements = [];
  for (i = 0; i< 1000; i++) {
    do {
      elements[i] = createElement();
      collisions = elements.filter(function (el) {
        return hasCollision(elements[i], el)
      });
      console.log("CRAP")
    } while (collisions.length > 0)
  }

  elements.forEach((e) => {
    document.body.appendChild(e.elem);
    render(e);
  })

  var start = null;
  var element = document.getElementById('login-box');

  var step = (timestamp) => {
    elements.forEach((e) => {
      move(e, elements);
      render(e);
    })
    if (!start) start = timestamp;
    document.getElementById('login-box').innerHTML = '' + fps + '<br>' + (Date.now() - init);
    counter++
    refreshLoop();
    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
}


