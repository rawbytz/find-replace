(function FR_2_1() {
  function toastMsg(str, sec, err) {
    WF.showMessage("<b>" + str + "</b>", err);
    setTimeout(function () { WF.hideMessage() }, (sec || 2) * 1000);
  }
  function applyToEachItem(functionToApply, parent) {
    functionToApply(parent);
    for (let child of parent.getChildren()) {
      applyToEachItem(functionToApply, child);
    }
  }
  function findMatchingItems(itemPredicate, parent) {
    const matches = [];
    function addIfMatch(item) {
      if (itemPredicate(item)) {
        matches.push(item);
      }
    }
    applyToEachItem(addIfMatch, parent);
    return matches;
  }
  function editableItemWithVisibleMatch(item) {
      const isVisible = WF.completedVisible() || !item.isWithinCompleted();
      return item.data.search_result && item.data.search_result.matches && isVisible && !item.isReadOnly()
  }
  const escapeForRegExp = str => str.replace(/[-\[\]{}()*+?.,\\^$|#]/g, "\\$&");
  function countMatches(items, rgx) {
    let matchCount = 0;
    items.forEach(item => {
      let result = item.data.search_result;
      if (result.nameMatches) {
        let nameMatch = item.getName().match(rgx);
        if (nameMatch) matchCount += nameMatch.length;
      }
      if (result.noteMatches) {
        let noteMatch = item.getNote().match(rgx);
        if (noteMatch) matchCount += noteMatch.length;
      }
    });
    return matchCount;
  }
  function replaceMatches(items, rgx, r) {
    WF.editGroup(function () {
      items.forEach(item => {
        let result = item.data.search_result;
        if (result.nameMatches) WF.setItemName(item, item.getName().replace(rgx, htmlEscapeTextForContent(r)));
        if (result.noteMatches) WF.setItemNote(item, item.getNote().replace(rgx, htmlEscapeTextForContent(r)));
      });
    });
    r === "" ? WF.clearSearch() : WF.search(tQuery.replace(find, r));
  }
  function showFindReplaceDialog(b, t, b1, b2, di) {
    const style = '#inputBx{width:95%;height:20px;display:block;margin-top:5px;border:1px solid #ccc;border-radius:4px;padding:4px}.btnX{font-size:18px;background-color:#49baf2;border:2px solid;border-radius:20px;color:#fff;padding:5px 15px;margin-top:16px;margin-right:16px}.btnX:focus{border-color:#c4c4c4}';
    const box = `<p><b>Replace:</b><input value="${htmlEscapeText(di)}" id="inputBx" type="text" spellcheck="false"></p>`;
    const buttons = `<div><button type="button" class="btnX" id="btn1">${htmlEscapeText(b1)}</button><button type="button" class="btnX" id="btn2">${htmlEscapeText(b2)}</button></div>`;
    WF.showAlertDialog(`<style>${htmlEscapeText(style)}</style><div>${b}</div>${box + buttons}`, t);
    setTimeout(function () {
      let userInput;
      const inputBx = document.getElementById("inputBx");
      const btn1 = document.getElementById("btn1");
      const btn2 = document.getElementById("btn2");
      inputBx.select();
      inputBx.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
          btn1.click();
        }
      });
      btn1.onclick = function () {
        userInput = inputBx.value;
        WF.hideDialog();
        setTimeout(function () {
          replaceMatches(Matches, rgx_gi, userInput)
        }, 50);
      };
      btn2.onclick = function () {
        userInput = inputBx.value;
        WF.hideDialog();
        setTimeout(function () {
          replaceMatches(Matches, rgx_g, userInput)
        }, 50);
      };
    }, 100);
  }
  if (!WF.currentSearchQuery()) {
    return void toastMsg('Use the searchbox to find. <a href="https://workflowy.com/s/findreplace-bookmark/ynKNSb5dA77p2siT" target="_blank">Click here for more information.</a>', 3, true);
  }
  const tQuery = WF.currentSearchQuery().trim();
  const Matches = findMatchingItems(editableItemWithVisibleMatch, WF.currentItem());
  const isQuoted = tQuery.match(/(")(.+)(")/);
  const find = isQuoted ? isQuoted[2] : tQuery.includes(" ") ? false : tQuery;
  if (find === false) {
    if (confirm('The search contains at least one space.\n\n1. Press OK to convert your search to "exact match".\n\n2. Activate Find/Replace again.')) {
      WF.search('"' + tQuery + '"');
    }
    return;
  }
  const Title = "Find/Replace";
  const modeTxt = isQuoted ? "Exact Match, " : "Single Word/Tag, ";
  const compTxt = `Completed: ${WF.completedVisible() ? "Included" : "Excluded"}`;
  const findTxt = isQuoted ? isQuoted[0] : tQuery;
  const body = `<p><b>Mode:</b><br>${modeTxt + compTxt}</p><p><b>Find:</b><br>${htmlEscapeText(findTxt)}</p>`;
  const findRgx = escapeForRegExp(htmlEscapeTextForContent(find));
  const rgx_gi = new RegExp(findRgx, "gi");
  const rgx_g = new RegExp(findRgx, "g");
  const allCount = countMatches(Matches, rgx_gi);
  const caseCount = countMatches(Matches, rgx_g);
  if (allCount > 0) {
    showFindReplaceDialog(body, Title, `Replace: All (${allCount})`, `Replace: Match Case (${caseCount})`, find);
  } else {
    WF.showAlertDialog(body + "<br><br><i>No matches found.</i>", Title);
  }
})();