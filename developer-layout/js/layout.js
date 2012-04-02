/**
 * Layout object contains all the visual functionalities of the site.
 * if you want to change any html functionality, then this is the object you should be looking into. 
 * @author Basit (i@basit.me || http://Basit.me)
 * 
 * Online Quran Project
 * http://GlobalQuran.com/
 *
 * Copyright 2012, imegah.com
 * Simple Public License (Simple-2.0)
 * http://www.opensource.org/licenses/Simple-2.0
 * 
 */

var layout = {
		
	setting: {
		title: '',  // if left empty, it will get html title - surah title will be prepended with this title
		
		keyboard: true,
		
		url: { // TODO move to GQ.js, cause its control from there mostly
			enable: true,
			html5: true,	// html5 replaces hash (!#) with backslashes / 
			format: '%quranID/%surah:%ayah'
		},
		
		data: { //TODO move to GQ.js, like gq.noData
			enable: true, 
			by: 'page', // surah or page 
			completeDownlaod: true
		},
		
		player: {
			enabled: true,
			bandwidth: 'high'
		},
		
		div: { //TODO not sure about this div & list
			content: '.page',
			quranList: '',
			translationList: '', 
			recitorList: ''
		}
	},
	
	before: {
		load: function () {},
		play: function () {}
	},
	
	after: {
		load: function () {},
		play: function () {}
	},	
	
	init: function ()
	{
		this.before.load();
	
		gq.noData = (this.setting.data.enable) ? false : true;
		
		gq.layout.displayStartup = function (success)
		{
			layout.view.load(success);			
			
		};
		gq.layout.display = function (success)
		{
			layout.view.load(success);
		};
		
		gq.init();
		
		this.bind.load();
				
		this.after.load();
		
		/*						
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
		
		this.binds();
		
		*/
	},
	
	load: function ()
	{
		gq.load(); // display default languages
	},
	
	view: {
		
		load: function()
		{			
			var html = layout.getHtml.page();
			$(layout.setting.div.content).html(html);
		}			
	},
	
	getHtml: {
		
		page: function(page)
		{
			layout.getHtml.translationLanguageList();
			var page = page || gq.page();
			var html='', lines, line, by, name, quran, translation,
			quranArray = gq.quran.text(),
			byList = gq.quran.list('text');
									
			// loop through Quran lines of the current page 
			$.each(Quran.ayah.listFromPage(page), function(i, line)
			{
				quran='',translation='';				
				
				if (line.ayah == 1)
					html += layout.getHtml.surahTitle(line.surah, line.ayah);
				
				
				html += '<div class="ayahs '+line.surah+'-'+line.ayah+'">';
				html += '<a href="'+gq.url.hashless()+'#!'+gq.url.ayah(line.surah, line.ayah)+'" class="ayahNumber" data-verse="'+line.verseNo+'"><span class="icon leftBracket"> ( </span>'+line.ayah+'<span class="icon rightBracket"> ) </span></a>';
				
				
				// loop through selected Quran text
				$.each(quranArray, function(quranBy, lines) 
				{					
					line.verse = lines[line.verseNo].verse; // append verse text in the line
					
					if (line == undefined) // line is empty
						return;
										
					by 			= gq.quran.detail(quranBy);					
					direction 	= (gq.quran.direction(quranBy) == 'right') ? 'rtl' : 'ltr';
					
					if((quranBy == 'quran-wordbyword' || quranBy == 'quran-kids') && gq.settings.wbwDirection == 'english2arabic')
						name = by.english_name;
					else
						name = by.native_name || by.english_name;
					
					if (byList[quranBy].type == 'quran') // quran text
					{	
						fontFamily = "style=\"font-family: '"+gq.font.getFamily(quranBy)+"';\"";
						quranClass = (quranBy != 'quran-wordbyword' && quranBy != 'quran-kids') ?  'quranText' : '';
						quran += '<p class="ayah '+quranClass+' '+direction+'" dir="'+direction+'" '+fontFamily+'>'+gq.quran.parse.load(quranBy, line)+'</p>';
					}
					else // translation text
					{
						translation += '<p class="ayah '+direction+'" dir="'+direction+'"><a href="'+gq.url.hashless()+'#!/'+quranBy+'/'+line.surah+':'+line.ayah+'" class="quranID">'+name+'</a> '+gq.quran.parse.load(quranBy, line)+'</p>';
					}
				});
				
				html += quran+translation;	//Quran on top and translation at bottom							
				html += '</div><div class="hr"><hr /></div>'; // closing ayahs
			});
						
			return html;
		},
		
		surahTitle: function (surah, ayah)
		{
			var html = '';
			html += '<div class="surahTitle">';
			if (surah < 114)
				html += '<a href="'+gq.url.hashless()+'#!'+gq.url.ayah((surah+1), 1)+'" data-verse="'+Quran.verseNo.ayah((surah+1), 1)+'" class="icon nextSurah tips" data-tips-position="right center">Next Surah</a>';
			
			//if (gq.quran.length() == 1 && gq.quran.detail(by).language_code == 'ar')
				html += '<span class="title">'+Quran.surah.name(surah, 'arabic_name')+'</span>';
			//else
			//	html += '<span class="title">'+Quran.surah.name(surah, 'english_name')+' <span class="sep">-</span> <span class="meaning">'+Quran.surah.name(surah, 'english_meaning')+'</span></span>';
			
			if (surah > 1)
				html += '<a href="'+gq.url.hashless()+'#!'+gq.url.ayah((surah-1), 1)+'" data-verse="'+Quran.verseNo.ayah((surah-1), 1)+'" class="icon prevSurah tips" data-tips-position="left center">Previous Surah</a>';
						
			html += '</div>';
			
			if (surah != 1 && surah != 9)
				html += '<div class="icon bismillah tips">In the name of Allah, Most Gracious, Most Merciful</div>';
			
			html += '<div class="hr"><hr /></div>';
			
			return html;
		},
		
		translationLanguageList: function ()
		{			
			var html = '', classSelected,			
			list = gq.quran.list('text'),
			countryList = gq.language.countryList(),
			transLangList = {};								
			
			
			$.each(list, function (quranByID, by)
			{
				if (by.type == 'quran')
					return; // continue to next loop
				
				// create object for language, if not created yet
				if (!transLangList[by.language_code])
					transLangList[by.language_code] = {selected: false};
				
				// assign name if not already assigned
				if (!transLangList[by.language_code]['name'] && gq.language.list()[by.language_code])
					transLangList[by.language_code]['name'] = gq.language.list()[by.language_code].native_name || gq.language.list()[by.language_code].english_name;
				
				// check if language is been selected or not
				if (gq.quran.isSelected(quranByID))
					transLangList[by.language_code]['selected'] = true;
			});
			
			
			$.each(transLangList, function (langCode, lang)
			{
				classSelected = lang.selected ? 'active' : ''; 
				html += '<li><a href="#" class="'+classSelected+'" data-lang="'+langCode+'">'+lang.name+'</a></li>';
			});
			
			html = '<ul class="translationLanguageList">'+html+'</ul>';
			
			return html;
		},
		
		translationList: function (filter)
		{
			filter = filter || '';
			filter = $.trim(filter).toLowerCase();
			var maxChar = 25, classSelected,
			html = '',			
			list = gq.quran.list('text');
			
			
			$.each(list, function (quranByID, by)
			{
				searchString = by.language_code; //by.native_name+' '+by.english_name+' '+by.language_code+' '; // filter by language code only				
				searchString = searchString.toLowerCase();
				
				if (by.type != 'quran' && (filter == '' || searchString.indexOf(filter) != -1))
				{
					name = by.native_name || by.english_name;
					fullName = name;
					if (name.length > maxChar)
						name = name.substr(0, (maxChar-3))+'...';
					
					classSelected = gq.quran.isSelected(quranByID) ? 'active' : '';
					html += '<li><a href="#" class="'+classSelected+'" data-quran="'+quranByID+'" title="'+fullName+'">'+name+'</a></li>';										
				}
			});
			
			html = '<ul class="translationList">'+html+'</ul>';
			
			return html;
		},
		
		quranList: function ()
		{
			var maxChar = 25, classSelected,
			html = '',			
			list = gq.quran.list('text');
			
			$.each(list, function (quranByID, by)
			{				
				if (by.type != 'quran')
					return; // continue looping
			
				name = by.english_name;//by.native_name || by.english_name;
				fullName = name;
				if (name.length > maxChar)
					name = name.substr(0, (maxChar-3))+'...';
				
				classSelected = gq.quran.isSelected(quranByID) ? 'active' : '';
				html += '<li><a href="#" class="'+classSelected+'" data-quran="'+quranByID+'" title="'+fullName+'">'+name+'</a></li>';											
			});
				
			html = '<ul class="quranList">'+html+'</ul>';
			
			return html;
		},
		
		recitorList: function ()
		{
			var maxChar = 25, classSelected, languageName,
			html = '',			
			list = gq.recitor.list();
			
			
			$.each(list, function (quranByID, by)
			{
				languageName = (gq.language.list()[by.language_code]) ? gq.language.list()[by.language_code].native_name || gq.language.list()[by.language_code].english_name : null;
				name = by.native_name || by.english_name;
				fullName = name;
				if (by.language_code != 'ar' && languageName != null)
					name = languageName;
				
				if (name.length > maxChar)
					name = name.substr(0, (maxChar-3))+'...';
				
				classSelected = gq.recitor.isSelected(quranByID) ? 'active' : '';
				html += '<li><a href="#" class="'+classSelected+'" title="'+fullName+'" data-recitor="'+quranByID+'">'+name+'</a></li>';
			});
			
			html = '<ul class="recitorList">'+html+'</ul>';
			
			return html;
		}
		
	},
	
	bind: {
		
		load: function()
		{
			this.quran();
			this.link();
			this.keyboard();
		},
		
		quran: function()
		{
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
		},
		
		
		link: function()
		{
			$('.btn-menu').live('click', function() {
				
				if ($(this).hasClass('active'))
				{
					$('.btn-menu').removeClass('active');
					$('.sideBarMenu,.sideBarMenu2').hide();
					return false;
				}
				
				$('.btn-menu').removeClass('active');
				$(this).addClass('active');
				$('.sideBarMenu,.sideBarMenu2').hide();
				
				var id = $(this).data('for'), 
				list;
				
				if (id == 'recitor')
					list = layout.getHtml.recitorList();
				else if (id == 'translation')
					list = layout.getHtml.translationLanguageList();
				else
					list = layout.getHtml.quranList(); //quran
				
				$('.sideBarMenu').html(list)
				.show();
				
				return false;				
			});
			
			$('.translationLanguageList a').live('click', function() {
				
				var lang = $(this).data('lang'),
				offset = $(this).offset();
								
				$('.sideBarMenu2').html(layout.getHtml.translationList(lang))
				.css('top', offset.top)
				.show()
				.css('height', $('.translationList li').length * 40);
				
				return false;
			});
			
			//TODO below is check on it and change it if need to
			$('.ayahNumber, .bismillah, .prevSurah, .nextSurah').live('click', function() {
				gq.player.reset();
				var verse = Quran.ayah.fromVerse($(this).attr('data-verse'));
				gq.ayah(verse.surah, verse.ayah);
				layout.ayahChanged();
				return false;
			});
			
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
				//layout._autoScroll = false;
				
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
		},
		
		
		keyboard: function()
		{
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
					case key.space:
						if (gq.search.isActive())
							return;
						layout.togglePlay();
						return false;
					break;
					case key.up: //TODO change this
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
		}
		
	}
	
};