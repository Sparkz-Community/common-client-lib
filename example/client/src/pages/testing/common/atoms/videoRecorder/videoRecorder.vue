<template>
  <div id="video-recorder-testing">
    <q-card>
      <q-card-section>
        <div class="videobox">
          <video-recorder
            :video-source="videoSource"
            @error="onError"
            @cameras="onCameras"
            @microphones="onMicrophones"
            @spaekers="onSpeakers"
            @video-live="onVideoLive"
            @view-change="onViewChange"
            @new-recording="onNewRecording"
            @delete-recording="onDeleteRecording"
            @player-loaded="onPlayerLoaded"
            ref="videoRecorder"
            :deviceTypes="deviceTypes"
            :recorderMode="recorderMode"
          />
        </div>
{{videoSourceList.filter(function (el) {return !el.header;})}}
        <q-select
          v-if="videoSource == null"
          v-show="view === 'video'"
          filled
          v-model="videoSource"
          :options="videoSourceList.filter(function (el) {return !el.header;})"
          label="Select video input"
        ></q-select>
        {{microphoneSourceList}}
        <q-select
          v-if="microphoneSource == null"
          v-show="view === 'video'"
          filled
          v-model="microphoneSource"
          :options="microphoneSourceList"
          label="Select microphone input"
        ></q-select>
        {{audioSourceList}}
        <q-select
          v-if="audioSource == null"
          v-show="view === 'video'"
          filled
          v-model="audioSource"
          :options="audioSourceList"
          label="Select audio output"
        ></q-select>


        <q-list bordered class="rounded-borders">

          <div v-for="(deviceSource, idx) in videoSourceList" :key="idx">
            <q-item-label header style="font-size: 14pt;" v-if="deviceSource.divider">{{deviceSource.header}}</q-item-label>
            <q-item v-if="deviceSource.label" clickable :active="videoSource === deviceSource.source">

              <q-item-section>
                <q-toggle
                  v-model="third"
                  checked-icon="check"
                  color="positive"
                  unchecked-icon="clear"
                />
              </q-item-section>

              <q-item-section top class="gt-sm">
                <q-item-label class="q-mt-sm" style="margin-left:1%;">{{ deviceSource.label }}</q-item-label>
              </q-item-section>


              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn class="gt-xs" size="12px" flat dense round icon="videocam_off"/>
                  <q-btn class="gt-xs" size="12px" flat dense round icon="toggle_off"/>
                  <q-btn size="12px" flat dense round icon="more_vert"/>
                </div>
              </q-item-section>
              <q-separator spaced/>
            </q-item>

          </div>

        </q-list>





        <div
          v-if="videoSource"
          class="videobox"
          style="background-color: black; color: grey;"
        >
          {{ videoSource.label }}
          <q-icon
            @click="videoClose"
            color="grey"
            name="mdi-close-circle"
          ></q-icon>
        </div>
      </q-card-section>


      <q-card-actions v-show="view === 'videoPlayer'">
        <div class="row">
          <div class="col">
            <q-icon
              class="q-mx-xs"
              size="large"
              color="red"
              v-if="!isPlayerMuted"
              @click="togglePlayerMuted"
              name="mdi-speaker"
            ></q-icon>
            <q-icon
              class="q-mx-xs"
              size="large"
              v-if="isPlayerMuted"
              @click="togglePlayerMuted"
              name="mdi-speaker-off"
            ></q-icon>
          </div>
          <div class="col">
            <q-btn
              class="q-mx-xs"
              @click="playRecording"
              size="xs"
            >
              <q-icon color="red" name="mdi-play-circle"></q-icon>
            </q-btn>
            <q-btn
              class="q-mx-xs"
              @click="downloadRecording"
              size="xs"
            >
              <q-icon color="red" name="mdi-download-circle"></q-icon>
            </q-btn>
            <q-btn
              class="q-mx-xs"
              @click="deleteRecording"
              size="xs"
            >
              <q-icon color="red" name="mdi-delete-circle"></q-icon>
            </q-btn>
          </div>
        </div>
      </q-card-actions>


      <q-card-actions v-show="view === 'video' && videoSource != null">
        <div class="row">
          <div class="col">
            <q-icon size="lg" color="red" v-if="!isMuted" @click="toggleMuted" name="mdi-microphone"></q-icon>
            <q-icon size="lg" v-if="isMuted" @click="toggleMuted" name="mdi-microphone-off"></q-icon>
          </div>
          <div class="col">
            <q-btn
              v-show="controls === 'liveVideo'"
              class="q-mx-xs"
              @click="videoRecord"
              size="xs"
            >
              <q-icon color="red" name="mdi-record-circle"></q-icon>
            </q-btn>
            <q-btn
              v-show="controls === 'recordingVideo'"
              class="q-mx-xs"
              @click="videoStopRecording"
              size="xs"
            >
              <q-icon color="red" name="mdi-stop-circle"></q-icon>
            </q-btn>
            <q-btn
              v-show="controls === 'recordingVideo'"
              class="q-mx-xs"
              @click="pause"
              size="xs"
              v-if="!isPaused"
            >
              <q-icon name="mdi-pause-circle"></q-icon>
            </q-btn>
            <q-btn
              v-show="controls === 'recordingVideo'"
              class="q-mx-xs"
              @click="resume"
              size="xs"
              dark
              v-if="isPaused"
            >
              <q-icon name="mdi-pause-circle"></q-icon>
            </q-btn>
          </div>
          <div class="col">
            <q-icon @click="videoSnapshot(view)" color="teal" name="mdi-camera"></q-icon>
          </div>
        </div>
      </q-card-actions>


      <q-card-actions v-show="view === 'snapshot'">
        <div class="row">
          <div class="col">
            <q-btn
              class="q-mx-xs"
              @click="closeSnapshot()"
              size="xs"
            >
              <q-icon color="red" name="mdi-close-circle"></q-icon>
            </q-btn
            >
            <q-btn
              class="q-mx-xs"
              @click="snapshotDownload"
              size="xs"
            >
              <q-icon size="mdi-download-circle"></q-icon>
            </q-btn>
          </div>
        </div>
      </q-card-actions>
    </q-card>

  </div>
</template>

<script>

  export default {
    name: 'VideoRecorderTesting',
    components: {
      videoRecorder: () => import('@iy4u/common-client-lib').then(module => module.videoRecorder),
    },
    props: {
      deviceTypes: {
        type: Array,
        default: () => {
          return ['camera', 'screen'];
        },
      },
      recorderMode: {
        type: String,
        default: 'single',
      },
      deviceSources: {
        type: Array,
        default() {
          return [
            {
              label: 'Option 1',
              value: 'op1'
            },
            {
              label: 'Option 2',
              value: 'op2'
            },
            {
              label: 'Option 3',
              value: 'op3'
            }
          ];
        }
      },
      deviceSourcesEnabled: {
        type: Array,
        default() {
          return [];
        }
      }

    },
    data() {
      return {
        controls: null,
        videoSource: null,
        videoSourceList: [],
        microphoneSource: null,
        microphoneSourceList: [],
        audioSource: null,
        audioSourceList: [],
        isPaused: false,
        isPlayerPaused: false,
        isMuted: true,
        isPlayerMuted: true,
        view: 'video',
        recordings: [], // local sparsed list of recording data
      };
    },
    methods: {
      onError(error) {
        console.log('Error emitted', error);
      },
      onCameras(cameras) {
        console.log('Available cameras', cameras);
        /**
         * We are implementing multi-use recording with camera and screen support.
         * We use the `listFromVideoInput` helper function provided by the component.
         */
        this.videoSourceList = this.$refs.videoRecorder.listFromVideoInput(cameras);
        console.log('onCameras - this.videoSourceList:', this.videoSourceList);
      },
      onMicrophones(microphones) {
        console.log('Available cameras', microphones);
        /**
         * We are implementing multi-use recording with camera and screen support.
         * We use the `listFromVideoInput` helper function provided by the component.
         */
        this.microphoneSourceList = this.$refs.videoRecorder.listFromAudioInput(microphones);
      },
      onSpeakers(audio) {
        console.log('Available cameras', audio);
        /**
         * We are implementing multi-use recording with camera and screen support.
         * We use the `listFromVideoInput` helper function provided by the component.
         */
        this.audioSourceList = this.$refs.audioRecorder.listFromAudioOutput(audio);
      },
      onVideoLive() {
        this.controls = 'liveVideo';
      },
      onViewChange(view) {
        this.view = view;
      },
      onNewRecording(recording) {
        this.recordings.push(recording);
        if (this.recorderMode === 'single') {
          // Load the video into the player and force disposition
          // this.view = "videoPlayer";
          this.loadRecording(0);
        }
      },
      onDeleteRecording(index) {
        this.recordings.splice(index, 1);
        if (this.recorderMode === 'single') {
          this.controls = 'liveVideo';
        }
      },
      onPlayerLoaded() {
        //this.playRecording();
      },
      videoRecord() {
        this.controls = 'recordingVideo';
        this.$refs.videoRecorder.startVideoRecording();
      },
      videoSnapshot(fromView) {
        this.$refs.videoRecorder.videoSnapshot(fromView);
      },
      videoClose() {
        this.$refs.videoRecorder.stopVideo();
        this.view = 'video';
        this.controls = 'liveVideo';
        this.videoSource = null;
      },
      videoStopRecording() {
        this.$refs.videoRecorder.stopRecording();
        // resume the video, minus recording
        this.resume();
      },
      resume() {
        this.isPaused = false;
        this.$refs.videoRecorder.resume();
      },
      pause() {
        this.isPaused = true;
        this.$refs.videoRecorder.pause();
      },
      closeSnapshot() {
        this.$refs.videoRecorder.closeSnapshot();
      },
      snapshotDownload() {
        this.$refs.videoRecorder.downloadSnapshot();
      },
      downloadRecording(index) {
        if (this.recorderMode === 'single') {
          index = 0;
        }
        this.$refs.videoRecorder.downloadRecording(index);
      },
      deleteRecording(index) {
        if (this.recorderMode === 'single') {
          index = 0;
        }
        this.$refs.videoRecorder.deleteRecording(index);
      },
      async loadRecording(index) {
        await this.$refs.videoRecorder.loadRecording(index);
      },
      playRecording() {
        this.isPlayerPaused = false;
        this.$refs.videoRecorder.playRecording();
      },
      pausePlayer() {
        this.isPlayerPaused = true;
        this.$refs.videoRecorder.pausePlayer();
      },
      resumePlayer() {
        this.isPlayerPaused = false;
        this.$refs.videoRecorder.resumePlayer();
      },
      deletePlayerRecording() {
        this.$refs.videoRecorder.deletePlayerRecording();
      },
      closePlayer() {
        this.$refs.videoRecorder.closePlayer();
      },
      toggleMuted() {
        this.isMuted = !this.isMuted;
      },
      togglePlayerMuted() {
        this.isPlayerMuted = !this.isPlayerMuted;
      },
    },
  };
</script>

<style scoped lang="scss">
  #video-recorder-testing {
    .videobox {
      background-color: black;
    }
  }
</style>
