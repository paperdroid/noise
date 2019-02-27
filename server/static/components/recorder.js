import { renderPlayer } from './player.js';

function renderRecorder({
  noise,
  recorderState, // TODO: divorce state shape of recorder
  recording,
  disabled,
  arrowsDisabled,
  noiseList,
  selectedNoise,
  onButtonClick,
  onLeftArrowClick,
  onRightArrowClick,
}) {
  disabled = false;
  const recorder = document.querySelector('[data-id=recorder]');
  const recorderTitle = recorder.querySelector('[data-id=title]');
  const recorderDescription = recorder.querySelector('[data-id=description]');
  const examples = document.querySelector('[data-id=recorder-examples-list]');
  let players = '';

  if (noise.preview && Array.isArray(noise.preview)) {
    // if there's more than one preview
    players = noise.preview
      .map(({ path, title }, index) =>
        renderPlayer({
          id: index,
          url: path,
          title: title,
        }),
      )
      .join('');
  } else {
    // if there's only one preview (majority case)
    let { path, title } = noise.preview;
    players = renderPlayer({
      id: 0,
      url: path,
      title: title,
    });
  }
  examples.innerHTML = players;

  recorderTitle.innerText = noise.name;
  recorderDescription.innerText = noise.desc;

  renderRecordingControls({
    recorderState,
    recording,
    disabled,
    onButtonClick,
  });
  renderArrows(
    arrowsDisabled,
    noiseList,
    selectedNoise,
    onLeftArrowClick,
    onRightArrowClick,
  );
}

function renderRecordingControls({
  recorderState,
  recording,
  disabled,
  onButtonClick,
}) {
  renderTime({
    time: recorderState.startTime ? Date.now() - recorderState.startTime : 0,
    disabled,
  });
  renderButton({ recording, disabled, onButtonClick });
  renderStatus({ status: recorderState.status.description, disabled });
}

function renderTime({ time = 0, disabled = false }) {
  /* UI */
  const recorderTime = document.querySelector('[data-id=recorderTime]');

  if (!disabled) {
    // TODO: put this code in utilities as a formatter
    const timeInS = time / 1000;
    const minutes = ('' + Math.floor(timeInS / 60)).padStart(2, '0');
    const seconds = ('' + Math.floor(timeInS % 60)).padStart(2, '0');
    recorderTime.innerText = `${minutes}:${seconds}`;
    recorderTime.classList.remove('Recorder-time--disabled');
  } else {
    recorderTime.innerText = `--:--`;
    recorderTime.classList.add('Recorder-time--disabled');
  }
}

function renderStatus({ status = '', disabled = false }) {
  const recorderStatus = document.querySelector('[data-id=recorderStatus]');

  recorderStatus.innerText = `${status}`;
  if (!disabled) {
    recorderStatus.classList.remove('Recorder-status--disabled');
  } else {
    recorderStatus.classList.add('Recorder-status--disabled');
  }
}

// TODO: move this out to its own file (since it is not technically part of the recorder)
function renderArrows(
  disabled,
  noiseList,
  selectedNoise,
  onLeftArrowClick,
  onRightArrowClick,
) {
  /* UI */
  // TODO: consider passing in an array that represents what kind of arrows to draw instead
  const goBack = document.querySelector('[data-id=goBack]');
  const goForward = document.querySelector('[data-id=goForward]');

  if (disabled) {
    goBack.classList.add('Arrow--disabled');
    goForward.classList.add('Arrow--disabled');
    goBack.removeEventListener('click', onLeftArrowClick);
    goForward.removeEventListener('click', onRightArrowClick);
  } else {
    if (selectedNoise > 0) {
      goBack.classList.remove('Arrow--disabled');
      goBack.addEventListener('click', onLeftArrowClick);
    } else {
      goBack.classList.add('Arrow--disabled');
      goBack.removeEventListener('click', onLeftArrowClick);
    }
    if (selectedNoise < noiseList.length - 1) {
      goForward.classList.remove('Arrow--disabled');
      goForward.addEventListener('click', onRightArrowClick);
    } else {
      goForward.classList.add('Arrow--disabled');
      goForward.removeEventListener('click', onRightArrowClick);
    }
  }
}

function renderButton({
  recording = false,
  disabled = false,
  onButtonClick = () => {},
}) {
  const recordButton = document.querySelector('[data-id=recordButton]');
  const stopButton = document.querySelector('[data-id=stopButton]');

  if (disabled) {
    recordButton.classList.add('Recorder-recordButton--disabled');
    stopButton.classList.add('Recorder-stopButton--disabled');
  } else {
    recordButton.classList.remove('Recorder-recordButton--disabled');
    stopButton.classList.remove('Recorder-stopButton--disabled');
  }
  recordButton.disabled = disabled;
  stopButton.disabled = disabled;

  if (recording) {
    recordButton.classList.add('Recorder-recordButton--recording');
    stopButton.classList.remove('Recorder-stopButton--stopped');
    stopButton.addEventListener('click', onButtonClick);
  } else {
    recordButton.classList.remove('Recorder-recordButton--recording');
    stopButton.classList.add('Recorder-stopButton--stopped');
    recordButton.addEventListener('click', onButtonClick);
  }
}

export {
  renderTime,
  renderButton,
  renderStatus,
  renderRecorder,
  renderRecordingControls,
  renderArrows,
};
