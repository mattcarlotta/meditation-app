const audioButton = document.querySelector(".audio-button");
const audioSource = document.querySelector(".audio-source");
const resetButton = document.querySelector(".reset-button");
const selectMinutes = document.getElementById("minutes");
const soundName = document.querySelector(".sound-name");
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
 * Plays the currently selected sound
 *
 * - Initialize the audio source
 * - Resets the sound button's action to 'toggle-sound' and content to 'PAUSE'
 * - Displays the reset button
 */
function playSound() {
  audioSource.play();
  audioButton.dataset.action = "toggle-sound";
  audioButton.textContent = "PAUSE";
  resetButton.style.display = "block";
}

/**
 * Pauses the currently selected sound
 *
 * - Pauses the audio source
 * - Sets the audio button's content to 'RESUME'
 */
function pauseSound() {
  audioSource.pause();
  audioButton.textContent = "RESUME";
}

/**
 * Subtracts the minutes and seconds of the sound duration to display a counter
 *
 * - Divides the minutes by 60 to determine if its less than 10:00 => 09:00
 * - Mods the seconds to determine if it has a remainder less than 00:10 => 00:09
 * - Updates the time display with 'xx:xx'
 */
function setDisplayTime(time) {
  let displayMins = Math.floor(time / 60);
  let displaySeconds = Math.floor(time % 60);

  if (displayMins < 10) displayMins = "0" + displayMins;
  if (displaySeconds < 10) displaySeconds = "0" + displaySeconds;

  timeDisplay.textContent = `${displayMins}:${displaySeconds}`;
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
    audioButton.textContent = "START";
  }
};

/**
 * Listens for clicks and based upon the click 'action'...
 *
 * - Alerts the user to select a sound when the audio button is disabled
 * - Selects a sound source, enables the player buttons, and plays the sound
 * - Toggles the sound playing based upon its current state: paused/playing
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
    case "select-sound": {
      audioSource.src = source;
      soundName.textContent = name;
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
      audioButton.textContent = "START";
      resetButton.style.display = "none";
      soundName.textContent = "Please select a sound...";
      break;
    }
    default:
      break;
  }
});

selectMinutes.addEventListener('change', (event) => {
  const { value } = event.target
  audioSource.currentTime = 0
  selectedDuration = Number(value * 60)
  setDisplayTime(selectedDuration)
})
