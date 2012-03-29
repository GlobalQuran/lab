jQuery(function () {
	
	// selection info here
	sel = {
		x:'',
		y:'',
		start: null,
		end: null,
		position: null,		
		length: null,
		id: null,
		verse: null,
		text: null
	};
	
	tool = {
		hover: true,
		ayahs: {}, // ayahs to update on server side
		
		buck2tajweed: function (surah, ayah, buck)
		{
			//return gq.quran.parse.buck2arabic(buck);
			var tajweed = {1: 'silent', 2: 'ghunnah', 3: 'np', 4: 'pp', 5: 'op', 6: 'np', 7: 'ep', 8: 'unrest'};
			var arabic = '', l, letter, found=false, open=false, openTag; 
		   
			wordArray = buck.split(' ');
		    arabic = '';
		    $.each(wordArray, function(i, word) {
		    	
		    	arabic += '<word data-id="'+Quran.word.number(surah, ayah, i+1)+'">';
		    	letterArray = word.split('');
		    	
		    	for(l=0; l<letterArray.length; ++l)
			    {
			        letter = letterArray[l];
			        found = false;
			        
			        if (tajweed[letter] != null)
			        {
			        	if (open)
			        	{
			        		if (letterArray > l)
			        			arabic += '&zwj;';
			        		arabic += '</'+openTag+'>';
			        		if (letterArray > l)
			        			arabic += '&zwj;';
			        	}
			        	
			        	openTag = tajweed[letter];
			        	if (l > 0)
			        		arabic += '&zwj;';
			        	arabic += '<'+openTag+'>';
			        	if (l > 0)
			        		arabic += '&zwj;';
			        	open = true;
			        	continue;
			        }
			        else if (letter == '0')
			        {
			        	if (open)
			        	{
			        		arabic += '&zwj;</'+openTag+'>&zwj;';
			        		open = false;
			        	}
			        	
			        	continue;
			        }
			        
			        for(n=1; n<Quran._data.buck.length; ++n)
			        {
			            if(letter == Quran._data.buck[n])
			            {
			            	arabic += Quran._data.char[n];
			            	found = true;
			                break;
			            }
			        }
			        
			        if (!found)
			        	arabic += letter;
			    }
		    	
	    	   	if (open)
	        	{
	        		arabic += '</'+openTag+'>';
	        		open = false;
	        	}        
		    	
		    	arabic += '</word> ';
		    });
		    
		    return arabic;
		},
		
		tajweed2buck: function (tajweedHtml)
		{},
		
		addTag: function (tajweedId)
		{			
			var tajweed = {1: 'silent', 2: 'ghunnah', 3: 'np', 4: 'pp', 5: 'op', 6: 'np', 7: 'ep', 8: 'unrest'};
			
			if (!tajweed[tajweedId])
				return null;
						
			var tag = tajweed[tajweedId];
			
			text = '&zwj;<'+tag+'>&zwj;'+sel.text+'&zwj;</'+tag+'>&zwj;';
			this.replaceSelection(text);
			
			this.ayahs[sel.verse] = sel.verse;
		},
		
		removeTag: function ()
		{},
		
		editText: function (addCode)
		{
			textArray = gq.quran.parse.arabic2buck(sel.text).split(' ');
			editedText = {};
			startId = sel.start;
			// build selected text array first
			for (i=0; i<=textArray.length; i++)
			{
				editedText[startId] = textArray[i];
				startId++;
			}
			
			startId = sel.start; // reset start id
			
			verseNo = Quran.verseNo.word(sel.start);
			verse   = Quran.ayah.fromVerse(verseNo);
			
			buck = gq.data.quran[gq.quran.selectedString()][verseNo];
			buckArray = buck.split(' ');			
			buckAyahText = '';
			
			
			for (i=0; i <= buckArray.length; i++)
			{
				id = Quran.word.number(verse.surah, verse.ayah, i+1);
				
				if (id >= sel.start && id <= sel.end)
				{
					orignalLetterCount = buckArray[i].split('').length;
					editedLetterCount  = editedText[id].split('').length;
					
					
					
					
				}
				else
				{
					buckAyahText += buckArray[i];
				}
			}
		},
		
		getSelection: function ()
		{
		    var selection, position;
		    
		    if (window.getSelection) {
		        selection = window.getSelection();
		        
		        if (selection && !selection.isCollapsed) {
		            position = {
		                'offset': selection.anchorOffset,
		                'length': selection.toString().length,
		                'node': selection.anchorNode.parentNode,
		                'text': selection.toString()
		            };
		        }
		    } else if (document.selection) {
		        selection = document.selection.createRange();
		        
		        if (selection && selection.text.length) {
		            var text = selection.parentElement().innerText,
		                range = document.body.createTextRange(),
		                last = 0, index = -1;
		            
		            range.moveToElementText(selection.parentElement());
		            
		            while ((index = text.indexOf(selection.text, ++index)) !== -1) {
		                range.moveStart('character', index - last);
		                last = index;
		                
		                if (selection.offsetLeft == range.offsetLeft && selection.offsetTop == range.offsetTop) {
		                    break;
		                }
		            }
		            
		            position = {
		                'offset': index,
		                'length': selection.text.length,
		                'node': selection.parentElement(),
		                'text': selection.text
		            };
		        }
		    }
		    
		    return position;
		},
		
		replaceSelection: function (html)
		{
		    var sel, range, node;

		    if (typeof window.getSelection != "undefined") {
		        // IE 9 and other non-IE browsers
		        sel = window.getSelection();

		        // Test that the Selection object contains at least one Range
		        if (sel.getRangeAt && sel.rangeCount) {
		            // Get the first Range (only Firefox supports more than one)
		            range = window.getSelection().getRangeAt(0);
		            range.deleteContents();

		            // Create a DocumentFragment to insert and populate it with HTML
		            // Need to test for the existence of range.createContextualFragment
		            // because it's non-standard and IE 9 does not support it
		            if (range.createContextualFragment) {
		                node = range.createContextualFragment(html);
		            } else {
		                // In IE 9 we need to use innerHTML of a temporary element
		                var div = document.createElement("div"), child;
		                div.innerHTML = html;
		                node = document.createDocumentFragment();
		                while ( (child = div.firstChild) ) {
		                    node.appendChild(child);
		                }
		            }
		            range.insertNode(node);
		        }
		    } else if (document.selection && document.selection.type != "Control") {
		        // IE 8 and below
		        range = document.selection.createRange();
		        range.pasteHTML(html);
		    }
		}
	};
	
	
	$('word').live('hover', function() {
		
		if ((!tool.hover && !$(this).hasClass('selectedWord')) || $(this).attr('id'))
			return;
		
		$('#selectedWord').attr('data-id', $(this).attr('data-id'));
		$('#selectedWord').html($(this).html());
		
		text = $(this).html().split('').join(' ');
		$('#selectedWordLetters').attr('data-id', $(this).attr('data-id'));
		$('#selectedWordLetters').html(text);
		
	}).live('dblclick', function() {
		if (!tool.hover && !$(this).hasClass('selectedWord'))
			;
		else 
			tool.hover = tool.hover ? false : true;
		
		$('word').removeClass('selectedWord');
					
		if (!tool.hover)
			$(this).addClass('selectedWord');
		
		$(this).trigger('mouseenter');


		// Code for Deselect Text When Mouseout the Code Area
		if (window.getSelection)
		{
			if (window.getSelection().empty)
			{ // Chrome
				window.getSelection().empty();
			}
			else
				if (window.getSelection().removeAllRanges)
				{ // Firefox
					window.getSelection().removeAllRanges();
				}
		}
		else
			if (document.selection)
			{ // IE?
				document.selection.empty();
			}
	});

	
	$('.ayah').live('mouseup', function(event) {
		
		selection = tool.getSelection();
		if (!selection)
		{
			sel.length = null;
			sel.position = null;
			sel.start = null;
			sel.end = null;
			sel.text = null;
			sel.id = null;
			return false;
		}
		sel.length = selection.length;
		sel.position = selection.offset;
		sel.text = selection.text;
		sel.verse = $(this).data('verse');
		
		sel.id = $(this).attr('id');
		sel.end = $(this).data('id');
	    
		// if selection was left to right multi-words
		if (sel.start > sel.end)
	    {
	    	sel.end = sel.start;
	    	sel.start = $(this).data('id');
	    	str  = $(this).text();
	    	sel.position = sel.position - sel.length;
	    	if (sel.position < 0)
	    		sel.position = 0;
	    }
		else if (event.pageX > sel.x) // if selection was left to right single word 
		{
			//console.log('pos '+sel.position+' str '+str.split('').length);
	    	sel.position = sel.position - sel.length;
	    	if (sel.position < 0)
	    		sel.position = 0;
		}
		//console.log('pos '+sel.position+ ' len: '+sel.length);
	    
	    
	    //sel.text = //getSelectedText();//(sel.id == 'selectedWordLetters') ? getSelectedText().replace(/\s+/g, '') : getSelectedText();
	    
	}).live('mousedown', function(event){
	    //sel.start = $(event.target).data('id');
	    sel.x = event.pageX;
	    sel.y = event.pageY;
	});
	
	$('.twb').click(function() {
		
		id = $(this).data('id');
		
		if (id == 'remove')
			tool.removeTag();
		else
			tool.addTag(id);
		
		return false;
	});
});