
import './js/markers.js'
import './js/marker.js'
import './js/mousedisplay.js'
import './js/time-tooltip.js'

const Plugin = videojs.getPlugin('plugin');

class Chapters extends Plugin {

  constructor(player, options) {
    super(player, options);

    this.markers = options.markers
    if(!this.markers){
        this.markers = []
    }
    player.addClass('chapter-markers');
    
    player
    .getChild('ControlBar')
    .getChild('progressControl')
    .getChild('seekBar')
    .addChild('MarkersDisplay',{ 
        componentClass: 'MarkersDisplay',
    });

    this.loadedMetadata = this.loadedMetadata.bind(this);

    player.on('loadedmetadata', this.loadedMetadata);
    
  }

  addMark(markers = []) {
    if (!markers.length) return;
     

    /** @type {TextTrack} */
    const markersTrack = player.addTextTrack(
      'metadata',
      'chapter-markers',
      player.language()
    );

    markers.forEach((marker, index, arr) => {
      const nextMarkerIndex = index + 1;
      const nextMarker = arr[nextMarkerIndex];
      /** @type {{startTime: Number}} */
      const { startTime } = marker;
      /** @type {Number} */
      const endTime = nextMarker ? nextMarker.startTime : this.player().duration();
      /** @type{VTTCue} */
      const cue = {
        startTime,
        endTime,
        text: JSON.stringify(marker),
      };

      markersTrack.addCue(cue);
    });
  }


  loadedMetadata() {
    if (!this.markers.length) return;
    this.markersTrack = this.player.addTextTrack(
      'metadata',
      'chapter-markers',
      this.player.language()
    );

    this.markers.forEach((marker, index, arr) => {
      const nextMarkerIndex = index + 1;
      const nextMarker = arr[nextMarkerIndex];
      /** @type {{startTime: Number}} */
      const { startTime } = marker;
      /** @type {Number} */
      const endTime = nextMarker ? nextMarker.startTime : this.player.duration();
      /** @type{VTTCue} */
      const cue = {
        startTime,
        endTime,
        text: JSON.stringify(marker),
      };

      this.markersTrack.addCue(cue);
    });

    
  }

  dispose() {
    super.dispose();
    videojs.log('the advanced plugin is being disposed');
  }

  updateState() {
    this.setState({playing: !this.player.paused()});
  }

  logState(changed) {
    videojs.log(`the player is now ${this.state.playing ? 'playing' : 'paused'}`);
  }
}

videojs.registerPlugin('chapter', Chapters);

export default Chapters;