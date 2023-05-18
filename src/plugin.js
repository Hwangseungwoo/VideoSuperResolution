import videojs from 'video.js';
import { version as VERSION } from '../package.json';

const Plugin = videojs.getPlugin('plugin');
import { main } from './webgl.js';

// Default options for the plugin.
const defaults = {};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class SuperResolution extends Plugin {
  /**
   * Create a SuperResolution plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    this.createDemoCanvas();
    this.setupDragHandler();

    const canvas = player.$('.vjs-sr-demo');

    this.player.ready(() => {
      this.player.addClass('vjs-super-resolution');
      main(this.player, canvas, this.options);
    });
  }

  createDemoCanvas() {
    this.container = document.createElement('div');
    this.container.id = this.player.id() + '-vjs-sr-demo-container';
    this.container.className = 'vjs-sr-demo-container';

    this.container.innerHTML = `<canvas id="${this.player.id()}-vjs-sr-demo" class="vjs-sr-demo" height = "360px" width="640px"></canvas>`;

    const insertedContainer = this.player
      .el()
      .insertBefore(this.container, this.player.$('.vjs-control-bar'));
  }

  resizeContainer(leftPos) {
    this.container.setAttribute(
      'style',
      `clip-path: inset(0% 0% 0% ${leftPos}px)`
    );
  }

  setupDragHandler() {
    this.sliderHandle = document.createElement('div');
    this.sliderHandle.className = 'vjs-sr-demo-handle';
    this.player.el().insertBefore(this.sliderHandle, this.container);
    const { left } = this.sliderHandle.getBoundingClientRect();

  }
}

// Define default values for the plugin's `state` object here.
SuperResolution.defaultState = {};

// Include the version number.
SuperResolution.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('superResolution', SuperResolution);

export default SuperResolution;
