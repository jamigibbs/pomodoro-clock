(function(){
  'use strict';

  $(document).ready(function(){

    document.getElementById('pause').classList.add('hidden');

    // Define our variables
    var breakLength = 5,
        sessionLength = 25,
        tick,
        minutes,
        seconds;

    // The brains
    var timerObj = {

      countdown: function(duration){
        var timer = duration * 60;

        tick = setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          $('#minutes').text(minutes);
          $('#seconds').text(seconds);

          if (--timer < 0) {
            timer = duration;
            $('#time').text('Break time!');
            timerObj.pause();
          }
        }, 1000);
      },

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
      sessionLength = 25;
      $('#minutes').text(sessionLength);
      $('#seconds').text('00');
      document.getElementById('start').classList.remove('hidden');
      document.getElementById('pause').classList.add('hidden');
    });

  });

}());
