// import {v4 as uuidv4} from 'uuid';

const $lcamelCase = require('lodash/camelCase');

export default function (
  {
    name,
    // query = {},
    // params = {},
    // hash = {},
  } = {}) {
  const prefix = $lcamelCase(name);
  const DEVICE_TEMPLATE = {
    active: false,
    video: null,
    audio: null,
    speaker: null,
  };

  let mixin = {
    props: {
      streamObj: {
        type: Object,
        required: false,
        default() {
          return null;
        }
      },

    },
    data() {
      return {
        stream: null,
        devices: [],
        selected: Object.assign({}, DEVICE_TEMPLATE),
        canEnumerate: false,
        isHTTPs: (location.protocol === 'https:'),
        hasMicrophone: false,
        hasSpeakers: false,
        hasWebcam: false,
        isMicrophoneAlreadyCaptured: false,
        isWebcamAlreadyCaptured: false,
      };
    },
    computed: {
      [`${prefix}ActiveSelected`]: function () {
        return this.selected.find(item => item.active);
      },
      [`${prefix}VideoDevices`]: function () {
        return this.devices.filter(dev => dev.kind === 'videoinput');
      },
      [`${prefix}AudioDevices`]: function () {
        return this.devices.filter(dev => dev.kind === 'audioinput');
      },
      [`${prefix}SpeakerDevices`]: function () {
        return this.devices.filter(dev => dev.kind === 'audiooutput');
      },
    },
    watch: {},
    async mounted() {
      try {
        if (navigator && navigator.mediaDevices) {
          navigator.mediaDevices.addEventListener('devicechange', this[`${prefix}LoadDevices`].bind(this));
          this[`${prefix}LoadDevices`]();
        }

        await this[`${prefix}CheckDeviceSupport`](function () {
          if (this.hasWebcam && this.hasMicrophone) {
            if (!this.isMicrophoneAlreadyCaptured) {
              // TODO: we actually want to act only if false ... get default mic
            }
            if (!this.isWebcamAlreadyCaptured) {
              // TODO: we actually want to act only if false ... select a (first) camera
            }
          }
        });

        // TODO: first check if stream prop already exists - need to verify this
        if (this.streamObj) {
          this.stream = Object.assign({}, this.streamObj);
        }
        if (!this.stream) {
          try {
            this.stream = await this[`${prefix}CreateStream`](this.getConstraints(this.selected));
          } catch (error) {
            self.$emit('error', error);
            throw Error(error);
          }
        }
      } catch (error) {
        self.$emit('error', error);
        throw Error(error);
      }
    },
    unmounted() {
      if (navigator && navigator.mediaDevices) {
        navigator.mediaDevices.removeEventListener('devicechange', this[`${prefix}LoadDevices`].bind(this));
      }
    },
    methods: {
      // TODO: need to add method getConstraints()


      [`${prefix}CheckDeviceSupport`]: async function (callback) {
        let self = this;

        if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
          self.canEnumerate = true;
        } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
          self.canEnumerate = true;
        }
        if (!self.canEnumerate) {
          return;
        }

        if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
          navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
        }

        if (!navigator.enumerateDevices && navigator.enumerateDevices) {
          navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
        }

        if (!navigator.enumerateDevices) {
          if (callback) {
            callback();
          }
          return;
        }

        self.devices = [];
        navigator.enumerateDevices(function(_devices) {
          _devices.forEach(function(_device) {
            let device = {..._device};

            if (device.kind === 'audio') {
              device.kind = 'audioinput';
            }

            if (device.kind === 'video') {
              device.kind = 'videoinput';
            }

            /*
              skip
              depending on the browser and browser version ..we have to setup an early exit (skip)
              if we have everything we can do
            */
            let skip;
            self.devices.forEach(function(d) {
              if (d.id === device.id && d.kind === device.kind) {
                skip = true;
              }
            });

            if (skip) {
              return;
            }

            // skip=false ...keep working to get device setup
            if (!device.deviceId) {
              device.deviceId = device.id;
            }

            if (!device.id) {
              device.id = device.deviceId;
            }

            if (!device.label) {
              device.label = 'Please invoke getUserMedia once.';
              if (!self.isHTTPs) {
                device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.';
              }
            } else {
              if (device.kind === 'videoinput' && !self.isWebcamAlreadyCaptured) {
                self.isWebcamAlreadyCaptured = true;
              }

              if (device.kind === 'audioinput' && !self.isMicrophoneAlreadyCaptured) {
                self.isMicrophoneAlreadyCaptured = true;
              }
            }

            if (device.kind === 'audioinput') {
              self.hasMicrophone = true;
            }

            if (device.kind === 'audiooutput') {
              self.hasSpeakers = true;
            }

            if (device.kind === 'videoinput') {
              self.hasWebcam = true;
            }

            // there is no 'videoouput' in the spec.

            self.devices.push(device);
          });

          if (callback) {
            callback();
          }
        });
      },


      [`${prefix}LoadDevices`]: async function (variable = 'devices') {
        let self = this;
        self.devices = new Array(0);
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          // TODO: expand warning object with more detail
          let warning = {
            message: 'navigator.mediaDevices (enumerateDevices) not supported.',
          };
          console.warning(warning.message);
          self.$emit('warning', warning);
          return;
        }

        // List cameras and microphones and speakers.
        try {
          let metadata;
          await this[`${prefix}GetDevices`]()
            .filter(item => ['audioinput', 'audiooutput', 'videoinput'].indexOf(item.kind) !== -1)
            // remove default devices
            // .filter(item => {
            //   return self.mediaTypes.includes(item.kind) && item.deviceId !== 'default';
            // })
            .forEach((device) => {
              switch (device.kind) {
                case 'audioinput':
                  metadata = {
                    value: device.deviceId,
                    label: device.label || `audio ${self[`${prefix}AudioDevices`].length + 1}`,
                    type: 'audio',
                  };
                  break;
                case 'audiooutput':
                  metadata = {
                    value: device.deviceId,
                    label: device.label || `speaker ${self[`${prefix}SpeakerDevices`].length + 1}`,
                    type: 'speaker',
                  };
                  break;
                case 'videoinput':
                  metadata = {
                    value: device.deviceId,
                    label: device.label || `video ${self[`${prefix}VideoDevices`].length + 1}`,
                    type: 'video',
                  };
                  break;
              }
              self[variable].push({
                ...device,
                ...metadata,
              });
            });
        } catch (error) {
          self.$emit('error', error);
          throw Error(error);
        }

      },
      [`${prefix}GetDevices`]: async function () {
        try {
          return await navigator.mediaDevices.enumerateDevices();
        } catch (error) {
          this.$emit('error', error);
          throw Error(error);
        }
      },
      [`${prefix}LegacyGetDevices`]: async function () {
        return (constraints) => {
          let getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia ||
            navigator.oGetUserMedia;
          // Some browsers just don't implement it - return a rejected promise with an error
          // to keep a consistent interface
          if (!getUserMedia) {
            return Promise.reject(
              new Error('getUserMedia is not implemented in this browser')
            );
          }
          // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      },
      [`${prefix}CreateStream`]: async function (constraints) {
        let self = this;

        if (self.resolution) {
          constraints.video.height = self.resolution.height;
          constraints.video.width = self.resolution.width;
        }
        try {
          return await navigator.mediaDevices.getUserMedia(constraints);
        } catch (error) {
          self.$emit('error', error);
          throw Error(error);
        }
      },

    },
  };

  return mixin;
};
