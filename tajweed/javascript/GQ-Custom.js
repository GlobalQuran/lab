gq.settings.fontSize = 'larger-x';
gq.settings.playing = false;
gq.save();

			
gq.load = function (surah, ayah)
{
	//$("#audioPlayer").data("jplayer") = {};
	firstLoad = false;
	notCachedQuranID = true;

	if (surah && ayah)
		this.search._keyword = false;
	
	if (!surah && !ayah && !this.search.isActive())
	{
		firstLoad = true;
		this._cookieRead();
		this.url.load();
	}
	
	if (this.search.isActive())
	{
		this.search.loading(true);
		var requestUrl = this.apiURL;
		
		if (firstLoad)
			requestUrl += 'all/';
		
		requestUrl += 'search/'+this.search.keyword()+'/'+this.search.position();
		
		if (this.search.position() == 0)
			this.url.save();
	}
	else if (!surah && !ayah)
	{	
		this.settings.page = 0; // url wont load, if its same as url page 1=1
		this.url.load();
		
		this.settings.surah = this.settings.surah || 1;
		this.settings.ayah = this.settings.ayah || 1;
		this.settings.juz =  Quran.ayah.juz(this.settings.surah, this.settings.ayah);	
		this.settings.page = Quran.ayah.page(this.settings.surah, this.settings.ayah);		
		this.data.ayahList = Quran.ayah.listFromPage(this.settings.page);

		requestUrl = this.apiURL+'all/page/'+this.settings.page;

		if (this.quran.length() > 0)// TODO add this.noData for getting no quran text from server.
			requestUrl += '/'+this.quran.selectedString();
		/*if (this.settings.selectedLanguage) // TODO language selection here
			requestUrl += '/'+this.settings.selectedLanguage;*/
	}//TODO add other methods too ex: search and language pack
	else
	{
		this.settings.surah = surah;
		this.settings.ayah = ayah;
		this.settings.juz = Quran.ayah.juz(surah, ayah);
		this.settings.page = Quran.ayah.page(surah, ayah);		
		this.data.ayahList = Quran.ayah.listFromPage(this.settings.page);
					
		notCachedQuranID = this.quran.textNotCached();			
		
		requestUrl = this.apiURL+'page/'+this.settings.page+'/'+notCachedQuranID;
		this.url.save();
	}
	
	this.save();
	this._gaqPush(['_trackPageview', '/#!'+this.url.page()]);
	
	if (this.noData && !firstLoad) // if no data need to be output, then run request only once
		notCachedQuranID = false;

	if (notCachedQuranID)
	{
		if (firstLoad) {
			jsonp = $.support.cors ? '' : '.jsonp?callback=?';
			$.ajaxSetup({ cache: true, jsonpCallback: 'quranData' });

			$.getJSON('quran-all.json', function(response) {			
				gq._loadResponse(response, firstLoad);
			});
			$.getJSON('quran-gq-tajweed.json', function(response) {	
				gq._loadResponse(response, firstLoad);
			});
			
			/*
			$.getJSON('quran-all.json', function(response) {      
				gq._loadResponse(response, firstLoad);
			});
			$.getJSON('quran-gq-tajweed.json', function(response) {      
				gq._loadResponse(response, firstLoad);
			});
			*/
		}
		else 
		{
			/*
			$jsonp = $.support.cors ? '' : '.jsonp?callback=?';
			$.ajaxSetup({ cache: true, jsonpCallback: 'quranData' });
			$.getJSON(requestUrl+$jsonp, function(response) {      
			  gq._loadResponse(response, firstLoad);
			});
			*/
		}
	}
	else
	{
		gq.layout.display(true);	
		gq.player.load('play');
	}
	
	return false;
};

gq.quran.parse.parseGQTajweed = function (quranBy, verseObject)
{    
	return tool.buck2tajweed(verseObject.surah, verseObject.ayah, verseObject.verse);
   /* 
    wordArray = arabic.split(' ');
    arabic = '';
    $.each(wordArray, function(i, word) {
    	arabic += '<word data-id="'+Quran.word.number(verseObject.surah, verseObject.ayah, i+1)+'">'+word+'</word> ';
    });
    
	return arabic; //'<word>' +arabic.replace(/\s+/g, '</word> <word>')+'</word>';
	*/
	//return text.replace(/\[h/g, '<span class="ham_wasl" title="Hamzat Wasl" alt="').replace(/\[s/g, '<span class="slnt" title="Silent" alt="').replace(/\[l/g, '<span class="slnt" title="Lam Shamsiyyah" alt="').replace(/\[n/g, '<span class="madda_normal" title="Normal Prolongation: 2 Vowels" alt="').replace(/\[p/g, '<span class="madda_permissible" title="Permissible Prolongation: 2, 4, 6 Vowels" alt="').replace(/\[m/g, '<span class="madda_necessary" title="Necessary Prolongation: 6 Vowels" alt="').replace(/\[q/g, '<span class="qlq" title="Qalqalah" alt="').replace(/\[o/g, '<span class="madda_obligatory" title="Obligatory Prolongation: 4-5 Vowels" alt="').replace(/\[c/g, '<span class="ikhf_shfw" title="Ikhfa\' Shafawi - With Meem" alt="').replace(/\[f/g, '<span class="ikhf" title="Ikhfa\'" alt="').replace(/\[w/g, '<span class="idghm_shfw" title="Idgham Shafawi - With Meem" alt="').replace(/\[i/g, '<span class="iqlb" title="Iqlab" alt="').replace(/\[a/g, '<span class="idgh_ghn" title="Idgham - With Ghunnah" alt="').replace(/\[u/g, '<span class="idgh_w_ghn" title="Idgham - Without Ghunnah" alt="').replace(/\[d/g, '<span class="idgh_mus" title="Idgham - Mutajanisayn" alt="').replace(/\[b/g, '<span class="idgh_mus" title="Idgham - Mutaqaribayn" alt="').replace(/\[g/g, '<span class="ghn" title="Ghunnah: 2 Vowels" alt="').replace(/\[/g, '" >').replace(/\]/g, '</span>');
};

/*	var corpusInit = function(){ 
		//HARDCODE the metadata for now
		gq.data.quranList['quran-new-tajweed'] = {
			"language_code": "ar",
			"english_name": "Corpus",
			"native_name": "",
			"format": "text",
			"type": "quran",
			"source": "Hafidh.com",
			"default": null,
			"last_update": "1969-12-31"
		};

		gq.data['quran-new-tajweed'] = {'verseNo1': {surah: 1, ayah:1, verse: 'text'}, 2: {surah: 1, ayah:1, verse: 'text'}, 3: {surah: 1, ayah:1, verse: 'text'}, 4: {surah: 1, ayah:1, verse: 'text'}, 5: {surah: 1, ayah:1, verse: 'text'}, 6: {surah: 1, ayah:1, verse: 'text'}, 7: {surah: 1, ayah:1, verse: 'text'}, 8: {surah: 1, ayah:1, verse: 'text'}, 9: {surah: 1, ayah:1, verse: 'text'}} // add all 6236 verses here. 
			
		// now we will select quran data
		gq.quran.add('quran-new-tajweed'); // selecting corpus data
	}*/
