import { getBindedViewModel, computeSize } from './helpers.js';

const RIVE_FILE = "headsWillRoll.riv";
const DEFAULT_ARTBOARD = "game";
const DEFAULT_STATEMACHINES = "gameBehavior";
const DEFAULT_CONTAINER = document.getElementById("canvas");
const DEFAULT_LAYOUT = new rive.Layout({
  fit: rive.Fit.Contain,
});

window.addEventListener(
  "resize",
  () => {
    if (riveInstance) {
      riveInstance.resizeDrawingSurfaceToCanvas();
      updateOrientationBinding();
    }
  },
  false
);

const riveInstance = new rive.Rive({
  src: RIVE_FILE,
  canvas: DEFAULT_CONTAINER,
  autoplay: true,
  autoBind: true,
  layout: DEFAULT_LAYOUT,
  artboard: DEFAULT_ARTBOARD,
  stateMachines: DEFAULT_STATEMACHINES,
  onLoad: () => {
    // initial sizing
    requestAnimationFrame(() => {
      computeSize(riveInstance);
    });

    const vmi = getBindedViewModel(riveInstance);
    if (!vmi) {
      console.warn("No viewModelInstance found");
      return;
    }

    // grab the Boolean property
    const isPortraitProp = vmi.boolean("isPortrait");
    if (!isPortraitProp) {
      console.warn("ViewModel boolean property 'isPortrait' not found");
    } else {
      // set it initially
      isPortraitProp.value = checkPortrait();
      console.log("Initial orientation:", isPortraitProp.value ? "portrait" : "landscape");

      updateOrientationBinding = () => {
        isPortraitProp.value = checkPortrait();
        console.log("Orientation updated:", isPortraitProp.value ? "portrait" : "landscape");
      };
    }

    // prevent blurry canvas by pixel ratio
    riveInstance.resizeDrawingSurfaceToCanvas();
  },
});

// check portrait vs landscape
function checkPortrait() {
  return window.innerHeight >= window.innerWidth;
}

// Make sure updateOrientationBinding is defined in outer scope
let updateOrientationBinding = () => {};
