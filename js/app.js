(function(){
  'use strict';

  $(document).ready(function(){

    // Define our variables
    var breakLength = 5,
        sessionLength = 25,
        tick,
        minutes,
        seconds;

    // Start by hiding the pause button
    document.getElementById('pause').classList.add('hidden');
    // Assign the Initial session length value
    document.getElementById('minutes').innerHTML = sessionLength;

    // Timer Brains
    var timerObj = {

      // Countdown functionality
      countdown: function(duration){
        var timer = duration * 60;

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

    // Start timer
    $('#start').click(function(){
      timerObj.countdown(sessionLength);
      document.getElementById('start').classList.add('hidden');
      document.getElementById('pause').classList.remove('hidden');
    });

    // Pause timer
    $('#pause').click(function(){
      timerObj.pause();
      document.getElementById('start').classList.remove('hidden');
      document.getElementById('pause').classList.add('hidden');
    });

    // Reset timer
    $('#reset').click(function(){
      timerObj.pause();
      sessionLength = document.getElementById('session-length').innerHTML;
      $('#minutes').text(sessionLength);
      $('#seconds').text('00');
      document.getElementById('start').classList.remove('hidden');
      document.getElementById('pause').classList.add('hidden');
    });

    // Session Length Controls
    $('#decrease-session').click(function(){
      if(sessionLength < 2){
        sessionLength = 1;
        return;
      }
      sessionLength--;
      $('#session-length').text(sessionLength);
      document.getElementById('minutes').innerHTML = sessionLength;
    });

    $('#increase-session').click(function(){
      sessionLength++;
      $('#session-length').text(sessionLength);
      document.getElementById('minutes').innerHTML = sessionLength;
    });

  });

}());
