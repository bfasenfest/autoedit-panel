if (typeof($) == 'undefined') $ = {};
$._PPP = {
	say: function(something) {
		$.writeln(something); // output to ExtendScript Toolkit Console
		alert(something); // invoke a warning popup
		return "thanks"; // return a string back to JavaScript
	},

	create_sequence: function() {
		var someID	= "xyz123";
		var seqName = prompt('Name of sequence?',	 'Some Descriptive Name', 'Sequence Naming Prompt');
		app.project.createNewSequence(seqName, someID);
		return "done"
	},

	set_source_pos: function(pos){
		app.enableQE();
		qe.source.player.startScrubbing();
		qe.source.player.scrubTo(String(pos));
		qe.source.player.endScrubbing();

		var activeSequence	= qe.project.getActiveSequence(); 	// note: make sure a sequence is active in PPro UI
		if (activeSequence) {
			activeSequence.player.startScrubbing();
			activeSequence.player.scrubTo(String(pos));
			activeSequence.player.endScrubbing();

			// Alternate
			// app.project.activeSequence.setPlayerPosition(pos * 254016000000)


			// app.sourceMonitor.play(1.0)
			// $.sleep(3000);
			// app.sourceMonitor.closeClip();

		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
		return "done"

	},



	traverse_project_items: function() {
		if (!app.project.rootItem) return "rootItem is not available";

		var file_paths = [];
		// breadth first traversal
		var stack  = [app.project.rootItem];
		while (stack.length > 0) {
			var item = stack.shift();
			if (item === undefined || item.children === undefined || item.children.numItems < 1) continue;
			var numChildren = item.children.numItems;
			for (var i = 0; i < numChildren; i++) {
				var child = item.children[i];
				switch (child.type) {
					case ProjectItemType.CLIP:
					case ProjectItemType.FILE:
						var file_path = child.getMediaPath();
						if (file_path && file_path.length > 0) {
							file_paths.push('"'+encodeURIComponent(file_path)+'"');
						}
						// do something with the file_path
						break;
					case ProjectItemType.BIN:
						stack.push(child);
						break;
				} // switch end
			}
		}
		var result = '['+file_paths.join(", ")+']';
		return result;
	},



}