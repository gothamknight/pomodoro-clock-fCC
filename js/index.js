let wDuration=parseInt($('#workTime').text()),
    bDuration=parseInt($('#breakTime').text()),
    min,
    sec,
    x=null,
    isRunning = false,
    isPaused = false,
    session=true;//true=work or false=break;
    
window.onload = function(){
  
  $('#clock').hover(clockHover);
  $('#clock').on('click', function(){
    if ($('#pausePlay').attr('class').search('ion-ios-play-outline') !==-1){
      playClick();
    }
    else{
      pauseClick();
    }
  });
  $('.increase').on('click', increase);
  $('.decrease').on('click', decrease);
  $('#filler span').on('click',function(e){
    location.reload(true);
  });
  
}//window onload

function clockHover(){
  if ($('#timer').css('display') !== 'none'){
    $('#timer').css('display', 'none');
    $('#pausePlay').css('display','flex');
  } else {
    $('#timer').css('display', 'initial');
    $('#clock').css('background','none');
    $('#pausePlay').css('display','none');
  } 
}//clockHover
function playClick(){
  $('#pausePlay').removeClass('ion-ios-play-outline').addClass('ion-ios-pause-outline');
  session ? $('#clock').css('border-color', 'rgb(45, 242, 31)') : $('#clock').css('border-color', 'rgb(255, 0, 0)');
  isRunning =true;
  isPaused = false;
  countDown();
}
function pauseClick(){
  $('#pausePlay').removeClass('ion-ios-pause-outline').addClass('ion-ios-play-outline');
  $('#clock').css('border-color', 'white');
  isRunning = false;
  isPaused = true;
  clearInterval(x);
  x=null;
}

function countDown(){
  
  min = parseInt($('#m').text());
  sec = parseInt($('#s').text());
  let endTime = new Date().getTime()+(min*60*1000)+(sec*1000);
  
  if (x===null){
    x = setInterval(function(){
      if (!isPaused){
        let currentTime = new Date().getTime(),
            diff = endTime-currentTime,
            m = Math.floor((diff%(1000*60*60))/(1000*60)),
            s = Math.floor((diff%(1000*60))/1000);
        if (diff <0){
          s=0;
          m=0;
        }   
        $('#m').text(m);
        s<10 ? $('#s').text('0'+s) : $('#s').text(s);
        //console.log(s, m, session);  
        if (s==0&&m==0&&session){//enter 'break' session
          if (x!==null){
            clearInterval(x);
            x=null;
          }
          $('#m').text(bDuration);
          $('#s').text('00');
          playAudio();
          $('#clock').css('border-color', 'rgb(255, 0, 0)');
          session = false;
          if (x===null){
            countDown();
          }
        }
        else if(s==0&&m==0&&!session){//re-enter 'work' session
          if (x!==null){
            clearInterval(x);
            x=null;
          }
          $('#m').text(wDuration);
          $('#s').text('00');
          playAudio();
          $('#clock').css('border-color', 'rgb(45, 242, 31)');
          session=true;
          if (x===null){
            countDown();
          }
        }
      }//not paused
      else {   
        clearInterval(x);
        x=null;
      }
    },1000);//setInterval
  }//if x ===null
}//countDown

function increase(e){
  //console.log(e);//console.log($(this));
  e.target.id.substring(0,4)==='work'? wDuration++ : bDuration++;
  if (wDuration>59){
    wDuration--;
  }
  if (bDuration>59){
    bDuration--;
  }
  forIncreaseDecrease();
}
function decrease(e){
  e.target.id.substring(0,4)==='work'? wDuration-- : bDuration--;
  if (wDuration ==0){
    wDuration=1;
  }
  else if (bDuration==0){
    bDuration=1;
  }
  forIncreaseDecrease();
}
function forIncreaseDecrease(){
  $('#workTime').text(wDuration);
  $('#breakTime').text(bDuration);
  
  if (!isRunning && !isPaused){
    $('#m').text(wDuration);
    $('#s').text('00');
  }
}

function playAudio(){
  let audio = document.createElement('audio');
  audio.setAttribute('src','https://s1.vocaroo.com/media/download_temp/Vocaroo_s1LMz0hRCRFJ.mp3');
  audio.play();
}