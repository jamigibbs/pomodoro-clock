(function(){
  'use strict';

  $(document).ready(function(){

    // Define our variables
    var timerBrain,
        sessionLength = 25,
        breakLength = 5,
        tick,
        minutes,
        seconds,
        active = false,
        breakTime = false,
        ding = new buzz.sound('assets/ding.mp3');

    // Hide the pause button at launch
    document.getElementById('pause').classList.add('hidden');
    // Display the Initial session length value
    $('#minutes').text(sessionLength);

    // The Timer Brains
    timerBrain = {

      // Countdown functionality
      countdown: function(duration){
        var timer = duration * 60;
        active = true;
        // Assigning to var so we can use clearInterval when paused
        tick = setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          $('#minutes').text(minutes);
          $('#seconds').text(seconds);

          // When the timer completes
          if (--timer < 0) {
            timer = duration;
            active = false;
            timerBrain.pause();
            sessionSwitch();
            ding.play();
          }

        }, 1000);
      },

      // Pause functionality
      pause: function(){
        clearInterval(tick);
        sessionLength = minutes + (seconds / 60);
      }

    };

    function sessionSwitch(){
      if(breakTime){
        // Switch to work session
        breakTime = false;
        sessionLength = document.getElementById('session-length').innerHTML;

        $('#minutes').text(sessionLength);
        $('#seconds').text('00');
        $('#notice').text('Work time!');

        document.getElementById('start').classList.remove('hidden');
        document.getElementById('pause').classList.add('hidden');
      } else {
        // Switch to break session
        breakTime = true;
        sessionLength = document.getElementById('break-length').innerHTML;

        $('#minutes').text(sessionLength);
        $('#seconds').text('00');
        $('#notice').text('Break time!');

        document.getElementById('start').classList.remove('hidden');
        document.getElementById('pause').classList.add('hidden');
      }
    }

    function timerControl(el){
      if(el === 'start'){

        timerBrain.countdown(sessionLength);

        document.getElementById('start').classList.add('hidden');
        document.getElementById('pause').classList.remove('hidden');

      } else if(el === 'pause'){

        timerBrain.pause();

        document.getElementById('start').classList.remove('hidden');
        document.getElementById('pause').classList.add('hidden');

      } else if(el === 'reset'){

        active = false;
        timerBrain.pause();

        sessionLength = document.getElementById('session-length').innerHTML;

        $('#minutes').text(sessionLength);
        $('#seconds').text('00');

        document.getElementById('start').classList.remove('hidden');
        document.getElementById('pause').classList.add('hidden');

      }
    }

    function sessionControl(el){
      if(el === 'decrease' && active === false){

        if(sessionLength < 2){
          sessionLength = 1;
          return;
        }

        sessionLength--;
        $('#session-length').text(sessionLength);

        if(!breakTime){
          document.getElementById('minutes').innerHTML = sessionLength;
        }

      } else if(el === 'increase' && active === false){

        var tempLength = document.getElementById('session-length').innerHTML;
        tempLength++;
        $('#session-length').text(tempLength);

        if(!breakTime){
          document.getElementById('minutes').innerHTML = tempLength;
          sessionLength = tempLength;
        }

      }
    }

    function breakControl(el){
      if(el === 'decrease' && active === false){

        if(breakLength < 2){
          breakLength = 1;
          return;
        }

        breakLength--;
        $('#break-length').text(breakLength);

        if(breakTime){
          sessionLength = breakLength;
          document.getElementById('minutes').innerHTML = sessionLength;
        }

      } else if(el === 'increase' && active === false){

        breakLength++;
        $('#break-length').text(breakLength);

        if(breakTime){
          sessionLength = breakLength;
          document.getElementById('minutes').innerHTML = sessionLength;
        }

      }
    }

    $('.action').click(function () {
      switch ( $(this).attr('id') ) {
        case 'start':
            timerControl('start');
            break;
        case 'pause':
            timerControl('pause');
            break;
        case 'reset':
            timerControl('reset');
            break;
        case 'decrease-session':
            sessionControl('decrease');
            break;
        case 'increase-session':
            sessionControl('increase');
            break;
        case 'decrease-break':
            breakControl('decrease');
            break;
        case 'increase-break':
            breakControl('increase');
            break;
        default:
            console.log('No id');
      }
    });

  });

}());
