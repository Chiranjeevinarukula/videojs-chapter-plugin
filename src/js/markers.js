// import videojs from 'video.js';

/**
 * A class representing the markers display.
 *
 * This component is designed to be used inside the `SeekBar` component.
 *
 * @class MarkersDisplay
 * @extends videojs.getComponent('component')
 */
class MarkersDisplay extends videojs.getComponent('component') {
   // The constructor of a component receives two arguments: the
  // player it will be associated with and an object of options.
  constructor(player, options = {}) {

    // It is important to invoke the superclass before anything else, 
    // to get all the features of components out of the box!
    super(player, options);
    this.resetChildren = this.resetChildren.bind(this);
    this.loadMarkers = this.loadMarkers.bind(this);

    this.player().on('loadstart', this.resetChildren);
    this.player().on('loadeddata', this.loadMarkers);
    this.player().on('playerreset', this.resetChildren);
  }
  loadMarkers() {
    /** @type {videojs.TextTrack} */
    const markersTrack = Array.from(this.player().textTracks()).find(
      (track) => track.label === 'chapter-markers'
    );

    if (!markersTrack) {
      this.addChild('marker-empty', {
        className: 'marker-empty',
        componentClass: 'markerDisplay',
        startTime: 0,
        endTime: this.player().duration(),
      });
      return ;
    }

    const markers = markersTrack.cues_;
    const gap = videojs.dom.computedStyle(this.el(), 'gap');

    markers.forEach((marker, index, arr) => {
      if (index === 0 && marker.startTime > 0) {
        const name = 'marker-empty';

        this.addChild(name, {
          className: name,
          componentClass: 'markerDisplay',
          endTime: marker.startTime,
          gap: gap,
          startTime: 0,
        });
      }

      const name = `marker-${index}`;
      const hasNextMarker = arr[index + 1];

      this.addChild(name, {
        className: name,
        componentClass: 'markerDisplay',
        endTime: marker.endTime,
        gap: hasNextMarker ? gap : undefined,
        startTime: marker.startTime,
      });
    });
    
    
    // this.addMarkers(markersTrack.cues_);
  }

  addMarkers(markers = []) {
    const gap = videojs.dom.computedStyle(this.el(), 'gap');

    markers.forEach((marker, index, arr) => {
      if (index === 0 && marker.startTime > 0) {
        const name = 'marker-empty';

        this.addChild(name, {
          className: name,
          componentClass: 'markerDisplay',
          endTime: marker.startTime,
          gap: gap,
          startTime: 0,
        });
      }

      const name = `marker-${index}`;
      const hasNextMarker = arr[index + 1];

      this.addChild(name, {
        className: name,
        componentClass: 'markerDisplay',
        endTime: marker.endTime,
        gap: hasNextMarker ? gap : undefined,
        startTime: marker.startTime,
      });
    });
  }

  resetChildren() {
    this.children().forEach((/**@type {import('./marker-display.js').default}*/ child) => {
      child.dispose();
    });

    this.children_ = [];

    videojs.dom.emptyEl(this.el());
  }

  buildCSSClass() {
    return `cst-markers ${super.buildCSSClass()}`.trim();
  }

  // The `createEl` function of a component creates its DOM element.
  createEl() {
    return videojs.dom.createEl('div', {
        className: this.buildCSSClass(),
      });
  }

  // This function could be called at any time to update the text 
  // contents of the component.
  updateTextContent(text) {

    // If no text was provided, default to "Title Unknown"
    if (typeof text !== 'string') {
      text = 'Title Unknown';
    }

    // Use Video.js utility DOM methods to manipulate the content
    // of the component's element.
    videojs.emptyEl(this.el());
    videojs.appendContent(this.el(), text);
  }

  dispose() {
    this.player().off('loadstart', this.resetChildren);
    this.player().off('loadeddata', this.loadMarkers);
    this.player().off('playerreset', this.resetChildren);
    this.resetChildren();

    super.dispose();
  }
}

export default videojs.registerComponent('MarkersDisplay', MarkersDisplay);
