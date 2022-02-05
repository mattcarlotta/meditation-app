const soundButton = document.querySelector(".sound-button");
const resetButton = document.querySelector(".reset-button");
const audioSound = document.querySelector(".audio");
const songName = document.querySelector(".song-name");
const selectMinutes = document.getElementById("minutes");
const timeDisplay = document.querySelector(".timer-display");

/**
 * Initial global value to keep track of the selected time duration
 */
let globalTimeInSeconds = 60;

/**
 * Plays the currently selected song
 *
 * - Initialize the audio source
 * - Resets the sound button's action to 'toggle-sound' and content to 'PAUSE'
 * - Displays the reset button
 */
function playSound() {
  audioSound.play();
  soundButton.dataset.action = "toggle-sound";
  soundButton.innerHTML = "PAUSE";
  resetButton.style.display = "block";
}

/**
 * Pauses the currently selected song
 *
 * - Pauses the audio source
 * - Sets the sound button's content to 'RESUME'
 * - Displays the reset button
 */
function pauseSound() {
  audioSound.pause();
  soundButton.innerHTML = "RESUME";
}

/**
 * Subtracts the minutes and seconds of the song duration to display a counter
 *
 * - Divides the minutes by 60 to determine if it needs a '0'
 * - Mods the seconds to determine if it has a remainder less than '10'
 * - Updates the time displays content with 'xx:xx'
 */
function updateTime(time) {
  let displayMins = Math.floor(time / 60);
  let displaySeconds = Math.floor(time % 60);

  if (displayMins < 10) displayMins = "0" + displayMins;
  if (displaySeconds < 10) displaySeconds = "0" + displaySeconds;

  timeDisplay.innerHTML = `${displayMins}:${displaySeconds}`;
}

/**
 * Subtracts the selected time from the player's time to update the time display and determine if the players needs to be reset
 *
 * - Updates the time displays content with 'xx:xx'
 * - Determines if the time left is greater than 0, otherwise resets the player
 */
audioSound.ontimeupdate = () => {
  const { currentTime } = audioSound;

  updateTime(globalTimeInSeconds - currentTime);

  if (currentTime + 1 > globalTimeInSeconds) {
    audioSound.pause();
    audioSound.currentTime = 0;
    soundButton.innerHTML = "START";
  }
};

/**
 * Listens for clicks and based upon the click 'action'...
 * - Selects a song source, enable the player buttons, and play the song
 * - Toggles the song playing based upon its current state: paused/playing
 * - Resets the player, resets the time display, and disables player buttons
 * - Updates the time display and resets the player's time
 */
document.addEventListener("click", (event) => {
  const { action, sound, name, value } = event.target.dataset;

  switch (action) {
    case "select-song": {
      audioSound.src = sound;
      songName.innerHTML = name;
      soundButton.classList.remove("disabled");
      playSound();
      break;
    }
    case "toggle-sound": {
      if (audioSound.paused) playSound();
      else pauseSound();
      break;
    }
    case "reset-sound": {
      pauseSound();
      audioSound.currentTime = 0;
      updateTime(globalTimeInSeconds);
      soundButton.classList.add("disabled");
      soundButton.dataset.action = "";
      resetButton.style.display = "none";
      songName.innerHTML = "Please select a song...";
      break;
    }
    case "set-time": {
      audioSound.currentTime = 0;
      globalTimeInSeconds = Number(value * 60);
      updateTime(globalTimeInSeconds);
      break;
    }
    default:
      break;
  }
});
