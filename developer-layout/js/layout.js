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
			var html = this.page();
			$(layout.setting.div.content).html(html);
		},
		
		page: function()
		{			
			var html='', lines, line, by, name, quran, translation,
			quranArray = gq.quran.text(),
			byList = gq.quran.list('text');
									
			// loop through Quran lines of the current page 
			$.each(gq.ayahs(), function(i, line)
			{
				quran='',translation='';				
				
				if (line.ayah == 1)
					html += layout.view.getSurahTitle(line.surah, line.ayah);
				
				
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
				html += '<div class="icon bismillah tips">In the name of Allah, Most Gracious, Most Merciful</div>';
			
			html += '<div class="hr"><hr /></div>';
			
			return html;
		}
		
	}
	
};