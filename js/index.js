var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  },
    liquid = selectAll('.liquid'),
    tubeShine = select('.tubeShine'),
    label = select('.label'),
    follower = select('.follower'),
    dragger = select('.dragger'),
    dragTip = select('.dragTip'),
    minDragY = -360,
    liquidId = 0,
    step = Math.abs(minDragY/120),
    snap = Math.abs(minDragY/10),
    followerVY = 0
var movement;
    function move(){
      var temperature = document.getElementById('temperature');
      if(temperature.value < 1){
         window.alert("Enter Temperature Please");
    } else if (temperature.value >= 1 && temperature.value<=120 && step == 360/120){
          liquidId = temperature.value;
          label.textContent = liquidId + '°';
              TweenMax.to(liquid, 2.0, {
              y:(-liquidId * step) * 1.12,
              ease:Elastic.easeOut.config(1,2)
        })
              TweenMax.to(dragger, 2.0, {
                y:(-liquidId * step) * 1.12,
                ease:Elastic.easeOut.config(1,2)
      })
    }if (temperature.value >= 1 && temperature.value<=248 && step == 360/248){
            liquidId = temperature.value;
            label.textContent = liquidId + '°';
            TweenMax.to(liquid, 2.0, {
                y:(-liquidId * step) * 1.12,
                ease:Elastic.easeOut.config(1,2)
          })
            TweenMax.to(dragger, 2.0, {
                y:(-liquidId * step) * 1.12,
                ease:Elastic.easeOut.config(1,2)
        })
        }
    }
    function changeT(){
      var temperature = document.getElementById('temperature');
      if(temperature.value < 1){
         window.alert("Enter Temperature Please");}else{
      if(step==360/120 && temperature.value<=248){
        step = 360 / 248;
        document.getElementById("Type").innerHTML = "F°";
        move();
      } else if(step ==360/248 && temperature.value<=120){
        step = 360 / 120;
        document.getElementById("Type").innerHTML = "C°";
        move();
      }
    }
}
TweenMax.set('svg', {
  visibility: 'visible'
})

TweenMax.set(dragTip, {
 transformOrigin:'20% 50%'
})

var tl = new TimelineMax()
tl.staggerTo(liquid, 4.7, {
 x:'-=200',
 ease:Linear.easeNone,
 repeat:-1
},0.9)

tl.time(100);

document.addEventListener("touchmove", function(event){
    event.preventDefault();
});
Draggable.create(dragger, {
 type:'y',
 bounds:{minY:minDragY, maxY:0},
 onDrag:onUpdate,
 throwProps:true,
 throwResistance:2300,
 onThrowUpdate:onUpdate,
 overshootTolerance:0,
 snap:function(value){
  //Use this to snap the values to steps of 10
  //return Math.round(value/snap) * snap
 }
})

function onUpdate(){
 liquidId = Math.abs(Math.round(dragger._gsTransform.y/step));
 label.textContent = liquidId + '°';
 TweenMax.to(liquid, 1.3, {
  y:dragger._gsTransform.y*1.12,
  ease:Elastic.easeOut.config(1,2)
 })

}

TweenMax.to(follower, 1, {
 y:'+=0',
 repeat:-1,
 modifiers:{
  y:function(y, count){
  followerVY += (dragger._gsTransform.y - follower._gsTransform.y) * 0.23;
   followerVY *= 0.69;
   return follower._gsTransform.y + followerVY;
  }
 }
})

TweenMax.to(dragTip, 1, {
 rotation:'+=0',
 repeat:-1,
 modifiers:{
  rotation:function(rotation, count){
   return rotation-followerVY
  }
 }
})

TweenMax.to(label, 1, {
 y:'+=0',
 repeat:-1,
 modifiers:{
  y:function(y, count){
   return y-followerVY * 0.5
  }
 }
})


TweenMax.to(dragger, 1.4, {
 y:minDragY/2,
 onUpdate:onUpdate,
 ease:Expo.easeInOut
})


//ScrubGSAPTimeline(tl);
