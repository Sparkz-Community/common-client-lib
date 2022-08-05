<template>
  <div id="vid">
    <video id="video" playsinline autoplay></video>
    <div class="select">
      <label for="audioSource">Audio input source: </label><select id="audioSource"></select>
    </div>

    <div class="select">
      <label for="audioOutput">Audio output destination: </label><select id="audioOutput"></select>
    </div>

    <div class="select">
      <label for="videoSource">Video source: </label><select id="videoSource"></select>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'vid',
    props: {},
    data() {
      return {
        text: '',
      };
    },
    computed: {
      videoElement() {
        return document.querySelector('#video');
      },
      audioInputSelect() {
        return document.querySelector('select#audioSource');
      },
      audioOutputSelect() {
        return document.querySelector('select#audioOutput');
      },
      videoSelect() {
        return document.querySelector('select#videoSource');
      },
      selectors() {
        return [this.audioInputSelect, this.audioOutputSelect, this.videoSelect];
      },
    },
    mounted() {
      this.audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);
      navigator.mediaDevices.enumerateDevices().then(this.gotDevices).catch(this.handleError);
      this.audioInputSelect.onchange = this.start;
      this.audioOutputSelect.onchange = this.changeAudioDestination;

      this.videoSelect.onchange = this.start;
      console.log('here');
      this.start();
    },
    methods: {
      gotDevices(deviceInfos) {
        // Handles being called several times to update labels. Preserve values.
        const values = this.selectors.map(select => select.value);
        this.selectors.forEach(select => {
          while (select.firstChild) {
            select.removeChild(select.firstChild);
          }
        });
        for (let i = 0; i !== deviceInfos.length; ++i) {
          const deviceInfo = deviceInfos[i];
          const option = document.createElement('option');
          option.value = deviceInfo.deviceId;
          if (deviceInfo.kind === 'audioinput') {
            option.text = deviceInfo.label || `microphone ${this.audioInputSelect.length + 1}`;
            this.audioInputSelect.appendChild(option);
          } else if (deviceInfo.kind === 'audiooutput') {
            option.text = deviceInfo.label || `speaker ${this.audioOutputSelect.length + 1}`;
            this.audioOutputSelect.appendChild(option);
          } else if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || `camera ${this.videoSelect.length + 1}`;
            this.videoSelect.appendChild(option);
          } else {
            console.log('Some other kind of source/device: ', deviceInfo);
          }
        }
        this.selectors.forEach((select, selectorIndex) => {
          if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
            select.value = values[selectorIndex];
          }
        });
      },
      changeAudioDestination() {
        const audioDestination = this.audioOutputSelect.value;
        this.attachSinkId(this.videoElement, audioDestination);
      },

      gotStream(stream) {
        window.stream = stream; // make stream available to console
        this.videoElement.srcObject = stream;
        // Refresh button list in case labels have become available
        return navigator.mediaDevices.enumerateDevices();
      },

      handleError(error) {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
      },

      start() {
        if (window.stream) {
          window.stream.getTracks().forEach(track => {
            track.stop();
          });
        }
        const audioSource = this.audioInputSelect.value;
        const videoSource = this.videoSelect.value;
        const constraints = {
          audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
          video: {deviceId: videoSource ? {exact: videoSource} : undefined},
        };
        navigator.mediaDevices.getUserMedia(constraints).then(this.gotStream).then(this.gotDevices).catch(this.handleError);
      },
    },
  };
</script>

<style scoped lang="scss">
  #vid {

  }
</style>
