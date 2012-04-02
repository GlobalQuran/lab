/**
 * Layout object contains all the visual functionalities of the site.
 * if you want to change any html functionality, then this is the object you should be looking into. 
 * @author Basit (i@basit.me || http://Basit.me)
 * 
 * Online Quran Project
 * http://GlobalQuran.com/
 *
 * Copyright 2011, imegah.com
 * Simple Public License (Simple-2.0)
 * http://www.opensource.org/licenses/Simple-2.0
 * 
 */

var layout = {
	
	quranContent: '#quranContentArea',
	pageTitle: '', // if left empty, it will get html title - surah title will be prepended with this title
	scrollOffset: -100,
	
	beforeLoad: function () {},
	afterLoad: function () {},
	beforeDisplay: function () {},
	afterDisplay: function () {},
	beforePlay: function () {},
	afterPlay: function () {},
	beforePause: function () {},
	afterPause: function () {},
	beforeAyahChanged: function () {},
	afterAyahChanged: function () {},
	
	init: function ()
	{
		this.beforeLoad();
		
		$('#gqMain').show();
		
		if ($.browser.msie && $.browser.version < 8)
			$('#recitor, #nextAyah, #prevAyah, #progressBar, #time, #bandwidthOption, #volume, #repeat').show(); //ie fix
		
		if (gq.player.isOS())
			$('#time > .sep, .totalTime, .audioDelay').hide();
		
		$('#quranSideBar').hide();
		$('#searchSideBar').hide();
				
		gq.layout.displayStartup = function (success)
		{
			layout.displayStartup(success);
			
			if (gq.player.status().noVolume)
				$('#volume').hide();
		};
		gq.layout.display = function (success)
		{
			if (gq.noData)
				layout.playerOnly(success);
			else
				layout.display(success);
		};
		gq.layout.ayahChanged = function ()
		{
			layout.ayahChanged();
		};
		gq.layout.volume = function (value)
		{
			layout.volume(value);
		};
		gq.layout.play = function ()
		{
			layout.play();
		};
		gq.layout.stop = function ()
		{
			layout.stop();
		};
		gq.layout.recitorList = function ()
		{
			layout.recitorList();
		};
		
		gq.init();
		gq.load(); // display default languages
		this.binds();
		this.afterLoad();
	},
	
	loading: function () {}, //TODO
	unLoading: function () {}, //TODO
	
	_autoScroll: false,
	
	displayStartup: function (success)
	{		
		if (this.pageTitle == '')
			this.pageTitle = $('title').html();

		if (gq.surah() != 1 || gq.ayah() != 1)
			this._autoScroll = true;
		
		this.recitorList();
		this.quranList();
		this.translationList(false, ($('#languageSearch').val() != $('#languageSearch').attr('placeholder')) ? $('#languageSearch').val() : '');
		this.surahList();
		this.volume(gq.settings.volume, gq.settings.muted);
		this.repeat(gq.settings.repeat, true);
		this.fullScreen(gq.settings.fullScreen);
		this.fontSize(false, gq.settings.fontSize);
		this.quranFontSettings();
		this.display(success);
	},
	
	playerOnly: function () // this function runs only, if gq.noData was true. will show player only 
	{
		this.ayahChanged();
	},
	
	display: function (success)
	{
		this.beforeDisplay();
		
		if (!gq.search.isActive())
			$('#search').val('');
		
		if (gq.search.isActive())
			this.searchView();
		else if (gq.quran.length() == 1)
			this.singleView(gq.quran.text());
		else if (gq.quran.length() == 2 && gq.settings.view == 'book')
			this.bookView(gq.quran.text());
		else
			this.listView(gq.quran.text());
		
		this.ayahChanged(); // change the values to selected ayah
		this.unLoading();
		
		// tajweed helper
		if (gq.quran.isSelected('quran-tajweed'))
		{
			$('.tajweedQuickHelp').removeClass('hide');
			
			if (!$.browser.mozilla)
				this.message('error', 'Tajweed fonts best displayed in <a href="http://FireFox.com">FireFox</a> browser.');
		}
		else if (!$('.tajweedQuickHelp').hasClass('hide'))
		{
			$('.tajweedQuickHelp').addClass('hide');
		}
		
		// book view button
		if (gq.quran.length() == 2)
			$('.book').show();
		else
			$('.book').hide();
		
		this._autoScroll = true;
		this.afterDisplay();
	},
	
	singleView: function(quranArray)
	{
		
		$(layout.quranContent).html('');
		$(layout.quranContent).removeClass('list').removeClass('book').removeClass('search').addClass('single');
		$('#playerNavBox').show();
		$('#searchInfoBox').hide();
		$('#quranSideBar').show();
		$('#searchSideBar').hide();
		
		var head = '';
		var body = '';
		var lastSurahTitle = '';
		
		$.each(quranArray, function(quranBy, text)
		{
			quranClass = (quranBy != 'quran-wordbyword' && quranBy != 'quran-kids' && gq.quran.detail(quranBy).type == 'quran') ?  'quranText' : '';
			fontFamily = (gq.quran.detail(quranBy).type == 'quran') ?  "style=\"font-family: '"+gq.font.getFamily(quranBy)+"';\"" : '';
			direction = (gq.quran.direction(quranBy) == 'right') ? 'rtl' : 'ltr';
			head += '<div class="ayahs '+direction+'" dir="'+direction+'">';
			$.each(text, function(verseNo, val)
			{
				if (val.ayah == 1 && lastSurahTitle != val.surah)
				{	
					if (body)
					{
						$(layout.quranContent).append(head+body+'</div><div class="hr"><hr /></div>');
						body = '';
					}
					
					$(layout.quranContent).append(layout.getSurahTitle(val.surah, val.ayah));
					lastSurahTitle = val.surah;
				}
				
				body += '<p class="ayah '+val.surah+'-'+val.ayah+'" '+fontFamily+'><span class="'+quranClass+'">'+layout.verseParse(quranBy, val.verse, val)+'</span> <span class=tipsWord title="&lt;span class=hotlink&gt;&lt;span class=ayah data-verse='+verseNo+'&gt;Related verses to this one.<BR><BR><BR>&lt;/span&gt;&lt;/span&gt;"><a href="'+gq.url.hashless()+'#!/'+quranBy+'/'+val.surah+':'+val.ayah+'" class="ayahNumber" data-verse="'+verseNo+'"><span class="icon leftBracket"> </span>'+val.ayah+'<span class="icon rightBracket"> </span></a></span></p>';
			});
			body += '</div><div class="hr"><hr /></div>';
		});
		
		
		$(layout.quranContent).append(head+body);
	},
	
	bookView: function (quranArray)
	{
		$(this.quranContent).html('');
		$(layout.quranContent).removeClass('list').removeClass('single').removeClass('search').addClass('book');
		$('#playerNavBox').show();
		$('#searchInfoBox').hide();
		$('#quranSideBar').show();
		$('#searchSideBar').hide();
		
		$('a.book').addClass('active');
		
		var colume = '';
		var head = '';
		var body = '';
		var lastSurahTitle = '';
		
		// loop this for putting quran on right
		$.each(quranArray, function(quranBy, text)
		{
			body = '';
			lastSurahTitle = '';
			
			if (gq.quran.detail(quranBy).type != 'quran')
				return true;
			
			colume += '<div class="colume">';
			
			quranClass = (quranBy != 'quran-wordbyword' && quranBy != 'quran-kids' && gq.quran.detail(quranBy).type == 'quran') ?  'quranText' : '';
			fontFamily = (gq.quran.detail(quranBy).type == 'quran') ?  "style=\"font-family: '"+gq.font.getFamily(quranBy)+"';\"" : '';
			direction = (gq.quran.direction(quranBy) == 'right') ? 'rtl' : 'ltr';
			head = '<div class="ayahs '+direction+'" dir="'+direction+'">';
			
			$.each(text, function(verseNo, val)
			{
				if (val.ayah == 1 && lastSurahTitle != val.surah)
				{	
					if (body)
					{
						colume += head+body+'</div><div class="hr"><hr /></div>';
						body = '';
					}
					
					colume += layout.getSurahTitle(val.surah, val.ayah);
					lastSurahTitle = val.surah;
				}
				
				body += '<p class="ayah '+val.surah+'-'+val.ayah+'" '+fontFamily+'><span class="'+quranClass+'">'+layout.verseParse(quranBy, val.verse, val)+'</span> <a href="'+gq.url.hashless()+'#!/'+quranBy+'/'+val.surah+':'+val.ayah+'" class="ayahNumber" data-verse="'+verseNo+'"><span class="icon leftBracket"> </span>'+val.ayah+'<span class="icon rightBracket"> </span></a></p>';
			});
			
			body += '</div><div class="hr"><hr /></div>';
			colume += head+body+'</div>';
		});
		
		
		// loop again to put translation on left
		$.each(quranArray, function(quranBy, text)
		{
			body = '';
			lastSurahTitle = '';
			
			if (gq.quran.detail(quranBy).type == 'quran')
				return true;
			
			colume += '<div class="colume">';
			
			quranClass = (quranBy != 'quran-wordbyword' && quranBy != 'quran-kids' && gq.quran.detail(quranBy).type == 'quran') ?  'quranText' : '';
			fontFamily = (gq.quran.detail(quranBy).type == 'quran') ?  "style=\"font-family: '"+gq.font.getFamily(quranBy)+"';\"" : '';
			direction = (gq.quran.direction(quranBy) == 'right') ? 'rtl' : 'ltr';
			head = '<div class="ayahs '+direction+'" dir="'+direction+'">';
			
			$.each(text, function(verseNo, val)
			{
				if (val.ayah == 1 && lastSurahTitle != val.surah)
				{	
					if (body)
					{
						colume += head+body+'</div><div class="hr"><hr /></div>';
						body = '';
					}
					
					colume += layout.getSurahTitle(val.surah, val.ayah);
					lastSurahTitle = val.surah;
				}
				
				body += '<p class="ayah '+val.surah+'-'+val.ayah+'" '+fontFamily+'><span class="'+quranClass+'">'+layout.verseParse(quranBy, val.verse, val)+'</span> <a href="'+gq.url.hashless()+'#!/'+quranBy+'/'+val.surah+':'+val.ayah+'" class="ayahNumber" data-verse="'+verseNo+'"><span class="icon leftBracket"> </span>'+val.ayah+'<span class="icon rightBracket"> </span></a></p>';
			});
			
			body += '</div><div class="hr"><hr /></div>';
			colume += head+body+'</div>';
		});
		
		$(this.quranContent).append(colume);
	},
	
	listView: function (quranArray)
	{
		$(this.quranContent).html('');
		$(layout.quranContent).removeClass('single').removeClass('book').removeClass('search').addClass('list');
		$('#playerNavBox').show();
		$('#searchInfoBox').hide();
		$('#quranSideBar').show();
		$('#searchSideBar').hide();
		
		ayahList = gq.ayahs();
		byList = gq.quran.list('text');
		
		var head = '';
		var body = '';
		var lastSurahTitle = '';
		var verseNo = '';
		var val = '';
		var by = '';
		var name = '';
		
		head += '<div class="ayahs">';
		
		$.each(ayahList, function(i, aboutAyah)
		{
			verseNo = aboutAyah['verseNo'];
			val = Quran.ayah.fromVerse(verseNo);
			
			
			if (val.ayah == 1 && lastSurahTitle != val.surah)
			{
				
				if (lastSurahTitle != '')
				{
					$(layout.quranContent).append(head+body+'</div>');
					body = '';
				}
				
				$(layout.quranContent).append(layout.getSurahTitle(val.surah, val.ayah));
				lastSurahTitle = val.surah;
			}
			
			body += '<div class="group '+val.surah+'-'+val.ayah+'">';
			body += '<a href="'+gq.url.hashless()+'#!'+gq.url.ayah(val.surah, val.ayah)+'" class="ayahNumber" data-verse="'+verseNo+'"><span class="icon leftBracket"> </span>'+val.ayah+'<span class="icon rightBracket"> </span></a>';

			// loop this for putting quran on top
			$.each(quranArray, function(quranBy, text) 
			{
				val = text[verseNo];
				if (byList[quranBy].type == 'quran' && val !== undefined)
				{
					by = gq.quran.detail(quranBy);
					name = by.native_name || by.english_name;
					if((quranBy == 'quran-wordbyword' || quranBy == 'quran-kids') && gq.settings.wbwDirection == 'english2arabic')
						name = by.english_name;
					direction = (gq.quran.direction(quranBy) == 'right') ? 'rtl' : 'ltr';
					fontFamily = "style=\"font-family: '"+gq.font.getFamily(quranBy)+"';\"";
					quranClass = (quranBy != 'quran-wordbyword' && quranBy != 'quran-kids') ?  'quranText' : '';
					body += '<p class="ayah '+quranClass+' '+direction+'" dir="'+direction+'" '+fontFamily+'>'+layout.verseParse(quranBy, val.verse, val)+'</p>';
					//<a href="'+gq.url.hashless()+'#!/'+quranBy+'/'+val.surah+':'+val.ayah+'" class="quranID">'+name+'</a> 
				}
				
			});
			
			// loop again to put translation under quran
			$.each(quranArray, function(quranBy, text)
			{
				val = text[verseNo];
				if (byList[quranBy].type != 'quran' && val !== undefined)
				{					
					by = gq.quran.detail(quranBy);
					name = by.native_name || by.english_name;
					direction = (gq.quran.direction(quranBy) == 'right') ? 'rtl' : 'ltr';
					body += '<p class="ayah '+direction+'" dir="'+direction+'"><a href="'+gq.url.hashless()+'#!/'+quranBy+'/'+val.surah+':'+val.ayah+'" class="quranID">'+name+'</a> '+layout.verseParse(quranBy, val.verse)+'</p>';
				}				
			});
			
			body += '</div><div class="hr"><hr /></div>'; // closing group
		});
		body += '</div>'; // closing ayah
		
		$(this.quranContent).append(head+body);
	},
	
	searchView: function ()
	{
		layout.searchLoading(false);
		
		if (gq.search.position() == 0)
			$(this.quranContent).html('');
		
		if ($('#search').val() == '' || $('#search').val() == $('#search').attr('placeholder'))
			$('#search').val(gq.search.keyword());
		
		$(layout.quranContent).removeClass('single').removeClass('book').addClass('list').addClass('search');
		$('#playerNavBox').hide();
		$('#searchInfoBox').show();		
		$('#quranSideBar').hide();
		$('#searchSideBar').show();		
		
		if (gq.search.position() == 0)
			$('#searchAbout').html('About <span class="bold">'+gq.search.totalRows()+'</span> results ('+this._roundNumber(gq.search.timeTook(), 2)+' seconds)');
		
		var head = '';
		var body = '';
		var lastSurahTitle = '';
		var verseNo = '';
		var val = '';
		var by = '';
		var name = '';
		
		
		if (gq.search.totalRows() > 0)
		{
			head += '<div class="ayahs">';
			
			$.each(gq.search.text(), function(verseNo, list)
			{
				val = Quran.ayah.fromVerse(verseNo);
				
				if (gq.search.beginVerse() > verseNo)
					return true;
				
				if (gq.search.position() > 0 && gq.search.beginVerse() == verseNo)
					$('.'+val.surah+'-'+val.ayah).remove();
					
				delete list.surah_no;
				delete list.ayah_no;
				delete list['quran-kids'];
				
				var listCount = Object.keys(list).length;
				
				/*
				if (val.ayah == 1 && lastSurahTitle != val.surah)
				{
					
					if (lastSurahTitle != '')
					{
						$(layout.quranContent).append(head+body+'</div>');
						body = '';
					}
					
					$(layout.quranContent).append(layout.getSurahTitle(val.surah, val.ayah));
					lastSurahTitle = val.surah;
				}
				*/
				body += '<div class="group '+val.surah+'-'+val.ayah+'">';
				body += '<a href="'+gq.url.hashless()+'#!'+gq.url.ayah(val.surah, val.ayah)+'" class="ayahNumber" data-verse="'+verseNo+'"><span class="icon leftBracket"> </span>'+val.surah+':'+val.ayah+'<span class="icon rightBracket"> </span></a>';
				
				quranByList = {};
				showing = 0;
				$.each(list, function(quranBy, verse)  // organize the list
				{
					if (gq.search.isSelected(quranBy))
					{
						quranByList[quranBy] = true;
						++showing;
					}
					else
						quranByList[quranBy] = false;
				});
				
				// if not showing any rows at all, then show the first row
				if (showing == 0)
				{
					for (var quranBy in quranByList)
					{
						quranByList[quranBy] = true;
						break;
					}
				}
				
				foundDiv = '';
				p = '';
				$.each(quranByList, function(quranBy, show) 
				{
					by = gq.quran.detail(quranBy);
					name = by.native_name || by.english_name;
					if((quranBy == 'quran-wordbyword') && gq.settings.wbwDirection == 'english2arabic')
						name = by.english_name;
					direction = (gq.quran.direction(quranBy) == 'right') ? 'rtl' : 'ltr';
					fontFamily = "font-family: '"+gq.font.getFamily(quranBy)+"';";
					quranClass = (quranBy != 'quran-wordbyword' && quranBy != 'quran-kids' && by.type == 'quran') ?  'quranText' : '';
					showStyle = show ? '' : 'display:none;';
					style = 'style="'+fontFamily+showStyle+'"';
					
					if (by.type == 'quran')
						p = '<p class="ayah '+quranClass+' '+direction+'" dir="'+direction+'" '+style+' data-quranBy="'+quranBy+'"><a href="'+gq.url.hashless()+'#!/'+quranBy+'/'+val.surah+':'+val.ayah+'" class="quranID">'+name+'</a> '+layout.verseParse(quranBy, list[quranBy])+'</p>'+p;
					else
						p += '<p class="ayah '+direction+'" dir="'+direction+'" '+style+' data-quranBy="'+quranBy+'"><a href="'+gq.url.hashless()+'#!/'+quranBy+'/'+val.surah+':'+val.ayah+'" class="quranID">'+name+'</a> '+layout.verseParse(quranBy, list[quranBy])+'</p>';
					
					if (foundDiv)
						 foundDiv += ' / ';
					foundDiv += show ? '<a href="#" class="active tips" title="Hide Text" data-tips-dynamic="true" data-quranBy="'+quranBy+'">'+name+'</span>' : '<a href="#" class="tips" title="Show Text" data-tips-dynamic="true" data-quranBy="'+quranBy+'">'+name+'</a>';
				});
				
				if (listCount > 1)
				{
					if (showing == listCount)
						foundDiv += ' (<a href="#" class="hideAll">hide all</a>)';
					else
						foundDiv += ' (<a href="#" class="showAll">show all</a>)';
					
					p += '<div class="foundin"><b>Found in:</b> '+foundDiv+'</div>';
				}				
				
				body += p+'</div><div class="hr"><hr /></div>'; // closing group
			});
			body += '</div>'; // closing ayah
			
			this._searchLastVerse = verseNo;
			
			$(this.quranContent).append(head+body);
			$(window).trigger('scroll');
		}
		else
			$(this.quranContent).append('<div id="result" class="noRows"><p>0 rows found</p></div>');
	},
	
	searchLoading: function (bool)
	{
		/*if (bool == true)		
		{
			if (gq.search.position() == 0)
				$(this.quranContent).html('<div id="result" class="loading"><p>searching...</p></div>');
			else
				$(this.quranContent).append('<div id="result" class="loading"><p>loading more...</p></div>');
		} else
			$('#result').remove();*/
	},
	
	_roundNumber: function (number, digits) {
        var multiple = Math.pow(10, digits);
        var rndedNum = Math.round(number * multiple) / multiple;
        return rndedNum;
    },

	
	
	getSurahTitle: function (surah, ayah)
	{
		var html = '';
		html += '<div class="surahTitle">';
		if (surah > 1)
			html += '<a href="'+gq.url.hashless()+'#!'+gq.url.ayah((surah-1), 1)+'" data-verse="'+Quran.verseNo.ayah((surah-1), 1)+'" class="icon prevSurah tips" data-tips-position="left center">Previous Surah</a>';
		
		/*if (gq.quran.length() == 1 && gq.quran.detail(by).language_code == 'ar')
			html += '<span class="title">'+Quran.surah.name(surah, 'arabic_name')+'</span>';
		else
			*/html += '<span class="title">'+Quran.surah.name(surah, 'english_name')+' <span class="sep">-</span> <span class="meaning">'+Quran.surah.name(surah, 'english_meaning')+'</span></span>';
		
		if (surah < 114)
			html += '<a href="'+gq.url.hashless()+'#!'+gq.url.ayah((surah+1), 1)+'" data-verse="'+Quran.verseNo.ayah((surah+1), 1)+'" class="icon nextSurah tips" data-tips-position="right center">Next Surah</a>';
		html += '</div>';
		
		if (surah != 1 && surah != 9)
			html += '<a href="'+gq.url.hashless()+'#!'+gq.url.ayah(1, 1)+'" data-verse="1" class="icon bismillah tips">In the name of Allah, Most Gracious, Most Merciful</a>';
		
		html += '<div class="hr"><hr /></div>';
		
		return html;
	},
	
	recitorList: function ()
	{
		var list = gq.recitor.list();
		var maxChar = 22;

		//clean the rows, if already there
		$('.recitorList').html('');
		
		$.each(list, function (quranByID, by)
		{
			languageName = (gq.language.list()[by.language_code]) ? gq.language.list()[by.language_code].native_name || gq.language.list()[by.language_code].english_name : null;
			name = by.native_name || by.english_name;
			fullName = name;
			if (by.language_code != 'ar' && languageName != null)
				name = languageName;
			charTips = (name.length > maxChar || (by.language_code != 'ar' && languageName != null)) ? 'tips' : '';
			if (name.length > maxChar)
				name = name.substr(0, (maxChar-3))+'...';
			
			active = gq.recitor.isSelected(quranByID) ? 'active' : '';
			$('.recitorList').append('<li><a href="#" class="txt '+active+' '+charTips+'" title="'+fullName+'" data-recitor-id="'+quranByID+'">'+name+'</a></li>');
		});
	},
	
	recitorKbs: function (by)
	{
		bitrate = gq.recitor.bitrateList(by);
		selectedKbs = gq.recitor.selectedKbs(by);
		
		$('.bandwidthList').html('');
		$.each(bitrate, function (kbs, supportedType)
		{
			active = (selectedKbs == kbs) ? 'active' : '';
			kbsName = (kbs == 'auto') ? kbs : kbs+' kbs';
			$('.bandwidthList').append('<li><a href="#" class="txt '+active+'" data-kbs="'+kbs+'">'+kbsName+'</a></li>');
		});
		
		kbs = gq.player.recitorKbs();
		kbsName = (kbs == 'auto') ? kbs : kbs+' kbs';
		
		if (selectedKbs != 'auto')
			$('.bandwidthOption').text(kbsName);
		else
			$('.bandwidthOption').text('auto');
	},
	
	quranList: function (showAll)
	{
		var maxChar = 25;
		var showOnList = 4;
		var totalCount = 0;
		var list = gq.quran.list('text');
		var active = '';
		var html = '';
		var htmlActive = '';
		var $list = $('#quranList');
		
		//clean the rows, if already there
		$list.html('');
		
		$.each(list, function (quranByID, by)
		{
			if (by.type == 'quran')
			{
				//name = by.native_name || by.english_name;
				name = by.english_name;
				fullName = name;
				charTips = (name.length > maxChar) ? 'tips' : '';
				if (name.length > maxChar)
					name = name.substr(0, (maxChar-3))+'...';
				
				sideOption = '';
				if (quranByID == 'quran-wordbyword')
					sideOption = (gq.settings.wbwDirection == 'arabic2english') ?  '<span class="countValue rnd wbwDirection tips" title="change arabic to english" data-tips-dynamic="true" data-tips-position="left center">EN</span>' :  '<span class="countValue rnd wbwDirection tips" title="change english to arabic" data-tips-dynamic="true" data-tips-position="left center">AR</span>';
				else if (quranByID == 'quran-kids')
					sideOption = '<span class="sideInfo"><i class="icon kidsWordByWord"></i></span>';
				else if (quranByID == 'quran-tajweed')
					sideOption = '<span class="sideInfo"><i class="icon tajweed"></i></span>';
				
				active = gq.quran.isSelected(quranByID) ? 'active' : '';
				html = '<li><a href="'+gq.url.hashless()+'#!/'+quranByID+'/'+gq.page()+'" class="'+active+' '+charTips+'" title="'+fullName+'" data-quranid="'+quranByID+'"><span class="txt">'+name+'</span>'+sideOption+'<span class="loadingIndicator"></span></a></li>';
				
				if (active)
					htmlActive += html;				
				else
					$list.prepend(html);
				
				totalCount++;
			}
		});
		
		$list.prepend(htmlActive);
		
		if (showAll)
			return;
		
		if ($list.find('a.active').length > showOnList)
			showOnList = $list.find('a.active').length;
		
		i = 0;
		$list.find('a').each(function() {
			i++;
			
			if (i > showOnList)
				$(this).parent('li').remove();
		});
		
		if (i > showOnList)
			$list.append('<li><a href="#" class="more"><span class="txt">More &dArr;</span><span class="countValue rnd">'+(i-showOnList)+'</span></a></li>');
	},
	
	translationList: function (showAll, filter)
	{
		showAll = showAll || false;
		filter = filter || '';
		filter = $.trim(filter).toLowerCase();
		var maxChar = 25;
		var showOnList = 8;
		var totalCount = 0;
		var list = gq.quran.list('text');
		var active = '';
		var html = '';
		var $list = $('#translationList');
		var countryList = gq.language.countryList();
		
		//clean the rows, if already there
		$list.html('');
		
		$.each(list, function (quranByID, by)
		{
			languageName = null;
			searchString = by.native_name+' '+by.english_name+' '+by.language_code+' ';
			
			if (gq.language.list()[by.language_code])
			{
				searchString += gq.language.list()[by.language_code].english_name+' '+gq.language.list()[by.language_code].native_name;
				languageName = gq.language.list()[by.language_code].native_name || gq.language.list()[by.language_code].english_name;
			}
			
			searchString = searchString.toLowerCase();
			
			if (by.type != 'quran' && (filter == '' || searchString.indexOf(filter) != -1))
			{
				name = by.native_name || by.english_name;
				fullName = name;
				charTips = (name.length > maxChar) ? 'tips' : '';
				if (name.length > maxChar)
					name = name.substr(0, (maxChar-3))+'...';
				
				active = gq.quran.isSelected(quranByID) ? 'active' : '';
				html = '<li><a href="'+gq.url.hashless()+'#!/'+quranByID+'/'+gq.page()+'" class="'+active+' '+charTips+'" title="'+fullName+'" data-quranid="'+quranByID+'"><span class="txt">'+name+'</span><span class="loadingIndicator"></span></a></li>';
				if (languageName != null)
					htmlLanguage = '<li><a href="'+gq.url.hashless()+'#!/'+quranByID+'/'+gq.page()+'" data-lang="'+by.language_code+'" data-quranid="'+quranByID+'"><span class="txt">'+languageName+'</span><span class="loadingIndicator"></span></a></li>';
				else
					htmlLanguage = html;
				
				if (active)
					$list.prepend(html);
				else if (filter == '' && countryList[by.language_code] && !$('[data-lang="'+by.language_code+'"]').length)
				{
					if ($list.find('a.active:last').is('a'))
						$list.find('a.active:last').parent().after(htmlLanguage);
					else
						$list.prepend(htmlLanguage);
				}
				else if (filter == '' && !$('[data-lang="'+by.language_code+'"]').length)
					$list.append(htmlLanguage);
				else if (filter != '')
					$list.append(html);
				
				totalCount++;
			}
		});
		
		if (showAll)
			return;
		
		if ($list.find('a.active').length > showOnList)
			showOnList = $list.find('a.active').length;
		
		i = 0;
		$list.find('a').each(function() {
			i++;
			
			if (i > showOnList)
				$(this).parent('li').remove();
		});
		
		if (i > showOnList)
			$list.append('<li><a href="#" class="more"><span class="txt">More &dArr;</span><span class="countValue rnd">'+(i-showOnList)+'</span></a></li>');
	},
	
	surahList: function ()
	{
		var surahTitle = '';
		$('.customSurah').html('');
		
		for (i=1; i<= 114; i++)
		{			
			/* ie error, selectedBy undefined
			if (gq.quran.length() == 1 && gq.quran.detail(gq.settings.selectedBy).language_code == 'ar')
				surahTitle = Quran.surah.name(i, 'arabic_name');
			else
			*/
				surahTitle = Quran.surah.name(i, 'english_name');
			
			$('.customSurah').append('<option value="'+i+'">'+surahTitle+'</option>');
		}
	},
	
	play: function ()
	{
		this.beforePlay();
		$('.play, .pause').removeClass('play').addClass('pause');
		$('#recitor, #nextAyah, #prevAyah, #progressBar, #time, #bandwidthOption, #volume, #repeat').show();
		
		if (gq.player.status().noVolume)
			$('#volume').hide();
		
		if (!gq.player.isPlaying())
			gq.player.play();
		
		this.recitorKbs(gq.player.recitorBy());	
		this.afterPlay();
	},
	
	pause: function ()
	{
		this.beforePause();
		$('.play, .pause').removeClass('pause').addClass('play');
		gq.player.pause();	
		this.afterPlay();
	},
	
	stop: function()
	{
		$('.play, .pause').removeClass('pause').addClass('play');
		$('#recitor, #nextAyah, #prevAyah, #progressBar, #time, #bandwidthOption, #volume, #repeat').hide();
		gq.player.stop();
	},
	
	togglePlay: function ()
	{
		if (gq.player.isPlaying())
		{
			this.pause();
		}
		else
		{
			this.play();
		}
		
		return false;
	},
	
	volume: function (volumePercent, mute)
	{		
		$('.volumePercent').text(volumePercent+'%');
		$('.volume').removeClass('full').removeClass('med').removeClass('low').removeClass('muted');
		
		if (typeof mute == 'boolean')
		{
			if (mute)
			{
				$('.volume').addClass('muted');
				gq.player.mute();
			}
			else
				gq.player.unmute();
		}
		else if (volumePercent == 100)
			$('.volume').addClass('full');
		else if (volumePercent > 40)
			$('.volume').addClass('med');
		else
			$('.volume').addClass('low');
	},
	
	repeat: function (enable, optionDropDisable)
	{
		if (enable)
		{
			$('.repeat').addClass('active');
			if (!optionDropDisable)
				$('.repeat').parents('.dropOption').trigger('dropOption', 'show');
			gq.player.repeat(true);
			gq._gaqPush(['_trackEvent', 'Audio', 'repeatOn', gq.player.recitorBy()]);
		}
		else
		{
			$('.repeat').removeClass('active');
			$('.repeat').parents('.dropOption').trigger('dropOption', 'hide');
			gq.player.repeat(false);
			gq._gaqPush(['_trackEvent', 'Audio', 'repeatOff', gq.player.recitorBy()]);
		}
		
		// update repeat settings, must for start run
		$('.repeatEach').val(gq.settings.repeatEach);
		$('.repeatTimes').val(gq.settings.repeatTimes);
		$('.audioDelay').val(gq.settings.audioDelay);
	},
	
	quranFontSettings: function () // for startup only
	{
		$('#showSigns').attr('checked', gq.settings.showSigns);
		$('#showAlef').attr('checked', gq.settings.showAlef);
		$('#quranFont').val(gq.settings.font);
		$('#wbwMouseOver').attr('checked', gq.settings.wbwMouseOver);
	},
	
	fullScreen: function (enable)
	{
		if ($('#gqMain').hasClass('smallFrame'))
			return false;
	
		if (enable)
		{
			$('a.fullScreen').addClass('active');
			$('#infoSidebar').addClass('hide');
			$(layout.quranContent).removeClass('contentHalfSidebar').addClass('contentFull');
		}
		else
		{
			$('a.fullScreen').removeClass('active');
			$('#infoSidebar').removeClass('hide');
			$(layout.quranContent).removeClass('contentFull').addClass('contentHalfSidebar');	
		}
		
		gq.setFullScreen(enable);
	},
	
	fontSize: function (zoom, forceSet)
	{
		var zoomContent = $(layout.quranContent);
		
		if (forceSet)
		{
			$('a.zoomOUT, a.zoomIN').removeClass('disable');
			zoomContent.removeClass('smaller').removeClass('small').removeClass('medium').removeClass('large').removeClass('larger').removeClass('larger-x').removeClass('larger-xx')
			.addClass(forceSet);
			
			if (forceSet == 'smaller')
				$('a.zoomOUT').addClass('disable');
			else if (forceSet == 'larger-xx')
				$('a.zoomIN').addClass('disable');
			
			return; // exit function, sence its forced set
		}
		
		if (zoom)
		{
			if (zoomContent.hasClass('smaller'))
			{
				zoomContent.removeClass('smaller').addClass('small');
				$('a.zoomOUT').removeClass('disable');
				gq.font.setSize('small');
			}
			else if (zoomContent.hasClass('small'))
			{
				zoomContent.removeClass('small').addClass('medium');
				gq.font.setSize('medium');
			}
			else if (zoomContent.hasClass('medium'))
			{
				zoomContent.removeClass('medium').addClass('large');
				gq.font.setSize('large');
			}
			else if (zoomContent.hasClass('large'))
			{
				zoomContent.removeClass('large').addClass('larger');
				gq.font.setSize('larger');
			}
			else if (zoomContent.hasClass('larger'))
			{
				zoomContent.removeClass('larger').addClass('larger-x');
				gq.font.setSize('larger-x');
			}
			else if (zoomContent.hasClass('larger-x'))
			{
				zoomContent.removeClass('larger-x').addClass('larger-xx');
				$('a.zoomIN').addClass('disable');
				gq.font.setSize('larger-xx');
			}
		}
		else
		{
			if (zoomContent.hasClass('small'))
			{
				zoomContent.removeClass('small').addClass('smaller');
				$('a.zoomOUT').addClass('disable');
				gq.font.setSize('smaller');
			}
			else if (zoomContent.hasClass('medium'))
			{
				zoomContent.removeClass('medium').addClass('small');
				gq.font.setSize('small');
			}
			else if (zoomContent.hasClass('large'))
			{
				zoomContent.removeClass('large').addClass('medium');
				gq.font.setSize('medium');
			}
			else if (zoomContent.hasClass('larger'))
			{
				zoomContent.removeClass('larger').addClass('large');
				gq.font.setSize('large');
			}
			else if (zoomContent.hasClass('larger-x'))
			{
				zoomContent.removeClass('larger-x').addClass('larger');
				gq.font.setSize('larger');
			}
			else if (zoomContent.hasClass('larger-xx'))
			{
				zoomContent.removeClass('larger-xx').addClass('larger-x');
				$('a.zoomIN').removeClass('disable');
				gq.font.setSize('larger-x');
			}
		}
	},	
	
	ayahChanged: function ()
	{
		this.beforeAyahChanged();
		// select verse
		$(this.quranContent+' .selected').removeClass('selected');
		if (!gq.search.isActive())
			$('.'+gq.surah()+'-'+gq.ayah()).addClass('selected');
		
		if (this._autoScroll && !gq.search.isActive())
		{
			$('.'+gq.surah()+'-'+gq.ayah()).scrollTo(1000, this.scrollOffset);
		}
		
		$('.customSurah').val(gq.surah());
		
		if (gq.search.isActive())
			var surahTitle = gq.data.search.query+' found '+gq.data.search.paging.total_rows+' rows ';
		//else if (gq.quran.length() == 1 && gq.quran.detail(gq.settings.selectedBy).language_code == 'ar') //FIXME check on detail function
		//	var surahTitle = Quran.surah.name(gq.surah(), 'arabic_name');
		else
			var surahTitle = Quran.surah.name(gq.surah(), 'english_name')+' ('+Quran.surah.name(gq.surah(), 'english_meaning')+')';
		
		title = gq.search.isActive() ? surahTitle+' - '+this.pageTitle : gq.surah()+':'+gq.ayah()+' '+surahTitle+' - '+this.pageTitle;
		
		if ($.browser.msie) /* ie6+ error fix */
			document.title = title;
		else
			$('title').text(title);
		
		$('.currentAyah').attr('title', surahTitle).text(gq.search.isActive() ? '' : gq.surah()+':'+gq.ayah());
		
		$('a.prevPage, a.nextPage').removeClass('disable');
		if (gq.page() == 1)
			$('a.prevPage').addClass('disable');
		else if (gq.page() == 604)
			$('a.nextPage').addClass('disable');
		$('.pageOn').text(gq.page());
		
		$('.pageUrl').val(gq.url.hashless()+'#!'+gq.url.page());
		$('.ayahUrl').val(gq.url.hashless()+'#!'+gq.url.ayah());
	
		this.afterAyahChanged();
	},
	
	verseParse: function (quranBy, text, value) {
		return gq.quran.parse.load(quranBy, text, value);
	},	
	
	message: function (type, message)
	{
		$('#messageBox').html('<span class="'+type+'">'+message+'</span> <a href="#" class="icon close tips">close</a>').show();
	},
	
	binds: function ()
	{	
		UI_initLiveQueries(); //Do binding for showing smart tooltips for grammar etc.
		this.bindExtra();
		
		$('[href="#home"]').live('click', function()
		{
			if (gq.search.isActive())
				gq.search.stop();
			else
				gq.load(gq.surah(), gq.ayah());
			
			return false;			
		});
		
		$('body').live('prevAyah', function() {
			if (gq.settings.playing)
				gq.player.prev();
			else
			{	
				gq.prevAyah();
				layout.ayahChanged();
			}
		}).live('nextAyah', function() {
			if (gq.settings.playing)
				gq.player.next();
			else
			{	
				gq.nextAyah();
				layout.ayahChanged();
			}
		}).live('nextPage', function() {
			gq.player.reset();
			gq.nextPage();
			layout.ayahChanged();
		}).live('prevPage', function() {
			gq.player.reset();
			gq.prevPage();
			layout.ayahChanged();
		}).live('nextSurah', function() {
			gq.player.reset();
			gq.nextSurah();
			layout.ayahChanged();				
		}).live('prevSurah', function() {
			gq.player.reset();
			gq.prevSurah();
			layout.ayahChanged();
		}).live('customAyah', function(e, surah_no, ayah_no) {
			gq.player.reset();
			gq.ayah(surah_no, ayah_no);
			layout.ayahChanged();
		}).live('customSurah', function(e, surah_no) {
			gq.player.reset();
			gq.surah(surah_no);
			layout.ayahChanged();
		}).live('customPage', function(e, page_no) {
			gq.player.reset();
			gq.page(page_no);
			layout.ayahChanged();
		}).live('customJuz', function(e, juz_no) {
			gq.player.reset();
			gq.juz(juz_no);
			layout.ayahChanged();
		}).live('search', function(e, keyword)
		{
			gq.search.load(keyword);
			layout.searchLoading(true);
		});
		
		$('.ayahNumber, .bismillah, .prevSurah, .nextSurah').live('click', function() {
			gq.player.reset();
			var verse = Quran.ayah.fromVerse($(this).attr('data-verse'));
			gq.ayah(verse.surah, verse.ayah);
			layout.ayahChanged();
			return false;
		});

		$('.ayahNumber').live('dblclick', function() {
			var obj, verseno, surahno, ayahno, URL = 'http://textminingthequran.com/cgi/sim-phrase.cgi?s=$SURAH&v=$AYAH&p=50';
			verseno = $(this).attr('data-verse');
			obj = Quran.ayah.fromVerse( verseno );
			surahno = obj.surah; ayahno = obj.ayah; 
			URL = URL.replace(/\$SURAH/, surahno).replace(/\$AYAH/, ayahno );
			window.open(URL, '_blank'); //alert(URL);
		});
		//$('.ayahNumber').each( function(){ console.log( $(this).attr('data-verse') )  } );
	
		$('.prevAyah').live('click', function() {
			$('body').trigger('prevAyah');
			return false;
		});
		
		$('.nextAyah').live('click', function() {
			$('body').trigger('nextAyah');
			return false;
		});

		$('.nextPage').live('click', function() {
			$('body').trigger('nextPage');
			return false;
		});

		$('.prevPage').live('click', function() {
			$('body').trigger('prevPage');
			return false;
		});

		$('.customAyah').live('change', function() {
			$('body').trigger('customAyah', [$('.customSurah').val(), $(this).val()]);
		});

		$('.customSurah').live('change', function() {
			$('body').trigger('customSurah', $(this).val());
		});

		$('.customPage').live('change', function() {
			$('body').trigger('customPage', $(this).val());
		});

		$('.customJuz').live('change', function() {
			$('body').trigger('customJuz', $(this).val());
		});
		
		$('.volume').live('click', function() {
			layout.volume(gq.settings.volume, !$(this).hasClass('muted'));
			return false;
		});
		
		$('.play').live('click', function() {
			layout.play();
			return false;
		});
		
		$('.pause').live('click', function() {
			layout.pause();
			return false;
		});
		
		$('.repeat').live('click', function() {
			layout.repeat(!$(this).hasClass('active'));
			return false;
		});
		
		$('.repeatEach').live('change', function() {
			gq.player.repeatEach($(this).val());
		});
		
		$('.repeatTimes').live('change', function() {
			gq.player.repeatTimes($(this).val());
		});
		
		$('.audioDelay').live('change', function() {
			gq.player.audioDelay($(this).val());
		});
		
		$('#showSigns, #showAlef, #wbwMouseOver').live('click', function()
		{
			gq.settings.showAlef = $('#showAlef').is(':checked');
			gq.settings.showSigns = $('#showSigns').is(':checked');
			gq.settings.wbwMouseOver = $('#wbwMouseOver').is(':checked');
			gq.load(gq.surah(), gq.ayah());
		});
		
		$('#quranFont').live('change', function() {
			gq.font.setFamily($(this).val());
			gq.load(gq.surah(), gq.ayah());
		});
		
		$('#searchForm').submit(function() {
			$('body').trigger('search', [$('#search').val()]);
			return false;
		});
		
		$('a.book').live('click', function()
		{
			if ($(this).hasClass('active'))
			{
				$(this).removeClass('active');
				gq.settings.view = '';
				layout.fullScreen(false);
			}
			else
			{
				$(this).addClass('active');
				gq.settings.view = 'book';
				layout.fullScreen(true);
			}
			gq.quran.load();
		});
		
		// search extra found rows hide/show
		$('.foundin > a[data-quranBy]').live('click', function()
		{
			quranBy = $(this).attr('data-quranBy');
			ayah = $(this).parents('.group').find('p[data-quranBy="'+quranBy+'"]');
			if ($(this).hasClass('active'))
			{
				ayah.hide();
				gq.search.removeQuranBy(quranBy);
				$(this).removeClass('active');
				$(this).attr('title', 'Show Text');
			}
			else
			{
				ayah.show();
				gq.search.addQuranBy(quranBy);
				$(this).addClass('active');				
				$(this).attr('title', 'Hide Text');
			}
			
			return false;
		});
		
		// search extra found rows hide/show all.
		$('.foundin > .showAll, .foundin > .hideAll').live('click', function()
		{
			if ($(this).hasClass('showAll'))
			{
				$(this).parents('.group').find('p').show();
				$(this).parents('.group').find('.foundin > a').addClass('active').attr('title', 'Hide Text');
				$(this).replaceWith('<a href="#" class="hideAll">hide all</a>');
			}
			else
			{
				$(this).parents('.group').find('p').hide();
				$(this).parents('.group').find('.foundin > a').removeClass('active').attr('title', 'Show Text');;
				$(this).replaceWith('<a href="#" class="showAll">show all</a>');
			}
			
			return false;
		});
			
		$('a[data-quranid]').live('click', function()
		{	
			layout._autoScroll = false;
			
			if ($(this).attr('data-lang'))
			{
				$('#languageSearch').val($(this).text()).trigger('keyup').removeClass('placeholder');
				return false;
			}
			
			if ($(this).hasClass('active'))
			{
				$(this).removeClass('active');
				gq.quran.remove($(this).attr('data-quranid'));
				gq.quran.load();
				gq._gaqPush(['_trackEvent', 'QuranBy', 'remove',  $(this).text()]);
			}
			else
			{
				$(this).addClass('active');
				gq.quran.add($(this).attr('data-quranid'));
				gq.quran.load();
				gq._gaqPush(['_trackEvent', 'QuranBy', 'add',  $(this).text()]);
			}
			
			if ($('#languageSearch').val() != '')
				$('#languageSearch').val('').trigger('keyup');
						
			return false;
		});
		
		$('.recitorList a').live('click', function()
		{
			quranBy = $(this).attr('data-recitor-id');
			
			if (quranBy == 'auto' && !$(this).hasClass('active')) // remove all other selection on default (auto) selection
			{
				$('.recitorList .active').removeClass('active');
				$(this).addClass('active');
				gq.recitor.reset();
			}
			else if ($(this).hasClass('active'))
			{
				$(this).removeClass('active');
				gq._gaqPush(['_trackEvent', 'Audio', 'recitorRemove', $(this).text()]);
				gq.recitor.remove(quranBy);
			}
			else
			{
				$(this).addClass('active');
				gq._gaqPush(['_trackEvent', 'Audio', 'recitorAdd', $(this).text()]);
				gq.recitor.add(quranBy);
			}
			
			if (gq.recitor.length == 0) // if none selected, select auto
				$('.recitorList [data-recitor-id="auto"]').addClass('active');
			else
				$('.recitorList [data-recitor-id="auto"]').removeClass('active');
						
			
			gq.player.reset();
			gq.recitor.load();
		});
		
		$('.bandwidthList a').live('click', function()
		{
			$('.bandwidthList .active').removeClass('active');
			$(this).addClass('active');
			
			gq._gaqPush(['_trackEvent', 'Audio', 'bandwidth',  $(this).attr('data-kbs')]);
			gq.recitor.add(gq.player.recitorBy(), $(this).attr('data-kbs'));
			gq.player.reset();
			gq.recitor.load();			
		});
		
		//full screen
		$('a.fullScreen').live('click', function() {		
			layout.fullScreen(!$(this).hasClass('active'));			
			return false;	
		});
		
		// zoomIN, zoomOUT
		$('a.zoomIN, a.zoomOUT').live('click', function()
		{
			var zoom = $(this).hasClass('zoomIN');			
			if ($(this).hasClass('disable'))
				return false;
			
			layout.fontSize(zoom);
				
			return false;
		});
		
		// langauge search
		$('#languageSearch').live('keyup', function() {
			layout.translationList(false, ($('#languageSearch').val() != $('#languageSearch').attr('placeholder')) ? $('#languageSearch').val() : '');
			return false;
		});
		
		// show more quran, langauge list
		$('#quranList .more, #translationList .more').live('click', function() {
			$list = $(this).parents('ul');
			if ($list.attr('id') == 'quranList')
				layout.quranList(true);
			else
				layout.translationList(true, ($('#languageSearch').val() != $('#languageSearch').attr('placeholder')) ? $('#languageSearch').val() : '');
			
			$list.append('<li><a href="#" class="less"><span class="txt">Less &uArr;</span></a></li>');
			
			return false;
		});
		// show less quran, langauge list
		$('#quranList .less, #translationList .less').live('click', function() {
			$list = $(this).parents('ul');
			if ($list.attr('id') == 'quranList')
				layout.quranList(false);
			else
				layout.translationList(false, ($('#languageSearch').val() != $('#languageSearch').attr('placeholder')) ? $('#languageSearch').val() : '');
			
			return false;
		});
		
		$('.wbwDirection').live('click', function() 
		{
			var languageTo = $(this).text();
			var languageFrom = (languageTo == 'EN') ? 'AR' : 'EN'; 
			$(this).text(languageFrom);			
			gq.settings.wbwDirection = (languageTo == 'EN') ? 'english2arabic' : 'arabic2english';
			gq.load(gq.surah(), gq.ayah());
			
			return false;
		});
		
		$(document).keydown(function (e)
		{
			if ($(document.activeElement).attr('type')) // dont do anything if input box is selected
				return;

			var keyCode = e.keyCode || e.which,
			
			key = {left: 37, up: 38, right: 39, down: 40, space: 32, home: 36, end: 35, f2: 113, zoomIN: 107, zoomOUT: 109, r: 82, '<': 60, '>': 62, ',': 44, '.': 46};
			
			if ($('body').hasClass('rtl') && (keyCode == 37 || keyCode == 39)) // switch arrow keyCode, if direction is right to left
			{
				if (keyCode == 37)
					keyCode = 39;
				else
					keyCode = 37;
			}
			
			switch (keyCode)
			{
				case key.left:
					if (gq.search.isActive())
						return true;
					else if (e.ctrlKey && e.shiftKey)
						$('body').trigger('prevSurah');
					else if (e.ctrlKey)
						$('body').trigger('prevPage');
					else 
						$('body').trigger('prevAyah');
				break;
				case key.right:
					if (gq.search.isActive())
						return;
					else if (e.ctrlKey && e.shiftKey)
						$('body').trigger('nextSurah');
					else if (e.ctrlKey)
						$('body').trigger('nextPage');
					else
						$('body').trigger('nextAyah');				  
				break;
				case key.home:
					$('body').trigger('customAyah', [1, 1]);
				break;
				case key.end:
					$('body').trigger('customAyah', [114, 1]);
				break;
				/*case key.space:
					if (gq.search.isActive())
						return;
					layout.togglePlay();
					return false;
				break;*/
				case key.up:
					if (gq.search.isActive())
						return;
					layout.volume(gq.settings.volume+10);
					return false;
				break;
				case key.down:
					if (gq.search.isActive())
						return;
					layout.volume(gq.settings.volume-10);
					return false;
				break;
				case key.r:
					if (gq.search.isActive())
						return;
					$('.repeat').trigger('click');
					return false;
				break;
				case key.f2:
					$('a.fullScreen').trigger('click');
					return false;
				break;
				case key.zoomIN:
					$('a.zoomIN').trigger('click');
					return false;
				break;
				case key.zoomOUT:
					$('a.zoomOUT').trigger('click');
					return false;
				break;
			}
		});
		
		$(window).bind('hashchange', function(e) {
			if (gq.url.load())
			{
				if (gq.search.isActive())
					gq.load();
				else
					gq.load(gq.settings.surah, gq.settings.ayah);
			};
		});
		
		// search more..
		$(window).scroll(function()
		{			
	        if  (100 > (($(document).height() - $(window).height()) - $(window).scrollTop()) && gq.search.isActive() && !gq.search.loading() && gq.search.isNext())
	        {
	        	gq.search.load(gq.search.keyword(), true);
	        	layout.searchLoading(true);
	        }
		}); 
	},
	
	bindExtra: function ()
	{
		// topNav scroll
		var navPos = $("#topNav").position().top;
		scrollNav();
		$(window).scroll(function() {
			scrollNav();
		});	
		function scrollNav ()
		{		
			var scrollPos = $(window).scrollTop();
			if(scrollPos >= navPos)
			{
				$("#globalHeader").addClass('sticky');
			}
			else
			{
				$("#globalHeader").removeClass('sticky');
			}
		};		
		
		// menu drop options
		$('.dropOption').bind('dropOption', function(e, force)
		{
			var force = force || 'toggle';

			if ($(this).attr('id') == 'repeat' && !$(this).find('.repeat').hasClass('active') && force == 'show')
				return false; // dont show or hide, if repeat button is not clicked yet.
			
			var $subOption = $(this).find('ul'); // for <li>...
			if ($subOption.length == 0)// if not found, then check for next - for <li><a>
				$subOption = $(this).next('ul');
			if ($subOption.length == 0)// if not found, then check for parent next - for <li><a><span>
				$subOption = $(this).parent.next('ul');
			var position = $(this).position();
			position.top = navPos;
			var isActive = $(this).hasClass('active');
			
			if ((isActive && force != 'show') || (force && force == 'hide'))
			{	
				$(this).removeClass('active');
				if ($(this).attr('id') != 'repeat')
					$(this).find('a:first > span').removeClass('active');
				$subOption.removeClass('active');
				
				if ($subOption.parents('#statusNav').length != 0)
				{
					if ($.browser.msie && $.browser.version < 8)
						$('#surahBox, #extraTools').show();
				}
			}
			else
			{
				$(this).addClass('active');
				$(this).find('a:first > span').addClass('active');
				$subOption.addClass('active');
				
				if ($subOption.parents('#statusNav').length != 0)
				{
					if ($.browser.msie && $.browser.version < 8)
						$('#surahBox, #extraTools').hide();
				}
				else
				{
					if ($.browser.msie && $.browser.version < 8 && $('body').hasClass('rtl')) // ie6+ fix
						$subOption.css('right', position.left-260+'px');
					else
						$subOption.css('left', position.left-6+'px');
				}
			}		
		});
		$('.dropOption').hover(function(e) {
			$(this).trigger('dropOption', 'show');
		},function(e) {
			if (e.relatedTarget != null) // drop down select box fix
				$(this).trigger('dropOption', 'hide');
		});
		
		// message box hide
		$('#messageBox .close').live('click', function() {
			$('#messageBox').hide();
			return false;
		});
		
		// link share inputBox selection
		$('.pageUrl, .ayahUrl').click(function() {
			$(this).select();
		});
		
		//print page
		$('.print').click(function() {
			window.print();
			return false;
		});
		
		//bookmark page
		$("a.bookmark").click(function(e)
		{
			e.preventDefault(); // this will prevent the anchor tag from going the user off to the link
			var bookmarkUrl = this.href;
			var bookmarkTitle = this.title;
			
			if (window.sidebar) { // For Mozilla Firefox Bookmark
				window.sidebar.addPanel(bookmarkTitle, bookmarkUrl,"");
			} else if( window.external || document.all) { // For IE Favorite
				window.external.AddFavorite( bookmarkUrl, bookmarkTitle);
			} else if(window.opera) { // For Opera Browsers
				$("a.jQueryBookmark").attr("href",bookmarkUrl);
				$("a.jQueryBookmark").attr("title",bookmarkTitle);
				$("a.jQueryBookmark").attr("rel","sidebar");
			} else { // for other browsers which does not support
				alert('Your browser does not support this bookmark action');
				return false;
			}
		});
		
		// quran settings
		$('a.quranSettings').toggle(function()
		{
			$('#quranSettings').slideDown('slow');
		},
		function()
		{
			$('#quranSettings').slideUp('slow');
		});	
		$('#quranSettings').find('.close').click(function() {
			$('a.quranSettings').trigger('click');
		});
		
		// window resize change progress bar size also
		$(window).resize(function() {
			toolBarResize();
			progressBarResize();
			smallFrame();
		});
		toolBarResize();
		progressBarResize();
		smallFrame();
		function toolBarResize ()
		{
			$('#topNav').css('width', $('#gqMain').width());
		}		
		function progressBarResize ()
		{		
			var width = $('#gqMain').width();
			
			if (width <= 800)
				$('.progressBar').css('width', '15%');
			else
			{
				width = (width-800)/10;
				width = width+15; // add 10% for each 100 pixel extra after 800px + 15% on top so for 900px window it will be 25% in final result
				if (width > 60)
					width = 60;
				$('.progressBar').css('width', width+'%');
			}			
		}
		function smallFrame ()
		{
			var width = $('#gqMain').width();
			
			if (width <= 700)
			{
				$('#gqMain').addClass('smallFrame');
				$('li.fullScreen').hide();
				$('li.sideBarOptions').show();
				$(layout.quranContent).removeClass('contentHalfSidebar').addClass('contentFull');
				$("#infoSidebar").addClass('hide');
				$('a.sideBarOptions').removeClass('active');
			}
			else if ($('#gqMain').hasClass('smallFrame'))
			{
				$('#gqMain').removeClass('smallFrame');
				$('li.fullScreen').show();
				$('li.sideBarOptions').hide();
				$(layout.quranContent).addClass('contentHalfSidebar').removeClass('contentFull');
				this.fullScreen(gq.settings.fullScreen);
			}
		}
		
		//smallFrame sidebar options
		$('a.sideBarOptions').live('click', function() {
			
			if ($(this).hasClass('active'))
			{
				$("#infoSidebar").addClass('hide');
				$(this).removeClass('active');
			}
			else
			{
				$("#infoSidebar").removeClass('hide');
				$(this).addClass('active');
			}
			
			return false;
		});
		
		// mouse over
		$(".ayah").live({
	        mouseenter:
	           function()
	           {
					if ($(this).parent('.group').length != 0)
						$(this).parent('.group').addClass('mouseOver');
					else
						$(this).addClass('mouseOver');
	           },
	        mouseleave:
	           function()
	           {
					if ($(this).parent('.group').length != 0)
						$(this).parent('.group').removeClass('mouseOver');
					else
						$(this).removeClass('mouseOver');
	           }
	       }
	    );
		
		$('.MOREINFO').live('click', function(){
			var html = $(this).parent().html();
			if(!html) return;
			//$('.MOREINFO').parent().hide();
			$.blockUI({
				message: '<div style=font-size:3em;text-align:left;>' + html + '</div>',
				css: { height: '500px', width: '800px', top: '20%' }
			});  $('.blockOverlay').attr('title','Click to unblock').click($.unblockUI); //ui-tooltip-content
		});
		
		// start assinging tips to the containers
		$('.tips, .tipsWord').live('mouseenter', UI_Tooltip_Handler);
		$('.tips, .tipsWord').live('touchend', UI_Tooltip_Handler);
		
		$('.progressBar').qtip(
		{
			position: {
				my: 'top center',
				at: 'bottom center',
				target: 'mouse',
				adjust: {
					x: 0, y: 16,
					mouse: true  // Can be ommited (e.g. default behaviour)
				}
			},
			style: {
				tip: true,
				classes: ($.browser.msie && $.browser.version <= 7) ?  'ui-tooltip-dark' : 'ui-tooltip-youtube'
			}			
		});
		
		// place holder crossBrowser fix by hagenBurger - http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
		$('[placeholder]').focus(function()
		{
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
			}
			else
				input.removeClass('placeholder');
		})
		.blur(function()
		{
			var input = $(this);
			if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			}
		}).blur().parents('form').submit(function() {
			$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
					input.val('');
				}
			});
		});
	}
};

jQuery.fn.extend({
	scrollTo : function(speed, offset, easing) {
		offset = offset || 0;
		return this.each(function() {
			var targetOffset = $(this).offset().top+offset;
			$('html,body').animate({scrollTop: targetOffset}, speed, easing);
		});
	}
});	

$.ajaxSetup({"error":function(XMLHttpRequest,textStatus, errorThrown) {   
    //alert(textStatus);
    //alert(errorThrown);
    //alert(XMLHttpRequest.responseText);
	layout.message('error', 'Oopss!!!, Something went wrong. please refresh your browser or try again.');
	gq._gaqPush(['_trackEvent', 'Error', 'Oopss!!!, Something went wrong.']);
}});

var UI_Tooltip_Handler = function(){
			if ($('body').hasClass('rtl') && $.browser.msie && $.browser.version < 8) // ie6+ fix for right to left direction only
				return false;
			
			if($(this).data('qtip'))
			{
				if ($(this).attr('data-tips-dynamic') == 'true')
					$(this).qtip('api').set('content.text', $(this).attr('title') || $(this).text()); 
				
				return true;
			}
			
			// Define corners opposites
			var tipsPositionOpposites = {
				'bottom left': 'top right', 
				'bottom right': 'top left', 
				'bottom center': 'top center',
				'top right': 'bottom left', 
				'top left': 'bottom right', 
				'top center': 'bottom center',
				'left center': 'right center', 
				'left top': 'right bottom', 
				'left bottom': 'right top',
				'right center': 'left center', 
				'right bottom': 'left top', 
				'right top': 'left bottom'
			};
			
			var positionTooptip = ($(this).attr('data-tips-position') == null) ? tipsPositionOpposites['top center'] : tipsPositionOpposites[$(this).attr('data-tips-position')];
			var positionTarget = ($(this).attr('data-tips-position') == null) ? 'top center' : $(this).attr('data-tips-position');
			var x = 0;
			var y = 0;
			
			// switch values for right to left html direction (arabic, hebrew, urdu, farsi....)
			if ($('body').hasClass('rtl') && (positionTooptip == 'left top' || positionTooptip == 'left center' || positionTooptip == 'left bottom' || positionTooptip == 'right top' || positionTooptip == 'right center' || positionTooptip == 'right bottom')) // right to left direction, make switch
			{
				var tempPositionTooptip = positionTooptip;
				var tempPositionTarget = positionTarget;
				positionTooptip = tempPositionTarget;
				positionTarget = tempPositionTooptip;
			}
			
			// dynamic arrow sizes
			if (positionTooptip == 'top right' || positionTooptip == 'top left' || positionTooptip == 'top center')
				y = 0;
			else if (positionTooptip == 'bottom left' || positionTooptip == 'bottom right' || positionTooptip == 'bottom center')
				y = -4;
			else if (positionTooptip == 'left top' || positionTooptip == 'left center' || positionTooptip == 'left bottom')
				x = 4;
			else
				x = -4;
			
			if ($(this).hasClass('tipsWord'))
				classes = 'ui-tooltip-word';
			else
				classes = ($.browser.msie && $.browser.version <= 7) ?  'ui-tooltip-dark' : 'ui-tooltip-youtube';
			$(this).qtip(
			{
				content: {
					text: $(this).attr('title') || $(this).text()
				},
				show: {
					ready: true,
					delay: 300
				},
			
			 	hide: {
					delay: 150,
					fixed: true,
					solo: true,
					event: "mouseleave"
				},
				
				position: {
					my: positionTooptip,
					at: positionTarget,
					adjust: {
						x: x, y: y
					}
				},	
	 			style: {
					tip: true,
					classes: classes
				}
			});
	}


var UI_HOTLINK_TOOLTIPS_ENABLE = true;
var UI_initLiveQueries = function(){ var selector = '.hotlink'; if(!UI_HOTLINK_TOOLTIPS_ENABLE) return;
	$(selector).livequery( function(){ 
		window.status = 'NEW element added: ' + selector;
		UI_dohotlink( this );
		$(this).removeClass( 'hotlink' ).addClass( 'hotlinked' );
	} );
	selector = '.hotlinked';
	//$(selector).livequery( function(){
		//_log('hotlinked');//doSearchHighlight();
	//} );
	//selector = 'span.w2w';
	//$(selector).livequery( 'click', function (){
	//	$(this).css("background-color","Chartreuse"); 
	//	searchSet( $(this).text() ); //searchGo();
	//} );
}

var UI_dohotlink = function( obj ){
	var txt = $(obj).text(), data = $(obj).attr('data'), _class, text, o, ref;
	//iterate over the children and process 
	o = $(obj).children();
	$(o).each( function(){
		_class = $(this).attr('class'); text = $(this).text(); //console.log(this); console.log(_class +' '+ text);
		if(_class == 'ayah'){ 
			var verseno = $(this).attr("data-verse");
			if(verseno) $(this).html( UI_ayahHtml( verseno ) ); //$(this).html( URL.replace(/\$1/g, text ) );
		}
		else if(_class == 'ref'){ 
			ref = $(this).text(); //$(this).html( URL.replace(/\$1/g, text ) );
		}
		else if(_class == 'grammar'){
			//step1: restore back to original content. some of it might have been escaped. in the special case where contain < etc
			data = $(this).attr('data');
			if( data.indexOf('%3C') != -1){ //alert('foreign char! ' + data + '<BR/>'+ UI_grammarUnescape(data) + '<BR/>'+ text);
				text = UI_grammarUnescape(data);
			}
			$(this).html( UI_grammarHtml( ref + "||" + text) );
		}//if all went thru fine, u can hide the link.
	});
}

var UI_ayahLinkTemplate2 = '<li><A HREF=http://www.textminingthequran.com/apps/similarity.php?sura=$SURAH&verse=$AYAH&submit=Submit TARGET=_>$TITLE</A></li>',
	UI_ayahLinkTemplate3  = '<li><A HREF=http://textminingthequran.com/cgi/sim-phrase.cgi?s=$SURAH&v=$AYAH&p=50 TARGET=_>$TITLE</A></li>',
	UI_ayahLinkTemplate1  = '<li><A HREF=http://www.qtafsir.com/index.php?option=com_content&task=view&id=3000&Itemid=731 TARGET=_>$TITLE</A></li>',
	UI_ayahLinkTemplate4  = '<li><A HREF="javascript:alert(\'TBD. Please suggest good source via feedback. jazakallah khair!\');return false;" TARGET=_>$TITLE</A></li>',
	UI_ayahLinkTitle1 = '- Tafseer Ibn Kathir',
	UI_ayahLinkTitle2 = '- related verses from Ibn Kathir',
	UI_ayahLinkTitle3 = '- related verses by text similarity',
	UI_ayahLinkTitle4 = '- Context for revelation <span style=font-size:0.8em;>(Shaan-e-Nuzul)</span>';
var UI_ayahHtml = function( verseno ){ if(!(verseno = parseInt(verseno) ) ) return;
	var surah, ayah, html;
	surahno = Quran.ayah.fromVerse( verseno ).surah;
	ayahno  = Quran.ayah.fromVerse( verseno ).ayah;
	html = "<span style=font-size:0.6em!important;line-height:1em!important;>You might also be interested in this verse's...<BR><ul>" +
		UI_ayahLinkTemplate1.replace(/\$SURAH/, surahno).replace(/\$AYAH/, ayahno ).replace(/\$TITLE/, UI_ayahLinkTitle1) +
		UI_ayahLinkTemplate2.replace(/\$SURAH/, surahno).replace(/\$AYAH/, ayahno ).replace(/\$TITLE/, UI_ayahLinkTitle2) + 
		UI_ayahLinkTemplate3.replace(/\$SURAH/, surahno).replace(/\$AYAH/, ayahno ).replace(/\$TITLE/, UI_ayahLinkTitle3) + 
		UI_ayahLinkTemplate4.replace(/\$SURAH/, surahno).replace(/\$AYAH/, ayahno ).replace(/\$TITLE/, UI_ayahLinkTitle4) + 
		"</ul></span>";
	return html;
}

var UI_grammarHtml = function( text ){ CORPUS.isInitialized = true;
	var html = '', corpus, refHtml='--';
	if(typeof(CORPUS) == 'object' && CORPUS){//Play safe, incase grammar plugin disabled or grammar data not yet loaded..
		corpus = CORPUS.UIgetWordGrammarDisplay(text); //console.log(corpus);
		if(corpus && typeof(corpus) == 'object'){
			refHtml = corpus.html; //refPOS = corpus.pos;
		}
	}else debugger; //else just show the plain words... on mouseover shows arabic word.						*/
	html = refHtml;// +'<BR/>'+ text;
	return html;
}

var UI_grammarUnescape = function(text){
	return decodeURIComponent(text);
}

var UI_grammarEscape = function(text){
	if(decodeURIComponent( encodeURIComponent( text ) ) != text ){ console.log('encodeURIComponent and rountrip after decode DONT MATCH!'); debugger; }
	return encodeURIComponent(text);
}

var UI_grammarEscapeUIFriendly = function(text){
	return text.replace(/\</g, '&#171;').replace(/\>/g, '&gt;').replace(/\"/g, '&#9674;');
}

var escape = function(input){ if(!input) return; return input.replace(/\</g, '&lt;').replace(/\>/g, '&gt;'); }
var br = function(input){ if(!input) return; return '<span class="E GRMR">'+input.replace(/\n/g, '<br/>') + '</span>'; }
var hotlinkify = function(input){ if(!input) return; return '<span class=hotlink>' + input + '</span>'; }
var A = function(href, title, target){ if(!href) return; if(typeof(title)==NULL || !title) title=href; if(typeof(target)==NULL || !target) target=href; return '<a href="'+ href +'" target="'+ target + '" >'+title+'</a>';}

var toggleSearchMode = function(){
	var mode = $('#searchmode').html(), isOfflineMode = false;
	isOfflineMode = (mode == 'online'); //this bool is new mode
	mode = isOfflineMode ? 'Offline' : 'online';
	$('#searchmode').html( mode );
	
	//Now bind appropriate search function
	if(!isOfflineMode){
		$('#searchForm').unbind('submit'); 
		$('#searchForm').submit(function() {
				$('body').trigger('search', [$('#search').val()]);
				return false;
		});
	}else{
		$('#searchForm').unbind('submit'); 
		$('#searchForm').bind('submit', function(event){ 
			event.preventDefault(); 
			offlinesearch($('#search').val() ); 
			return false; 
		});
	}
}