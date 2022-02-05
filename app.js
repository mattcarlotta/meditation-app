const audioButton = document.querySelector(".audio-button");
const audioSource = document.querySelector(".audio-source");
const resetButton = document.querySelector(".reset-button");
const songName = document.querySelector(".song-name");
const selectMinutes = document.getElementById("minutes");
const timeDisplay = document.querySelector(".timer-display");

/**
 * Initial global selected value in seconds
 */
let selectedDuration = 60;

/**
 * Initial selected time (needed for resetting the selected index upon page refresh)
 */
selectMinutes.selectedIndex = 0;

/**
 * Plays the currently selected song
 *
 * - Initialize the audio source
 * - Resets the sound button's action to 'toggle-sound' and content to 'PAUSE'
 * - Displays the reset button
 */
function playSound() {
  audioSource.play();
  audioButton.dataset.action = "toggle-sound";
  audioButton.innerHTML = "PAUSE";
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
  audioSource.pause();
  audioButton.innerHTML = "RESUME";
}

/**
 * Subtracts the minutes and seconds of the song duration to display a counter
 *
 * - Divides the minutes by 60 to determine if its less than 10:00 => 09:00
 * - Mods the seconds to determine if it has a remainder less than 00:10 => 00:09
 * - Updates the time displays content with 'xx:xx'
 */
function setDisplayTime(time) {
  let displayMins = Math.floor(time / 60);
  let displaySeconds = Math.floor(time % 60);

  if (displayMins < 10) displayMins = "0" + displayMins;
  if (displaySeconds < 10) displaySeconds = "0" + displaySeconds;

  timeDisplay.innerHTML = `${displayMins}:${displaySeconds}`;
}

/**
 * Subtracts the selected time from the player's time to update the time display and determines if the player needs to be reset
 *
 * - Updates the time display according to the leftover duration
 * - Determines if the time left is greater than 0, otherwise resets the player
 */
audioSource.ontimeupdate = () => {
  setDisplayTime(selectedDuration - audioSource.currentTime);

  if (audioSource.currentTime + 1 > selectedDuration) {
    audioSource.pause();
    audioSource.currentTime = 0;
    audioButton.innerHTML = "START";
  }
};

/**
 * Listens for clicks and based upon the click 'action'...
 *
 * - Selects a song source, enables the player buttons, and plays the song
 * - Toggles the song playing based upon its current state: paused/playing
 * - Resets the player, resets the time display, and disables player buttons
 * - Updates the time display and resets the player's time
 */
document.addEventListener("click", (event) => {
  const { action, name, source, value } = event.target.dataset;

  switch (action) {
    case "disabled": {
      alert("Please select a sound to play...");
      break;
    }
    case "select-song": {
      audioSource.src = source;
      songName.innerHTML = name;
      audioButton.classList.remove("disabled");
      playSound();
      break;
    }
    case "toggle-sound": {
      if (audioSource.paused) playSound();
      else pauseSound();
      break;
    }
    case "reset-sound": {
      pauseSound();
      audioSource.currentTime = 0;
      setDisplayTime(selectedDuration);
      audioButton.classList.add("disabled");
      audioButton.dataset.action = "disabled";
      audioButton.innerHTML = "START";
      resetButton.style.display = "none";
      songName.innerHTML = "Please select a sound...";
      break;
    }
    case "set-time": {
      audioSource.currentTime = 0;
      selectedDuration = Number(value * 60);
      setDisplayTime(selectedDuration);
      break;
    }
    default:
      break;
  }
});
