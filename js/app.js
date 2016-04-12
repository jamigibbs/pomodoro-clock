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
    pauseShow(false);

    // Display the Initial session length value
    $('#minutes').text(sessionLength);

    // The Timer Brains
    timerBrain = {

      // Countdown functionality
      countdown: function(duration){
        var timer = duration * 60;

        // Shave off the first second so we don't see a start delay
        timer -= 1;

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

    function pauseShow(bool){
      if(bool){
        // Show the pause button & hide the start button
        document.getElementById('pause').classList.remove('hidden');
        document.getElementById('start').classList.add('hidden');
      } else {
        // Show the start button & hide the pause button
        document.getElementById('start').classList.remove('hidden');
        document.getElementById('pause').classList.add('hidden');
      }
    }

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
        pauseShow(true);

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
        pauseShow(false);
      }
    }

    function timerControl(el){
      if(el === 'start'){

        // Start the timer
        timerBrain.countdown(sessionLength);

        // Show the pause button & hide the start button
        pauseShow(true);

      } else if(el === 'pause'){

        // Pause the timer
        timerBrain.pause();

        // Show the start button & hide the pause button
        pauseShow(false);

      } else if(el === 'reset'){

        // Set the timer as inactive
        active = false;
        // Stop the timer if it's playing
        timerBrain.pause();
        // Get the user's desired work session length
        sessionLength = document.getElementById('session-length').innerHTML;

        // Display the work session length
        $('#minutes').text(sessionLength);
        $('#seconds').text('00');

        // Display the start button & hide the pause button
        pauseShow(false);

      }
    }

    function sessionControl(el){

      // Isolating the user's adjusted time so that we can selectivly pass
      // to the clock display depending on if the work or break time is active
      var tempLength = document.getElementById('session-length').innerHTML;
      // Convert from string to number
      tempLength = parseInt(tempLength);

      // Only increment if the clock is inactive
      if(el === 'decrease' && active === false){

        // Don't allow the work session to go below 5 minutes
        if(tempLength < 6){
          tempLength = 5;
          // Don't display the work session time in the clock if we're on break time
          if(!breakTime){
            document.getElementById('minutes').innerHTML = tempLength;
          }
          // No need to go any further
          return;
        }

        // Decrement work session by five
        tempLength -= 5;
        // Update the work session in the settings
        $('#session-length').text(tempLength);

        // Display the work session time in the clock if we're on a work session
        if(!breakTime){
          document.getElementById('minutes').innerHTML = tempLength;
          // Assign the user's adjusted work session time to the master session length
          sessionLength = tempLength;
        }

      // Only increment if the clock is inactive
      } else if(el === 'increase' && active === false){

        // Increment work session by five
        tempLength += 5;

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
      // Only increment if the clock is inactive
      if(el === 'decrease' && active === false){

        // Don't allow the break session to go below 1 minute
        if(breakLength < 6){
          breakLength = 5;
          return;
        }

        // Subtract one from the break session
        breakLength -= 5;
        // Update the break session in the settings
        $('#break-length').text(breakLength);

        // Display the break session in the clock if we're on a break session
        if(breakTime){
          document.getElementById('minutes').innerHTML = sessionLength;
          // Assign the user's adjusted break session time to the master session length
          sessionLength = breakLength;
        }

      // Only increment if the clock is inactive
      } else if(el === 'increase' && active === false){

        // Increase one from the break session
        breakLength += 5;
        // Update the break session in the settings
        $('#break-length').text(breakLength);

        // Display the break session in the clock if we're on a break session
        if(breakTime){
          document.getElementById('minutes').innerHTML = breakLength;
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
