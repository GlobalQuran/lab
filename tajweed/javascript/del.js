var init = function(){
  
	var arabic = '', buck = '', bare = '';
    buck = getSomeText(); arabic = gq.quran.parse.buck2arabic(buck);
    $('#placeholder').html( arabic +'<br>Transliteration<br>'+ EnToTr(buck));//+'<br>Buck<br>'+ escape(ArToEn(arabic)) );

    buck = 'bismo';arabic = gq.quran.parse.buck2arabic( buck ); bare=gq.quran.parse.buck2bare(buck);
    $('#buck').html( buck );  $('#arr').html( arabic );
    $('#bare').html( bare );  $('#arrbare').html( gq.quran.parse.buck2arabic(bare) );
    
    buck = 'fasayakofiykahumu'; arabic = gq.quran.parse.buck2arabic( buck );
    bare=gq.quran.parse.buck2bare(buck);
    $('#buck2').html( buck );  $('#arr2').html( arabic );
    $('#bare2').html( bare );  $('#arrbare2').html( gq.quran.parse.buck2arabic(bare) );    
    
    var parts = ['fa', 'sa', 'yakofiy', 'ka', 'humu'], arabicparts = [];
    var grammarparts = ['POS-RSLT', 'POS-FUT', 'POS-V', 'POS-PRON', 'POS-PRON'];
    $.each(parts, function(i, val){
          arabicparts[i] = gq.quran.parse.buck2arabic( val );
        arabicparts[i] = '<span class=' + grammarparts[i] + '>&zwj;'+arabicparts[i] + (i!=4 ? '&zwj;' : '') + '</span>';
           });
    buck = parts.join(''); bare = gq.quran.parse.buck2bare( buck );
    arabic = arabicparts.join('');

    $('#buck4').html( buck );  $('#arr3').html( arabic );
    $('#bare3').html( bare );  $('#arrbare3').html( gq.quran.parse.buck2arabic(bare) );

};

    
    
    
    var getSomeText = function(){
         return 'bisomi {ll~ahi {lr~aHoma`ni {lr~aHiymi\n\
             {loHamodu lil~ahi rab~i {loEa`lamiyna\n\
                 {lr~aHoma`ni {lr~aHiymi\n\
ma`liki yawomi {ld~iyni\n\
<iy~aAka naEobudu wa<iy~aAka nasotaEiynu\n\
{hodinaA {lS~ira`Ta {lomusotaqiyma\n\
Sira`Ta {l~a*iyna >anoEamota Ealayohimo gayori {lomagoDuwbi Ealayohimo walaA {lD~aA^l~iyna\n\
';
    }  
    


var EnToTr = function(buck)
{
    if(!buck)
    	return null;
    
    var transliteration = '', l, letter, found=false;
    var wordArr = buck.split(''); //split into letters.
    
    for(l=0; l<wordArr.length; ++l)
    {
        letter = wordArr[l];
        found = false;
        
        for(n=1; n<Quran._data.buck.length; ++n)
        {
            if(letter == Quran._data.buck[n])
            {
            	transliteration += Quran._data.tran[n];
            	found = true;
                break;
            }
        }
        
        if (!found)
        	transliteration += letter;
    }
    
    return transliteration;
}

Quran.init();





    var escape = function(input){ if(!input) return; return input.replace(/\</g, '&lt;').replace(/\>/g, '&gt;'); }
    var unescape = function(input){ if(!input) return; return input.replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>'); }

  $('#placeholder').html('testing'); 
  init();    
//init();​