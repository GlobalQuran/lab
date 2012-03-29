
var WORDBYWORD = {
	isInitialized: false,
	init: function(){ 
		if(WORDBYWORD.isInitialized) return;
		try{
			WORDSMEANING.init(); BUCKSDATA.init(); //WORDBYWORD._rawdata = document.getElementById( WORDBYWORD.DATAISLAND ).innerHTML; 
		}catch(err){ console.log(err.message); console.log(err); debugger; return; }
		//WORDBYWORD._rawdataArr = WORDBYWORD._rawdata.split('\n');
		WORDBYWORD.isInitialized = true;
	},
	separator:	'·|', //  •· ‣ « ☞ ◊	 '་', //
	fetchLine: function(verseNo, surah, ayah){
		try{
			if(!WORDBYWORD.isInitialized){ WORDBYWORD.init(); WORDBYWORD.isInitialized = true;}
			var lineAr, lineEn, obj, arr1, arr2; 		lineAr = lineEn = '';
			lineAr = BUCKSDATA.fetchLineRaw(verseNo); //returns raw string
			lineEn = WORDSMEANING.fetchLineRaw(verseNo); //returns object
			if(lineAr && lineEn){
				arr1   = lineAr.split(' ');
				arr2   = lineEn.split('$');
				if(!arr1 || !arr2 || (arr1.length != arr2.length-1) ){ debugger; return;}
				$.each(arr1, function(index, value){
					arr2[index] = EnToAr( value )+ WORDBYWORD.separator + arr2[index];  //arr2[index] = value + '|'+ arr2[index];
				});
				var obj = {};
				obj.surah = surah ? surah : Quran.ayah.fromVerse(verseNo).surah;
				obj.ayah  = ayah  ? ayah  : Quran.ayah.fromVerse(verseNo).ayah;
				obj.verse = arr2.join('$');
			}
			return obj;
		}catch(err){ console.log(err.message); console.log(err);
		}
	},	
	n: 0
}


var WORDSMEANING = {
	isInitialized: false,
	DATAISLAND:		'dataislandmeaning',
	separator: '· ',
	
	init: function(){ 
		if(WORDSMEANING.isInitialized) return;
		try{
			WORDSMEANING._rawdata = document.getElementById( WORDSMEANING.DATAISLAND ).innerHTML; 
		}catch(err){ console.log(err.message); console.log(err); }
		if(!WORDSMEANING._rawdata){ debugger; return; }
		WORDSMEANING._rawdataArr = WORDSMEANING._rawdata.split('\n');
		WORDSMEANING.isInitialized = true;
	},

	fetchLine: function(verseNo, surah, ayah){
		var obj = {}, verseline = WORDSMEANING.fetchLineRaw(verseNo, surah, ayah);
		obj.surah = surah ? surah : Quran.ayah.fromVerse(verseNo).surah;
		obj.ayah  = ayah  ? ayah  : Quran.ayah.fromVerse(verseNo).ayah;
		obj.verse = verseline ? verseline.split('$').join(WORDSMEANING.separator) : verseline;
		return obj;
	},

	fetchLineRaw: function(verseNo, surah, ayah){
		try{
			if(!WORDSMEANING.isInitialized){ WORDSMEANING.init(); WORDSMEANING.isInitialized = true;}
			if(parseInt(verseNo) && WORDSMEANING._rawdataArr){
				return WORDSMEANING._rawdataArr[verseNo];
			}
		}catch(err){ console.log(err.message); console.log(err);
		}
	},
	
	n: 0
}


var BUCKSDATA = {
	isInitialized: false,
	DATAISLAND:		'dataislandbuck',
	separator: '· ',
	init: function(){ 
		if(BUCKSDATA.isInitialized) return;
		try{
			BUCKSDATA._rawdata = document.getElementById( BUCKSDATA.DATAISLAND ).innerHTML; 
		}catch(err){ console.log(err.message); console.log(err); }
		if(!BUCKSDATA._rawdata){ debugger; return; }
		BUCKSDATA._rawdataArr = BUCKSDATA._rawdata.split('\n');
		BUCKSDATA.isInitialized = true;
	},

	fetchLine: function(verseNo, surah, ayah, convertToArabic){
		try{
			if(!BUCKSDATA.isInitialized){ BUCKSDATA.init(); BUCKSDATA.isInitialized = true;}
			if(convertToArabic == null) convertToArabic = true;
			if(parseInt(verseNo) && BUCKSDATA._rawdataArr){
				var obj = {}, verseline;
				verseline = BUCKSDATA.fetchLineRaw(verseNo, surah, ayah);
				obj.surah = surah ? surah : Quran.ayah.fromVerse(verseNo).surah;
				obj.ayah  = ayah  ? ayah  : Quran.ayah.fromVerse(verseNo).ayah;
				verseline = ( convertToArabic ? EnToAr(verseline) : escape(verseline) );
				obj.verse = verseline + BUCKSDATA.separator;
				return obj;
			}
		}catch(err){ console.log(err.message); console.log(err);
		}
	},
	
	fetchLineRaw: function(verseNo, surah, ayah){
		try{
			if(!BUCKSDATA.isInitialized){ BUCKSDATA.init(); BUCKSDATA.isInitialized = true;}
			if(parseInt(verseNo) && BUCKSDATA._rawdataArr){
				return BUCKSDATA._rawdataArr[verseNo];
			}
		}catch(err){ console.log(err.message); console.log(err);
		}
	},
	
	n: 0
}

	
var OFFLINEDATA = {
	isInitialized: false,
	
	init: function(){ 
		if(OFFLINEDATA.isInitialized) return;
		try{
			BUCKSDATA.init(); //WORDSMEANING.init();
		}catch(err){ console.log(err.message); console.log(err); }
		OFFLINEDATA.isInitialized = true;
	},
		
	preload: function(quranBy, fromVerseNo, toVerseNo, self_data){
		var result = false, obj, self_data2, bUthmani=false;
		bUthmani = (quranBy == 'quran-uthmani');
		if(!OFFLINEDATA.isInitialized){ OFFLINEDATA.init(); }
		if(!self_data || !self_data.quran){ debugger; }
		if (self_data.quran[quranBy]){	
			if (!self_data.quran[quranBy][fromVerseNo]){
				self_data2 = $.extend(true, self_data, obj = OFFLINEDATA.fetch(quranBy, fromVerseNo, toVerseNo, self_data) ); result=true; //notCached.push(quranBy);
			}
		}
		else{
			self_data2 = $.extend(true, self_data, OFFLINEDATA.fetch(quranBy, fromVerseNo, toVerseNo, self_data) ); result=true; //notCached.push(quranBy);	
		}//console.log(quranBy + '\t'+ fromVerseNo +'-'+ toVerseNo + self_data); console.log(obj); console.log(self_data2);  
		if(!result) return;
		return self_data2; //$.extend(true, self.data, response);
	},
	
	fetch: function(quranBy, fromVerseNo, toVerseNo, self_data){
		var q = {}, verseline='', bUthmani = (quranBy == 'quran-uthmani'), bEnSahih = (quranBy == 'en.sahih'), bWordMeaning = (quranBy == 'bs.mlivo'), bWordToWord = (quranBy == 'quran-wordbyword');
		q.quran = {};
		q.quran[ quranBy ] = {};
		if((bUthmani || bEnSahih || bWordMeaning || bWordToWord)){
			for(var m=fromVerseNo; m<toVerseNo; ++m){
				if(bWordToWord){
					q.quran[ quranBy ][m] = WORDBYWORD.fetchLine( m );
				}
				else if(bWordMeaning){
					q.quran[ quranBy ][m] = WORDSMEANING.fetchLine( m );
				}
				else if(bUthmani || bEnSahih){
					q.quran[ quranBy ][m] = BUCKSDATA.fetchLine( m, null, null, bUthmani );
				}
			}
		}
		return q;
	},
	
	x: 0 //just dummy to put at end
};


















var BuckToBare = function(str){ if(!str) return;
	str = str.replace(/[{`><]/g, 'A').replace(/[\&]/g, 'w').replace(/[}]/g, 'y').replace( /[\FNK#aeiou~\^]/g, '');
	return str;
}


var EnToAr = function(word){
	if(!word) return null;
	initializeMapper();
	var ar = '', l, letter, found=false;
	try{
		var wordArr = word.split(''); //split into letters.	//lookup from english to arabic letter. and return it.
		for(l=0; l<wordArr.length; ++l){
			letter = wordArr[l]; found = false;
			for(n=1; n<_buckArr.length; ++n){
				if(letter == _buckArr[n]){
					ar += _charsArr[n]; found=true;
					break;
				}
			}
			if(!found)  ar += ''; //letter; //' ??'+letter+'?? ';
		}
	}catch(ex){
		debugger;
		ar = '-err: ' + ex + ex.message + ex.lineno;
	}
	return ar;
}

var ArToEn = function(word){
	if(!word) return null;
	initializeMapper();
	var ar = '', l, letter, found=false;
	try{
		var wordArr = word.split(''); //split into letters.	//lookup from english to arabic letter. and return it.
		for(l=0; l<wordArr.length; ++l){
			letter = wordArr[l]; found = false;
			for(n=1; n<_charsArr.length; ++n){
				if(letter == _charsArr[n]){
					ar += _buckArr[n]; found=true;
					break;
				}
			}
			if(!found){  ar += ''; 
						 if(_bMAPPER_DEBUG){ 
							if(typeof(UNKNOWNS) == NULL) UNKNOWNS={}; 
							else{
								if(!UNKNOWNS[letter]){ UNKNOWNS[letter] = 1; _log('No mapping found:\t' + letter + '');  }
								else UNKNOWNS[letter] = 1+UNKNOWNS[letter];
							}								
						}
			}
		}
	}catch(ex){
		debugger;
		ar = '-err: ' + ex + ex.message + ex.lineno;
	}
	return ar;
}

var _charsArr, _buckArr, bInitialized = false;
var initializeMapper = function(){
	if(bInitialized) return;
	var qBare = null, qBuck = null;		
	var stopletters = "ۚۖۛۗۙ";
	var chars='آ ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي';
	var buck = 'A A b t v j H x d * r z s $ S D T Z E g f q k l m n h w y';
	var buckArr, charsArr;
	var ext = new Array();
	var map = { };
	charsArr = chars.split(' ');
	buckArr  = buck.split(' ');
	//mISSING CHARACTERS:		// أ إ ئ ء ة ؤ
	charsArr.push( 'ى' ); buckArr.push( 'Y' );
	charsArr.push( 'أ' ); buckArr.push( '>' );
	charsArr.push( 'إ' ); buckArr.push( '<' );	//charsArr.push( ' ' ); buckArr.push( ' ' ); //charsArr.push( '' ); buckArr.push( '' );
	charsArr.push( 'ئ' ); buckArr.push( '}' );
	charsArr.push( 'ء' ); buckArr.push( 'X' ); //buckArr.push( '\'' );
	//charsArr.push( 'ة' ); buckArr.push( 'P' );
	charsArr.push( 'ؤ' ); buckArr.push( '&' );
	//missing characters for harakath.
	charsArr.push( '\u0652' ); buckArr.push( 'o' );
	charsArr.push( '\u064e' ); buckArr.push( 'a' );
	charsArr.push( '\u0650' ); buckArr.push( 'i' );
	charsArr.push( '\u064f' ); buckArr.push( 'u' );
	charsArr.push( '\u064b' ); buckArr.push( 'F' );
	charsArr.push( '\u064d' ); buckArr.push( 'K' );
	charsArr.push( '\u064c' ); buckArr.push( 'N' );
	charsArr.push( '\u0626' ); buckArr.push( '}' );
	charsArr.push( '\u0640' ); buckArr.push( '_' );
	charsArr.push( '\u0651' ); buckArr.push( '~' );
	charsArr.push( '\u0653' ); buckArr.push( '^' );
	charsArr.push( '\u0654' ); buckArr.push( '#' );
	charsArr.push( '\u0671' ); buckArr.push( '{' );
	charsArr.push( '\u0670' ); buckArr.push( '`' );
	charsArr.push( '\u06e5' ); buckArr.push( ',' );
	charsArr.push( '\u06e6' ); buckArr.push( '.' );
	charsArr.push( 'ة' ); buckArr.push( 'p' );
	charsArr.push( '\u06df' ); buckArr.push( '@' );
	charsArr.push( '\u06e2' ); buckArr.push( '[' );
	charsArr.push( '\u06ed' ); buckArr.push( ']' );
	charsArr.push( '\u0621' ); buckArr.push( '\'' );
	charsArr.push( '\u06DC' ); buckArr.push( ':' );
	charsArr.push( '\u06E0' ); buckArr.push( '\"' );
	charsArr.push( ' ' ); buckArr.push( ' ' );
	charsArr.push( ';' ); buckArr.push( ';' );
	charsArr.push( '\n' ); buckArr.push( '\n' );
	
	charsArr.push( 'ع' ); buckArr.push( '3' ); //ayn //support for arabi/chat letters
	charsArr.push( 'ء' ); buckArr.push( '2' ); //hamza
	charsArr.push( 'ح' ); buckArr.push( '7' ); //HAA
	charsArr.push( 'خ' ); buckArr.push( '5' ); //KHAA
	charsArr.push( 'ص' ); buckArr.push( '9' ); //Saad
	charsArr.push( 'ط' ); buckArr.push( '6' ); //Thaw

	charsArr.push( charsArr[2] ); buckArr.push( 'B' ); //Support for Capital letters
	charsArr.push( charsArr[4] ); buckArr.push( 'V' );
	charsArr.push( charsArr[5] ); buckArr.push( 'J' );
	charsArr.push( charsArr[10] ); buckArr.push( 'R' );
	charsArr.push( charsArr[19] ); buckArr.push( 'G' );
	charsArr.push( charsArr[21] ); buckArr.push( 'Q' );
	charsArr.push( charsArr[23] ); buckArr.push( 'L' );
	charsArr.push( charsArr[24] ); buckArr.push( 'M' );
	charsArr.push( charsArr[27] ); buckArr.push( 'W' );
	charsArr.push( 'ة' ); buckArr.push( 'P' );
	
	//For IndoPak script extra letters
	charsArr.push( 'ی' ); buckArr.push( 'y' );
	charsArr.push( 'ۃ' ); buckArr.push( 'p' );
	charsArr.push( 'ہ' ); buckArr.push( 'h' );
	charsArr.push( 'ی' ); buckArr.push( 'Y' );
	charsArr.push( 'ک' ); buckArr.push( 'k' );
	charsArr.push( 'ۤ ' ); buckArr.push( '?' );
	charsArr.push( 'ۤۚ ' ); buckArr.push( '?' );
	charsArr.push( 'ۡ ' ); buckArr.push( '?' );
	charsArr.push( 'ۚ ' ); buckArr.push( '?' );
	charsArr.push( 'ۤ ' ); buckArr.push( '?' );

	_charsArr = charsArr; _buckArr = buckArr;
	bInitialized = true;
}		
initializeMapper();





	var escape = function(input){ if(!input) return; return input.replace(/\</g, '&lt;').replace(/\>/g, '&gt;'); }
	var unescape = function(input){ if(!input) return; return input.replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>'); }
