import tabNavbar from './common/atoms/tabNavbar/tabNavbar.vue';
import tabStepper from './common/atoms/tabStepper/tabStepper.vue';
import draggableResizable from './common/atoms/draggableResizable/draggableResizable.vue';
import flipHoverCard from './common/atoms/flipHoverCard/flipHoverCard';
import cornerDetailsCard from './common/atoms/cornerDetailsCard/cornerDetailsCard';
import flipClickCard from './common/atoms/flipClickCard/flipClickCard';
import videoRecorder from './common/atoms/videoRecorder/videoRecorder.vue';
import videos from './common/atoms/videos/videos.vue';
import media from './common/molecules/media/media.vue';
import PhotoBtn from './common/atoms/PhotoBtn/PhotoBtn.vue';
import newMedia from './common/substance/media/media.vue';
import carousel from './common/atoms/carousel/carousel';
import dddCarousel from './dddCarousel/dddCarousel';
import ProgrCom from './ProgrCom';
import ToggleMe from './common/atoms/ToggleMe/ToggleMe.vue';
import SSelect from './common/atoms/SSelect';
import DbSelect from './common/atoms/search/DbSelect';
import FDataTable from './common/molecules/feathers/FDataTable/FDataTable';
import VueGroupAvatar from './common/atoms/avatars/VueGroupAvatar/VueGroupAvatar';
import VueAvatar from './common/atoms/avatars/VueGroupAvatar/VueAvatar';

export {
  tabNavbar,
  tabStepper,
  draggableResizable,
  flipHoverCard,
  cornerDetailsCard,
  flipClickCard,
  videoRecorder,
  videos,
  media,
  PhotoBtn,
  newMedia,
  carousel,
  dddCarousel,
  ProgrCom,
  ToggleMe,
  SSelect,
  DbSelect,
  FDataTable,
  VueGroupAvatar,
  VueAvatar,
};

// const requireModules = require.context(
//   // The path where the service modules live
//   'src/components/formGeneratorCustom',
//   // Whether to look in subfolders
//   true,
//   // Only include .js files (prevents duplicate imports`)
//   /.vue$/
// );
// requireModules.keys().map(modulePath => {
//   const componentName = this.$lupperFirst(
//     this.$lcamelCase(
//       // Gets the file name regardless of folder depth
//       modulePath
//         .split('/')
//         .pop()
//         .replace(/\.\w+$/, '')
//     )
//   );
//   this.$options.components[componentName] = requireModules(modulePath).default;
// });

// fs.readdir('./someDir', (err, files) => {
//   files.forEach(file => {
//     const module = import('./' + file).then(m =>
//       m.callSomeMethod();
//   );
//     // or const module = await import('file')
//   });
// });
