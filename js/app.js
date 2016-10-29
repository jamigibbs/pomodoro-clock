(function(){
  'use strict';

  var PomodoroClock = {

    sessionLength: 25,
    breakLength: 5,
    tick: null,
    minutes: null,
    seconds: null,
    active: false,
    breakTime: false,
    ding: new buzz.sound('assets/ding.mp3'),

    init: function(){
      var that = this;

      that.pauseShow(false);

      $('#minutes').text(that.sessionLength);

      // Handle each of our click events
      $('.action').on('click', function () {
        switch ( $(this).attr('id') ) {
          case 'start':
              that.timerControl('start');
              break;
          case 'pause':
              that.timerControl('pause');
              break;
          case 'reset':
              that.timerControl('reset');
              break;
          case 'decrease-session':
              that.sessionControl('decrease');
              break;
          case 'increase-session':
              that.sessionControl('increase');
              break;
          case 'decrease-break':
              that.breakControl('decrease');
              break;
          case 'increase-break':
              that.breakControl('increase');
              break;
          default:
              console.log('No id');
        }
      });

    },

    // Countdown functionality
    countdown: function(duration){
      var that = this,
          timer = duration * 60;

      // Shave off the first second so we don't see a start delay
      timer -= 1;

      that.active = true;

      // Assigning to var so we can use clearInterval when paused
      that.tick = setInterval(function () {
        that.minutes = parseInt(timer / 60, 10);
        that.seconds = parseInt(timer % 60, 10);

        that.minutes = that.minutes < 10 ? "0" + that.minutes : that.minutes;
        that.seconds = that.seconds < 10 ? "0" + that.seconds : that.seconds;

        // Display the min/secs
        $('#minutes').text(that.minutes);
        $('#seconds').text(that.seconds);

        // When the timer completes
        if (--timer < 0) {
          // Keep track of the timer's status
          that.active = false;
          // Stops the interval
          that.pause();
          // Swap between work and break sessions
          that.sessionSwitch();
          // Play the ding sound
          that.ding.play();
        }

      }, 1000);
    },

    pause: function(){
      var that = this;
      // Stops the setInterval
      clearInterval(that.tick);
      // Calculates the current session time for restarting
      that.sessionLength = that.minutes + (that.seconds / 60);
    },

    pauseShow: function(bool){
      if(bool){
        // Show the pause button & hide the start button
        document.getElementById('pause').classList.remove('hidden');
        document.getElementById('start').classList.add('hidden');
      } else {
        // Show the start button & hide the pause button
        document.getElementById('start').classList.remove('hidden');
        document.getElementById('pause').classList.add('hidden');
      }
    },

    sessionSwitch: function(){
      var that = this;

      if(that.breakTime){
        // Change to work session if a break time finished
        that.breakTime = false;
        // Grab the work session time that the user wants
        that.sessionLength = document.getElementById('session-length').innerHTML;

        // Display work time
        $('#minutes').text(that.sessionLength);
        $('#seconds').text('00');
        // Announce a work time will begin next
        $('#notice').text('Work time');

        // Show the start button & hide the pause button
        that.pauseShow(false);

      } else {
        // Change to break session if a work session finished
        that.breakTime = true;
        // Grab the break sessino time that the use wants
        that.sessionLength = document.getElementById('break-length').innerHTML;

        // Display the break time
        $('#minutes').text(that.sessionLength);
        $('#seconds').text('00');
        // Announce a break time will begin next
        $('#notice').text('Break time');

        // Show the start button & hide the pause button
        that.pauseShow(false);
      }
    },

    timerControl: function(el){
      var that = this;

      if(el === 'start'){

        // Start the timer
        that.countdown(that.sessionLength);

        // Show the pause button & hide the start button
        that.pauseShow(true);

      } else if(el === 'pause'){

        // Pause the timer
        that.pause();

        // Show the start button & hide the pause button
        that.pauseShow(false);

      } else if(el === 'reset'){

        // Set the timer as inactive
        that.active = false;
        // Stop the timer if it's playing
        that.pause();
        // Get the user's desired work session length
        that.sessionLength = document.getElementById('session-length').innerHTML;

        // Display the work session length
        $('#minutes').text(that.sessionLength);
        $('#seconds').text('00');

        // Display the start button & hide the pause button
        that.pauseShow(false);

      }
    },

    sessionControl: function(el){
      var that = this;

      // Isolating the user's adjusted time so that we can selectivly pass
      // to the clock display depending on if the work or break time is active
      var tempLength = document.getElementById('session-length').innerHTML;
      // Convert from string to number
      tempLength = parseInt(tempLength);

      // Only increment if the clock is inactive
      if(el === 'decrease' && that.active === false){

        // Don't allow the work session to go below 5 minutes
        if(tempLength < 6){
          tempLength = 5;
          // Don't display the work session time in the clock if we're on break time
          if(!that.breakTime){
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
        if(!that.breakTime){
          document.getElementById('minutes').innerHTML = tempLength;
          // Assign the user's adjusted work session time to the master session length
          that.sessionLength = tempLength;
        }

      // Only increment if the clock is inactive
    } else if(el === 'increase' && that.active === false){

        // Increment work session by five
        tempLength += 5;

        // Update the work session in the settings
        $('#session-length').text(tempLength);

        // Display the work session time in the clock if we're on a work session
        if(!that.breakTime){
          document.getElementById('minutes').innerHTML = tempLength;
          // Assign the user's adjusted work session time to our master session length
          that.sessionLength = tempLength;
        }

      }
    },

    breakControl: function(el){
      var that = this;

      // Only increment if the clock is inactive
      if(el === 'decrease' && that.active === false){

        // Don't allow the break session to go below 1 minute
        if(that.breakLength < 6){
          that.breakLength = 5;
          return;
        }

        // Subtract one from the break session
        that.breakLength -= 5;
        // Update the break session in the settings
        $('#break-length').text(that.breakLength);

        // Display the break session in the clock if we're on a break session
        if(that.breakTime){
          document.getElementById('minutes').innerHTML = that.sessionLength;
          // Assign the user's adjusted break session time to the master session length
          that.sessionLength = that.breakLength;
        }

      // Only increment if the clock is inactive
      } else if(el === 'increase' && that.active === false){

        // Increase one from the break session
        that.breakLength += 5;
        // Update the break session in the settings
        $('#break-length').text(that.breakLength);

        // Display the break session in the clock if we're on a break session
        if(that.breakTime){
          document.getElementById('minutes').innerHTML = that.breakLength;
          // Assign the user's adjusted break session time to the master session length
          that.sessionLength = that.breakLength;
        }

      }
    }

  };

  $(document).ready(function(){
    PomodoroClock.init();
  });

})();
