(function(){
  'use strict';

  $(document).ready(function(){

    // Define our variables
    var breakLength = 5,
        sessionLength = 25,
        tick,
        minutes,
        seconds,
        active = false;

    // Start by hiding the pause button
    document.getElementById('pause').classList.add('hidden');
    // Assign the Initial session length value
    document.getElementById('minutes').innerHTML = sessionLength;

    // Timer Brains
    var timerObj = {

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
            $('#notice').text('Break time!');
            timerObj.pause();
          }

        }, 1000);
      },

      // Pause functionality
      pause: function(){
        clearInterval(tick);
        sessionLength = minutes + (seconds / 60);
      }

    };

    function timerControl(el){
      if(el === 'start'){

        timerObj.countdown(sessionLength);

        document.getElementById('start').classList.add('hidden');
        document.getElementById('pause').classList.remove('hidden');

      } else if(el === 'pause'){

        timerObj.pause();

        document.getElementById('start').classList.remove('hidden');
        document.getElementById('pause').classList.add('hidden');

      } else if(el === 'reset'){

        active = false;
        timerObj.pause();

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
        document.getElementById('minutes').innerHTML = sessionLength;

      } else if(el === 'increase' && active === false){

        sessionLength++;

        $('#session-length').text(sessionLength);
        document.getElementById('minutes').innerHTML = sessionLength;

      }
    }

    // Start timer
    $('#start').click(function(){
      timerControl('start');
    });

    // Pause timer
    $('#pause').click(function(){
      timerControl('pause');
    });

    // Reset timer
    $('#reset').click(function(){
      timerControl('reset');
    });

    // Session Length Controls
    $('#decrease-session').click(function(){
      sessionControl('decrease');
    });

    $('#increase-session').click(function(){
      sessionControl('increase');
    });

  });

}());
