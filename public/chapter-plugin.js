(()=>{class e extends videojs.getComponent("component"){constructor(e,t={}){super(e,t),this.resetChildren=this.resetChildren.bind(this),this.loadMarkers=this.loadMarkers.bind(this),this.player().on("loadstart",this.resetChildren),this.player().on("loadeddata",this.loadMarkers),this.player().on("playerreset",this.resetChildren)}loadMarkers(){let e=Array.from(this.player().textTracks()).find(e=>"chapter-markers"===e.label);if(!e){this.addChild("marker-empty",{className:"marker-empty",componentClass:"markerDisplay",startTime:0,endTime:this.player().duration()});return}let t=e.cues_,s=videojs.computedStyle(this.el(),"gap");t.forEach((e,t,r)=>{if(this.player().duration()>startTime){if(0===t&&e.startTime>0){let t="marker-empty";this.addChild(t,{className:t,componentClass:"markerDisplay",endTime:e.startTime,gap:s,startTime:0})}let a=`marker-${t}`,i=r[t+1];this.addChild(a,{className:a,componentClass:"markerDisplay",endTime:e.endTime,gap:i?s:void 0,startTime:e.startTime})}})}addMarkers(e=[]){let t=videojs.dom.computedStyle(this.el(),"gap");e.forEach((e,s,r)=>{if(0===s&&e.startTime>0){let s="marker-empty";this.addChild(s,{className:s,componentClass:"markerDisplay",endTime:e.startTime,gap:t,startTime:0})}let a=`marker-${s}`,i=r[s+1];this.addChild(a,{className:a,componentClass:"markerDisplay",endTime:e.endTime,gap:i?t:void 0,startTime:e.startTime})})}resetChildren(){this.children().forEach(e=>{e.dispose()}),this.children_=[],videojs.dom.emptyEl(this.el())}buildCSSClass(){return`cst-markers ${super.buildCSSClass()}`.trim()}createEl(){return videojs.dom.createEl("div",{className:this.buildCSSClass()})}updateTextContent(e){"string"!=typeof e&&(e="Title Unknown"),videojs.emptyEl(this.el()),videojs.appendContent(this.el(),e)}dispose(){this.player().off("loadstart",this.resetChildren),this.player().off("loadeddata",this.loadMarkers),this.player().off("playerreset",this.resetChildren),this.resetChildren(),super.dispose()}}videojs.registerComponent("MarkersDisplay",e);class t extends videojs.getComponent("component"){constructor(e,t){super(e,t);let{gap:s}=t;this.updateMarkerPlayed=this.updateMarkerPlayed.bind(this),this.updateMarkerBuffered=this.updateMarkerBuffered.bind(this),this.setMarkerWidth(this.markerWidth(),s),this.player().on("timeupdate",this.updateMarkerPlayed),this.player().on("progress",this.updateMarkerBuffered)}setMarkerWidth(e,t){let s=void 0!==t?`width: calc(${e}% - ${t})`:`width: ${e}%`;this.setAttribute("style",s)}markerWidth(){let{endTime:e,startTime:t}=this.options();return(e-t)/this.player().duration()*100}updateMarker(e=0,t){if(!this.parentComponent_.el().getClientRects().length)return;let s=this.player().duration(),r=this.parentComponent_.el().getClientRects()[0].width,a=this.el().offsetLeft,i=this.el().offsetWidth,l=s*a/r,d=s*(a+i)/r;e>d&&this.el().style.setProperty(t,"200%"),e<l&&this.el().style.setProperty(t,"0%"),e>=l&&e<=d&&this.el().style.setProperty(t,`${100*Math.abs((e-l)/(l-d))}%`)}updateMarkerBuffered(){this.updateMarker(this.player().bufferedEnd(),"--_cst-marker-buffered")}updateMarkerPlayed(){this.updateMarker(this.player().currentTime(),"--_cst-marker-played")}buildCSSClass(){return`cst-marker ${super.buildCSSClass()}`.trim()}createEl(){return super.createEl("div",{className:this.buildCSSClass()})}dispose(){this.player().off("timeupdate",this.updateMarkerPlayed),this.player().off("progress",this.updateMarkerBuffered),super.dispose()}}videojs.registerComponent("MarkerDisplay",t);class s extends videojs.getComponent("MouseTimeDisplay"){constructor(e,t){super(e,videojs.mergeOptions({children:[{componentClass:"timeTooltipMarker",name:"timeTooltip"}]},t))}markers(){let[e={cues:{}}]=Array.from(this.player().textTracks()).filter(({label:e})=>"chapter-markers"===e);return e&&Array.from(e.cues)||[]}update(e,t){let s=t*this.player_.duration(),{text:r="{}"}=this.markers().findLast(e=>s>=e.startTime)||{},{label:a}=JSON.parse(r);this.getChild("timeTooltip").updateTime(e,t,s,()=>{let s=e.width,r=s*t,a=parseFloat(videojs.computedStyle(this.el().firstChild,"width")),i=r+a/2;if(this.el().style.transform=`translateX(${r}px)`,(!(i>=a)||!(i<=s)||0!==this.getChild("timeTooltip").el().style.length)&&!(a>s)){if(i>=a&&i<=s&&this.getChild("timeTooltip").el().style.length){this.getChild("timeTooltip").el().style="";return}i>=s&&(this.getChild("timeTooltip").el().style.transform=`translateX(calc(-50% - ${Math.abs(s-i)}px))`),i<=a&&(this.getChild("timeTooltip").el().style.transform=`translateX(calc(-50% + ${Math.abs(Math.abs(i-a))}px))`)}},a)}buildCSSClass(){return`vjs-simple-markers ${super.buildCSSClass()}`.trim()}createEl(){return super.createEl()}}videojs.registerComponent("MouseTimeDisplay",s);class r extends videojs.getComponent("TimeTooltip"){update(e){this.write(e)}updateTime(e,t,s,r,a){this.requestNamedAnimationFrame("TimeTooltip#updateTime",()=>{let e;let i=this.player_.duration();if(this.player_.liveTracker&&this.player_.liveTracker.isLive()){let s=this.player_.liveTracker.liveWindow(),r=s-t*s;e=(r<1?"":"-")+videojs.formatTime(r,s)}else e=videojs.formatTime(s,i);a&&(e=`${a} (${e})`),this.update(e),r&&r()})}}videojs.registerComponent("TimeTooltipMarker",r);let a=videojs.getPlugin("plugin");videojs.registerPlugin("chapter",class extends a{constructor(e,t){super(e,t),this.markers=t.markers,this.markers||(this.markers=[]),e.addClass("chapter-markers"),e.getChild("ControlBar").getChild("progressControl").getChild("seekBar").addChild("MarkersDisplay",{componentClass:"MarkersDisplay"}),this.loadedMetadata=this.loadedMetadata.bind(this),e.on("loadedmetadata",this.loadedMetadata)}addMark(e=[]){if(!e.length)return;let t=player.addTextTrack("metadata","chapter-markers",player.language());e.forEach((e,s,r)=>{let a=r[s+1],{startTime:i}=e,l={startTime:i,endTime:a?a.startTime:this.player().duration(),text:JSON.stringify(e)};t.addCue(l)})}loadedMetadata(){this.markers.length&&(this.markersTrack=this.player.addTextTrack("metadata","chapter-markers",this.player.language()),this.markers.forEach((e,t,s)=>{let r=s[t+1],{startTime:a}=e,i={startTime:a,endTime:r?r.startTime:this.player.duration(),text:JSON.stringify(e)};this.markersTrack.addCue(i)}))}dispose(){super.dispose(),videojs.log("the advanced plugin is being disposed")}updateState(){this.setState({playing:!this.player.paused()})}logState(e){videojs.log(`the player is now ${this.state.playing?"playing":"paused"}`)}})})();
//# sourceMappingURL=chapter-plugin.js.map