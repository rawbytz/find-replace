# Find and Replace Bookmarklet for WorkFlowy

- Find and replace words and phrases.
- Mass Rename tags. 
- Delete all instances of a tag or string.

![findreplace](https://i.imgur.com/OIWK68h.png)

## Installation: Drag this link to your bookmarks bar:

<!-- Special #setup editing instrucions go here -->
<a href="javascript:(function FR_2_3(){function toastMsg(str,sec,err){WF.showMessage(str,err);setTimeout(WF.hideMessage,(sec||2)*1e3)}function applyToEachItem(functionToApply,parent){functionToApply(parent);for(let child of parent.getChildren()){applyToEachItem(functionToApply,child)}}function findMatchingItems(itemPredicate,parent){const matches=[];function addIfMatch(item){if(itemPredicate(item)){matches.push(item)}}applyToEachItem(addIfMatch,parent);return matches}function editableItemWithVisibleMatch(item){const isVisible=WF.completedVisible()||!item.isWithinCompleted();return item.data.search_result&amp;&amp;item.data.search_result.matches&amp;&amp;isVisible&amp;&amp;!item.isReadOnly()}const escapeForRegExp=str=&gt;str.replace(/[-\[\]{}()*+?.,\\^$|#]/g,&quot;\\$&amp;&quot;);function countMatches(items,rgx){let matchCount=0;items.forEach(item=&gt;{let result=item.data.search_result;if(result.nameMatches){let nameMatch=item.getName().match(rgx);if(nameMatch)matchCount+=nameMatch.length}if(result.noteMatches){let noteMatch=item.getNote().match(rgx);if(noteMatch)matchCount+=noteMatch.length}});return matchCount}const htmlEscTextForContent=str=&gt;str.replace(/&amp;/g,&quot;&amp;amp;&quot;).replace(/&gt;/g,&quot;&amp;gt;&quot;).replace(/&lt;/g,&quot;&amp;lt;&quot;).replace(/\u00A0/g,&quot;&amp;nbsp;&quot;);function replaceMatches(items,rgx,r){WF.editGroup((function(){items.forEach(item=&gt;{let result=item.data.search_result;if(result.nameMatches)WF.setItemName(item,item.getName().replace(rgx,htmlEscTextForContent(r)));if(result.noteMatches)WF.setItemNote(item,item.getNote().replace(rgx,htmlEscTextForContent(r)))})}));r===&quot;&quot;?WF.clearSearch():WF.search(tQuery.replace(find,r))}const htmlEscText=str=&gt;str.replace(/&amp;/g,&quot;&amp;amp;&quot;).replace(/&gt;/g,&quot;&amp;gt;&quot;).replace(/&lt;/g,&quot;&amp;lt;&quot;).replace(/&quot;/g,&quot;&amp;quot;&quot;);function getColors(){const p=document.querySelector(&quot;.page.active&quot;);return p?`color:${getComputedStyle(p).color};background:${getComputedStyle(p).backgroundColor};`:&quot;&quot;}function showFindReplaceDialog(BODY,TITLE,aCount,cCount,searchValue){const addButton=(num,name)=&gt;`&lt;button type=&quot;button&quot; class=&quot;btnX&quot; id=&quot;btn${num.toString()}&quot;&gt;${name}&lt;/button&gt;`;const boxStyle=`#inputBx{${getColors()}width:95%;height:20px;display:block;margin-top:5px;border:1px solid #ccc;border-radius:4px;padding:4px}`;const btnStyle=`.btnX{font-size:18px;background-color:steelblue;border:2px solid;border-radius:20px;color:#fff;padding:5px 15px;margin-top:16px;margin-right:16px}.btnX:focus{border-color:#c4c4c4}`;const box=`&lt;div&gt;&lt;b&gt;Replace:&lt;/b&gt;&lt;input value=&quot;${htmlEscText(searchValue)}&quot; id=&quot;inputBx&quot; type=&quot;text&quot; spellcheck=&quot;false&quot;&gt;&lt;/div&gt;`;const buttons=addButton(1,`Replace: All (${aCount})`)+addButton(2,`Replace: Match Case (${cCount})`);WF.showAlertDialog(`&lt;style&gt;${boxStyle+btnStyle}&lt;/style&gt;&lt;div&gt;${BODY}&lt;/div&gt;${box}&lt;div&gt;${buttons}&lt;/div&gt;`,TITLE);const intervalId=setInterval((function(){let inputBx=document.getElementById(&quot;inputBx&quot;);if(inputBx){clearInterval(intervalId);let userInput;const btn1=document.getElementById(&quot;btn1&quot;);const btn2=document.getElementById(&quot;btn2&quot;);inputBx.select();inputBx.addEventListener(&quot;keyup&quot;,(function(event){if(event.key===&quot;Enter&quot;){btn1.click()}}));btn1.onclick=function(){userInput=inputBx.value;WF.hideDialog();setTimeout((function(){replaceMatches(Matches,rgx_gi,userInput)}),50)};btn2.onclick=function(){userInput=inputBx.value;WF.hideDialog();setTimeout((function(){replaceMatches(Matches,rgx_g,userInput)}),50)}}}),50)}if(!WF.currentSearchQuery()){return void toastMsg('Use the searchbox to find. &lt;a href=&quot;https://workflowy.com/s/findreplace-bookmark/ynKNSb5dA77p2siT&quot; target=&quot;_blank&quot;&gt;Click here for more information.&lt;/a&gt;',3,true)}const tQuery=WF.currentSearchQuery().trim();const Matches=findMatchingItems(editableItemWithVisibleMatch,WF.currentItem());const isQuoted=tQuery.match(/(&quot;)(.+)(&quot;)/);const find=isQuoted?isQuoted[2]:tQuery.includes(&quot; &quot;)?false:tQuery;if(find===false){if(confirm('The search contains at least one space.\n\n1. Press OK to convert your search to &quot;exact match&quot;.\n\n2. Activate Find/Replace again.')){WF.search('&quot;'+tQuery+'&quot;')}return}const title=&quot;Find/Replace&quot;;const modeTxt=isQuoted?&quot;Exact Match, &quot;:&quot;Single Word/Tag, &quot;;const compTxt=`Completed: ${WF.completedVisible()?&quot;Included&quot;:&quot;Excluded&quot;}`;const findTxt=isQuoted?isQuoted[0]:tQuery;const body=`&lt;p&gt;&lt;b&gt;Mode:&lt;/b&gt;&lt;br&gt;${modeTxt+compTxt}&lt;/p&gt;&lt;p&gt;&lt;b&gt;Find:&lt;/b&gt;&lt;br&gt;${htmlEscText(findTxt)}&lt;/p&gt;`;const findRgx=escapeForRegExp(htmlEscTextForContent(find));const rgx_gi=new RegExp(findRgx,&quot;gi&quot;);const rgx_g=new RegExp(findRgx,&quot;g&quot;);const allCount=countMatches(Matches,rgx_gi);const caseCount=countMatches(Matches,rgx_g);if(allCount&gt;0){showFindReplaceDialog(body,title,allCount,caseCount,find)}else{WF.showAlertDialog(`${body}&lt;br&gt;&lt;br&gt;&lt;i&gt;No matches found.&lt;/i&gt;`,title)}})();">F/R</a>

## Links:
- [View this shared WorkFlowy outline for detailed instructions.](https://workflowy.com/s/findreplace-bookmark/ynKNSb5dA77p2siT)
- [Source code](https://github.com/rawbytz/find-replace/blob/master/findReplace.js)
- [rawbytz Blog](https://rawbytz.wordpress.com)


## Version Notes:
- v2.3 (2023-07-31): Fix for non-breaking spaces 
- v2.2 (2022-08-21): Fix for buttons sometimes not working.
- v2.1 (2020-07-14): Button colors, darken input box with dark theme, minor refactoring.
- v2.0 (2019-07-14): Bug fix: was improperly replacing text in incomplete children of completed parents when completed hidden.
- v1.9 (2019-06-23): Moved help outline. Changed link in banner message.
- v1.8 (2019-05-29): Bug fix: Read Only matches are now omitted.
- v1.7 (2019-05-28): Updated for API changes
- v1.6 (2019-05-22): Updated for API changes
- v1.5 (2018-12-28): Minor bug fixes
- v1.4 (2018-12-27): Major bug fix. Now works with WorkFlowy's new Large Project Optimization code.
- v1.3 (2018-11-06): Fix broken dialog buttons.

<!-- 
LINKS REFERENCING THIS

@SOFTWARE https://rawbytz.wordpress.com/software/ 

@WFBLOG https://blog.workflowy.com/2018/09/13/find-and-replace/

@BLOGGER https://rawbytz.blogspot.com/p/findreplace-bookmarklet-for-workflowy.html

 -->
