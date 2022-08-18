<template>
  <div id="device-controls" class="q-pa-md" style="max-width: 100%">
    <!--
        VIDEO CONTROLS
    -->
    <q-list v-if="type === 'videoinput'" padding>
      <q-item-label>
        <template>
          <h6 class="q-pa-none q-ma-none">Controls</h6>
        </template>
      </q-item-label>

      <q-separator spaced/>
      <q-item-label header>Aspect Ratio</q-item-label>
      <q-item v-if="deviceCapabilitiesVideo.aspectRatio" class="q-pl-xs">
        <q-item-section class="q-ml-md" style="width: 100%;">
          <q-slider
            v-model="formData.aspectRatio"
            :label-value="formData.aspectRatio.toFixed(4)"
            :min="Number(deviceCapabilitiesVideo.aspectRatio.min.toFixed(4))"
            :max="Number(deviceCapabilitiesVideo.aspectRatio.max.toFixed(4))"
            :step="0.0001"
            :disable="deviceCapabilitiesVideo.aspectRatio.min === deviceCapabilitiesVideo.aspectRatio.max"
            label
            label-always
            markers
            dense
            snap
            color="primary"
          />
        </q-item-section>
        <q-item-section side>
          <q-select
            v-model="formData.aspectRatio"
            :options="videoAspectRatios"
            color="primary"
            standout
            dense
          />
        </q-item-section>
      </q-item>
      <q-item-label caption style="text-align: center;">
        {{ `min: ${deviceCapabilitiesVideo.aspectRatio.min.toFixed(4)}, max: ${deviceCapabilitiesVideo.aspectRatio.max.toFixed(4)}` }}
      </q-item-label>
      <q-separator spaced/>


      <q-item-label header>Height and Width</q-item-label>
      <q-item v-if="deviceCapabilitiesVideo.height" class="q-pl-xs">
        <q-item-section class="q-ml-md" style="width: 100%;">
          <q-slider
            v-model="formData.height"
            :min="deviceCapabilitiesVideo.height.min"
            :max="deviceCapabilitiesVideo.height.max"
            :disable="deviceCapabilitiesVideo.height.min === deviceCapabilitiesVideo.height.max"
            :step="1"
            label
            label-always
            markers
            dense
            snap
            color="primary"
          />
        </q-item-section>
      </q-item>
      <q-item-label class="q-mb-lg" caption style="text-align: center;">
        {{ `min: ${deviceCapabilitiesVideo.height.min}, max: ${deviceCapabilitiesVideo.height.max}` }}
      </q-item-label>


      <q-item v-if="deviceCapabilitiesVideo.width" class="q-pl-xs">
        <q-item-section class="q-ml-md" style="width: 100%;">
          <q-slider
            v-model="formData.width"
            :min="deviceCapabilitiesVideo.width.min"
            :max="deviceCapabilitiesVideo.width.max"
            :disable="deviceCapabilitiesVideo.width.min === deviceCapabilitiesVideo.width.max"
            :step="1"
            label
            label-always
            markers
            dense
            snap
            color="primary"
          />
        </q-item-section>
      </q-item>
      <q-item-label caption style="text-align: center;">
        {{ `min: ${deviceCapabilitiesVideo.width.min}, max: ${deviceCapabilitiesVideo.width.max}` }}
      </q-item-label>
      <q-separator spaced/>


      <div v-if="deviceCapabilitiesVideo.facingMode && deviceCapabilitiesVideo.facingMode.length > 0">
        <q-item-label header>Facing Mode</q-item-label>
        <q-item class="q-pl-xs">
          <q-item-section class="q-ml-md" style="width: 100%;">
            <q-select
              v-model="formData.facingMode"
              :options="deviceCapabilitiesVideo.facingMode"
              color="primary"
              standout
              dense
            />
          </q-item-section>
        </q-item>
        <q-separator spaced/>
      </div>

      <div v-if="deviceCapabilitiesVideo.resizeMode && deviceCapabilitiesVideo.resizeMode.length > 0">
        <q-item-label header>Resize Mode</q-item-label>
        <q-item class="q-pl-xs">
          <q-item-section class="q-ml-md" style="width: 100%;">
            <q-select
              v-model="formData.resizeMode"
              :options="deviceCapabilitiesVideo.resizeMode"
              color="primary"
              standout
              dense
            />
          </q-item-section>
        </q-item>
        <q-separator spaced/>
      </div>
    </q-list>


    <!--
        AUDIO CONTROLS
    -->
    <q-list v-if="type === 'audioinput'" padding>
      <q-item-label>
        <template>
          <h6 class="q-pa-none q-ma-none">Controls</h6>
        </template>
      </q-item-label>

      <q-separator spaced/>
      <q-item
        v-if="deviceCapabilitiesAudio.autoGainControl || deviceCapabilitiesAudio.noiseSuppression || deviceCapabilitiesAudio.echoCancellation"
        class="q-pl-sm">
        <q-item-section class="q-pb-none" side top style="flex-direction: row; width: 100%;">
          <q-toggle v-if="deviceCapabilitiesAudio.autoGainControl" label="Gain" checked-icon="check"
                    color="green"
                    unchecked-icon="clear" v-model="formData.autoGainControl">
            <q-tooltip content-style="font-size: 16px">Auto Gain Control</q-tooltip>
          </q-toggle>
          <q-toggle v-if="deviceCapabilitiesAudio.noiseSuppression" label="Noise" checked-icon="check"
                    color="green"
                    unchecked-icon="clear" v-model="formData.noiseSuppression">
            <q-tooltip content-style="font-size: 16px">Noise Suppression</q-tooltip>
          </q-toggle>
          <q-toggle v-if="deviceCapabilitiesAudio.echoCancellation" label="Echo" checked-icon="check"
                    color="green"
                    unchecked-icon="clear" v-model="formData.echoCancellation">
            <q-tooltip content-style="font-size: 16px">Echo Cancellation</q-tooltip>
          </q-toggle>
        </q-item-section>
      </q-item>
      <q-separator spaced/>


      <q-item-label header>Latency</q-item-label>
      <q-item v-if="deviceCapabilitiesAudio.latency" class="q-pl-xs">
        <q-item-section class="q-ml-md" style="width: 100%;">
          <q-slider
            v-model="formData.latency"
            :min="Number(deviceCapabilitiesAudio.latency.min.toFixed(6))"
            :max="Number(deviceCapabilitiesAudio.latency.max.toFixed(6))"
            :step="0.000001"
            :disable="deviceCapabilitiesAudio.latency.min === deviceCapabilitiesAudio.latency.max"
            label-always
            label
            markers
            dense
            snap
            color="primary"
          />
        </q-item-section>
      </q-item>
      <q-item-label caption style="text-align: center;">
        {{ `min: ${deviceCapabilitiesAudio.latency.min}, max: ${deviceCapabilitiesAudio.latency.max}` }}
      </q-item-label>
      <q-separator spaced/>


      <q-item-label header>Channel Count</q-item-label>
      <q-item v-if="deviceCapabilitiesAudio.channelCount" class="q-pl-xs">
        <q-item-section class="q-ml-md" style="width: 100%;">
          <q-slider
            v-model="formData.channelCount"
            :min="deviceCapabilitiesAudio.channelCount.min"
            :max="deviceCapabilitiesAudio.channelCount.max"
            :step="1"
            :disable="deviceCapabilitiesAudio.channelCount.min === deviceCapabilitiesAudio.channelCount.max"
            label-always
            label
            markers
            dense
            snap
            color="primary"
          />
        </q-item-section>
      </q-item>
      <q-item-label caption style="text-align: center;">
        {{ `min: ${deviceCapabilitiesAudio.channelCount.min}, max: ${deviceCapabilitiesAudio.channelCount.max}` }}
      </q-item-label>
      <q-separator spaced/>


      <q-item-label header>Sample Rate</q-item-label>
      <q-item v-if="deviceCapabilitiesAudio.sampleRate" class="q-pl-xs">
        <q-item-section class="q-ml-md" style="width: 100%;">
          <q-slider
            v-model="formData.sampleRate"
            :min="deviceCapabilitiesAudio.sampleRate.min"
            :max="deviceCapabilitiesAudio.sampleRate.max"
            :disable="deviceCapabilitiesAudio.sampleRate.min === deviceCapabilitiesAudio.sampleRate.max"
            label
            label-always
            markers
            dense
            snap
            color="primary"
          />
        </q-item-section>
      </q-item>
      <q-item-label caption style="text-align: center;">
        {{ `min: ${deviceCapabilitiesAudio.sampleRate.min}, max: ${deviceCapabilitiesAudio.sampleRate.max}` }}
      </q-item-label>
      <q-separator spaced/>


      <q-item-label header>Sample Size</q-item-label>
      <q-item v-if="deviceCapabilitiesAudio.sampleSize" class="q-pl-xs">
        <q-item-section class="q-ml-md" style="width: 100%;">
          <q-slider
            v-model="formData.sampleSize"
            :min="deviceCapabilitiesAudio.sampleSize.min"
            :max="deviceCapabilitiesAudio.sampleSize.max"
            :disable="deviceCapabilitiesAudio.sampleSize.min === deviceCapabilitiesAudio.sampleSize.max"
            label-always
            label
            markers
            dense
            snap
            color="primary"
          />
        </q-item-section>
      </q-item>
      <q-item-label caption style="text-align: center;">
        {{ `min: ${deviceCapabilitiesAudio.sampleSize.min}, max: ${deviceCapabilitiesAudio.sampleSize.max}` }}
      </q-item-label>
      <q-separator spaced/>


    </q-list>
  </div>
</template>

<script>
  const enumValues = (values = []) => (str) => values.indexOf(str) !== -1;

  // const SAMPLE_AUDIO_CONTROL = {
  //   'type': 'audioinput',
  //   'autoGainControl': [
  //     true,
  //     false,
  //   ],
  //   'channelCount': {
  //     'max': 1,
  //     'min': 1,
  //   },
  //   'deviceId': 'default',
  //   'echoCancellation': [
  //     true,
  //     false,
  //   ],
  //   'groupId': '8babadfd948b2dcac58d2783f432a75e3b3028d44fda6d2de96cb981977099ad',
  //   'latency': {
  //     'max': 0.085333,
  //     'min': 0.002666,
  //   },
  //   'noiseSuppression': [
  //     true,
  //     false,
  //   ],
  //   'sampleRate': {
  //     'max': 48000,
  //     'min': 48000,
  //   },
  //   'sampleSize': {
  //     'max': 16,
  //     'min': 16,
  //   },
  // };
  // const SAMPLE_VIDEO_CONTROL = {
  //   'type': 'videoinput',
  //   'aspectRatio': {
  //     'max': 2592,
  //     'min': 0.00051440329218107,
  //   },
  //   'deviceId': 'a812146cc3813faed9e50d700e7859181ebd8a891129d3bd17904392b66feed2',
  //   'facingMode': [],
  //   'frameRate': {
  //     'max': 30.000030517578125,
  //     'min': 0,
  //   },
  //   'groupId': 'a41c95ed50fe63118d9d181ff9917baf654ebc9ef93028e62c7fda3496d135cd',
  //   'height': {
  //     'max': 1944,
  //     'min': 1,
  //   },
  //   'resizeMode': [
  //     'none',
  //     'crop-and-scale',
  //   ],
  //   'width': {
  //     'max': 2592,
  //     'min': 1,
  //   },
  // };


  export default {
    name: 'DeviceControls',
    props: {
      // deviceCapabilities: {
      //   type: Object,
      //   required: true,
      // },
      streamObj: {
        type: Object,
        required: true,
      },
      type: {
        type: String,
        validator: enumValues(['videoinput', 'audioinput']),
      },
      videoAspectRatios: {
        type: [Array, Number],
        default() {
          return [
            {
              label: '9:16 (Vertical video)',
              value: 9 / 16,
            },
            {
              label: '1:1 (Square)',
              value: 1,
            },
            {
              label: '4:3 standard',
              value: 4 / 3,
            },
            {
              label: '3:4 non-standard',
              value: 3 / 4,
            },
            {
              label: '16:10 standard',
              value: 16 / 10,
            },
            {
              label: '16:9 standard',
              value: 16 / 9,
            },
            {
              label: '1.85:1 (Cinema wide)',
              value: 37 / 20,
            },
            {
              label: '2:1 (RKO Superscope 18:9)',
              value: 18 / 9,
            },
            {
              label: '2.35:1 (Cinematography wide)',
              value: 64 / 27,
            },
            {
              label: '21:9 (Mobile wide)',
              value: 64 / 27,
            },
          ];
        },
      },
    },
    emits: [
      'valueChange',
    ],
    data() {
      return {
        formData: {},
      };
    },
    // computed: {
    //   deviceSettings() {
    //     return this.streamObj.stream.getTracks()
    //       .find(item => item.getSettings().deviceId === this.deviceCapabilities.deviceId)
    //       .getSettings();
    //   },
    // },
    computed: {
      deviceCapabilitiesVideo() {
        return this.streamObj.stream.getVideoTracks().find(item => item.enabled).getCapabilities();
      },
      deviceCapabilitiesAudio() {
        return this.streamObj.stream.getAudioTracks().find(item => item.enabled).getCapabilities();
      }
    },
    watch: {
      formData: {
        immediate: true,
        deep: true,
        handler(newVal) {
          this.$emit('valueChange', newVal);
        },
      },
      streamObj: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          if (newVal.stream && !this.$lisEqual(newVal, oldVal)) {
            let device = newVal.stream.getTracks()
              .find(item => item.getSettings().deviceId === (this.type === 'videoinput' ? this.deviceCapabilitiesVideo.deviceId : this.deviceCapabilitiesAudio.deviceId));
            if (device) {
              this.formData = device.getSettings();
            }
            // this.formData = newVal.stream.getTracks()
            //   .find(item => item.getSettings().deviceId === (this.type === 'videoinput' ? this.deviceCapabilitiesVideo.deviceId : this.deviceCapabilitiesAudio.deviceId))
            //   .getSettings();
          }
        },
      },
    },
    async beforeUnmount() {
      try {
        await this.streamObj.stream.getTracks()
          .find(item => item.getSettings().deviceId === (this.type === 'videoinput' ? this.deviceCapabilitiesVideo.deviceId : this.deviceCapabilitiesAudio.deviceId))
          .applyConstraints(this.formData);
      } catch (e) {
        throw Error(e);
      }
    },
    unmounted() {
      Object.keys(this.formData).forEach(key => {
        delete this.formData[key];
      });
    },
    methods: {},
  };
</script>


<style scoped lang="scss" src="./_DeviceControls.scss">

</style>
