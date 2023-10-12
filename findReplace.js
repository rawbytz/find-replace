(function FR_2_3() {
  function toastMsg(str, sec, err) {
    WF.showMessage(str, err);
    setTimeout(WF.hideMessage, (sec || 2) * 1000);
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
  // function countMatches(items, rgx) {
  //   let matchCount = 0;
  //   items.forEach(item => {
  //     let result = item.data.search_result;
  //     if (result.nameMatches) {
  //       let nameMatch = item.getName().match(rgx);
  //       if (nameMatch) matchCount += nameMatch.length;
  //     }
  //     if (result.noteMatches) {
  //       let noteMatch = item.getNote().match(rgx);
  //       if (noteMatch) matchCount += noteMatch.length;
  //     }
  //   });
  //   return matchCount;
  // }
  const htmlEscTextForContent = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\u00A0/g, "&nbsp;");
  // function replaceMatches(items, rgx, r) {
  //   WF.editGroup(function () {
  //     items.forEach(item => {
  //       let result = item.data.search_result;
  //       if (result.nameMatches) WF.setItemName(item, item.getName().replace(rgx, htmlEscTextForContent(r)));
  //       if (result.noteMatches) WF.setItemNote(item, item.getNote().replace(rgx, htmlEscTextForContent(r)));
  //     });
  //   });
  //   r === "" ? WF.clearSearch() : WF.search(tQuery.replace(find, r));
  // }
  const htmlEscText = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  function getColors() {
    const p = document.querySelector(".page.active");
    return p ? `color:${getComputedStyle(p).color};background:${getComputedStyle(p).backgroundColor};` : "";
  }

  /* Popup Box for entering the data */
  function showFindReplaceDialog(BODY, TITLE, aCount, cCount, searchValue) {
    const addButton = (num, name) => `<button type="button" class="btnX" id="btn${num.toString()}">${name}</button>`;
    const boxStyle = `#inputBx{${getColors()}width:95%;height:20px;display:block;margin-top:5px;border:1px solid #ccc;border-radius:4px;padding:4px}`;
    const btnStyle = `.btnX{font-size:18px;background-color:steelblue;border:2px solid;border-radius:20px;color:#fff;padding:5px 15px;margin-top:16px;margin-right:16px}.btnX:focus{border-color:#c4c4c4}`;
    const box = `<div><b>Replace:</b><input value="${htmlEscText(searchValue)}" id="inputBx" type="text" spellcheck="false"></div>`;
    const buttons = addButton(1, `Replace: All (${aCount})`) + addButton(2, `Replace: Match Case (${cCount})`);
    WF.showAlertDialog(`<style>${boxStyle + btnStyle}</style><div>${BODY}</div>${box}<div>${buttons}</div>`, TITLE);
    const intervalId = setInterval(function () {
      let inputBx = document.getElementById("inputBx");
      if (inputBx) {
        clearInterval(intervalId);
        let userInput;
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
      }
    }, 50);
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

  const title = "Bee Dictionary Search";
  const modeTxt = isQuoted ? "Exact Match, " : "Single Word/Tag, ";
  const compTxt = `Completed: ${WF.completedVisible() ? "Included" : "Excluded"}`;
  const findTxt = isQuoted ? isQuoted[0] : tQuery;
  const body = `<p><b>Mode:</b><br>${modeTxt + compTxt}</p><p><b>Find:</b><br>${htmlEscText(findTxt)}</p>`;
  const findRgx = escapeForRegExp(htmlEscTextForContent(find));
  const rgx_gi = new RegExp(findRgx, "gi");
  const rgx_g = new RegExp(findRgx, "g");
  const allCount = countMatches(Matches, rgx_gi);
  const caseCount = countMatches(Matches, rgx_g);
  if (allCount > 0) {
    showFindReplaceDialog(body, title, allCount, caseCount, find);
  } else {
    WF.showAlertDialog(`${body}<br><br><i>No matches found.</i>`, title);
  }
})();