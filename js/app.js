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
        var timer = 0.1 * 60;
        active = true;

        // Assigning to var so we can use clearInterval when paused
        tick = setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          // Display the min/secs
          $('#minutes').text(minutes);
          $('#seconds').text(seconds);

          // When the timer completes
          if (--timer < 0) {
            // Keep track of the timer's status
            active = false;
            // Stops the interval
            timerBrain.pause();
            // Swap between work and break sessions
            sessionSwitch();
            // Play the ding sound
            ding.play();
          }

        }, 1000);
      },

      // Pause functionality
      pause: function(){
        // Stops the setInterval
        clearInterval(tick);
        // Calculates the current session time for restarting
        sessionLength = minutes + (seconds / 60);
      }

    };

    function sessionSwitch(){
      if(breakTime){
        // Change to work session if a break time finished
        breakTime = false;
        // Grab the work session time that the user wants
        sessionLength = document.getElementById('session-length').innerHTML;

        // Display work time
        $('#minutes').text(sessionLength);
        $('#seconds').text('00');
        // Announce a work time will begin next
        $('#notice').text('Work time');

        // Show the start button & hide the pause button
        document.getElementById('start').classList.remove('hidden');
        document.getElementById('pause').classList.add('hidden');
      } else {
        // Change to break session if a work session finished
        breakTime = true;
        // Grab the break sessino time that the use wants
        sessionLength = document.getElementById('break-length').innerHTML;

        // Display the break time
        $('#minutes').text(sessionLength);
        $('#seconds').text('00');
        // Announce a break time will begin next
        $('#notice').text('Break time');

        // Show the start button & hide the pause button
        document.getElementById('start').classList.remove('hidden');
        document.getElementById('pause').classList.add('hidden');
      }
    }

    function timerControl(el){
      if(el === 'start'){

        // Start the timer
        timerBrain.countdown(sessionLength);

        // Show the pause button & hide the start button
        document.getElementById('start').classList.add('hidden');
        document.getElementById('pause').classList.remove('hidden');

      } else if(el === 'pause'){

        // Pause the timer
        timerBrain.pause();

        // Show the start button & hide the pause button
        document.getElementById('start').classList.remove('hidden');
        document.getElementById('pause').classList.add('hidden');

      } else if(el === 'reset'){

        // Set the timer as inactive
        active = false;
        // Stop the timer if it's playing
        timerBrain.pause();
        // Get the user's desired work session length
        sessionLength = document.getElementById('session-length').innerHTML;

        // Display their designed work session length
        $('#minutes').text(sessionLength);
        $('#seconds').text('00');

        // Display the start button & hide the pause button
        document.getElementById('start').classList.remove('hidden');
        document.getElementById('pause').classList.add('hidden');

      }
    }

    function sessionControl(el){

      // Isolating the user's adjusted time so that we can selectivly pass
      // the timer length depending on if the work or break time is active
      var tempLength = document.getElementById('session-length').innerHTML;

      if(el === 'decrease' && active === false){

        // Don't allow the work session to go below 1 minute
        if(tempLength < 2){
          tempLength = 1;
          // Don't display the work session time in the clock if we're on break time
          if(!breakTime){
            document.getElementById('minutes').innerHTML = tempLength;
          }
          return;
        }

        // Subtract one from the work session
        tempLength--;
        // Update the work session in the settings
        $('#session-length').text(tempLength);

        // Display the work session time in the clock if we're on a work session
        if(!breakTime){
          document.getElementById('minutes').innerHTML = tempLength;
          // Assign the user's adjusted work session time to the master session length
          sessionLength = tempLength;
        }

      } else if(el === 'increase' && active === false){

        // Add one to the work session
        tempLength++;
        // Update the work session in the settings
        $('#session-length').text(tempLength);

        // Display the work session time in the clock if we're on a work session
        if(!breakTime){
          document.getElementById('minutes').innerHTML = tempLength;
          // Assign the user's adjusted work session time to our master session length
          sessionLength = tempLength;
        }

      }
    }

    function breakControl(el){
      if(el === 'decrease' && active === false){

        // Don't allow the break session to go below 1 minute
        if(breakLength < 2){
          breakLength = 1;
          return;
        }

        // Subtract one from the break session
        breakLength--;
        // Update the break session in the settings
        $('#break-length').text(breakLength);

        // Display the break session in the clock if we're on a break session
        if(breakTime){
          document.getElementById('minutes').innerHTML = sessionLength;
          // Assign the user's adjusted break session time to the master session length
          sessionLength = breakLength;
        }

      } else if(el === 'increase' && active === false){

        // Increase one from the break session
        breakLength++;
        // Update the break session in the settings
        $('#break-length').text(breakLength);

        // Display the break session in the clock if we're on a break session
        if(breakTime){
          document.getElementById('minutes').innerHTML = sessionLength;
          // Assign the user's adjusted break session time to the master session length
          sessionLength = breakLength;
        }

      }
    }

    // Handle each of our click events
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
