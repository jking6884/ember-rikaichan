import Ember from 'ember';

export default Ember.Service.extend({
  dictionary: Ember.inject.service(),

  dictCount: 1,
  altView  : 0,
  enabled  : 0,

  loadDictionary: function () {
    if (!this.dict) {
      try {
        this.dict = new ppcDict();
      }
      catch (ex) {
        alert('Error loading dictionary: ' + ex);
        return false;
      }
    }
    return true;
  },

  // The callback for onSelectionChanged
  // Just sends a message to the tab to enable itself if it hasn't
  // already
  onTabSelect : function (tabId) { ppcMain._onTabSelect(tabId); },
  _onTabSelect: function (tabId) {

    if ((this.enabled == 1)) {
      chrome.tabs.sendRequest(tabId, { "type": "enable", "config": ppcMain.config });
    }
  },

  miniHelp: '<span style="font-weight:bold">Perapera Chinese Popup Dictionary Enabled!</span><br><br>' +
  '<table cellspacing=5>' +
  '<tr><td>A</td><td>Alternate popup location</td></tr>' +
  '<tr><td>Y</td><td>Move popup location down</td></tr>' +
  '<tr><td>B</td><td>Previous character</td></tr>' +
  '<tr><td>M</td><td>Next character</td></tr>' +
  '<tr><td>N</td><td>Next word</td></tr>' +
  '</table>',


  // Function which enables the inline mode of rikaikun
  // Unlike rikaichan there is no lookup bar so this is the only enable.
  inlineEnable: function (tab, mode) {
    if (!this.dict) {
      //	var time = (new Date()).getTime();
      if (!this.loadDictionary()) {
        return;
      }
      //	time = (((new Date()).getTime() - time) / 1000).toFixed(2);
    }

    // Send message to current tab to add listeners and create stuff
    chrome.tabs.sendRequest(tab.id, { "type": "enable", "config": ppcMain.config });
    this.enabled = 1;

    if (mode == 1) {
      chrome.tabs.sendRequest(tab.id, { "type": "showPopup", "text": ppcMain.miniHelp });
    }
    chrome.browserAction.setIcon({ "path": "images/toolbar-enabled.png" });
    // chrome.browserAction.setBadgeBackgroundColor({"color":[255,0,0,255]});
    // chrome.browserAction.setBadgeText({"text":"On"});
  },

  // This function diables
  inlineDisable: function (tab, mode) {
    // Delete dictionary object after we implement it
    delete this.dict;

    this.enabled = 0;
    chrome.browserAction.setIcon({ "path": "images/toolbar-disabled.png" });
    // chrome.browserAction.setBadgeBackgroundColor({"color":[0,0,0,0]});
    // chrome.browserAction.setBadgeText({"text":""});

    // Send a disable message to all browsers
    var windows = chrome.windows.getAll({ "populate": true },
      function (windows) {
        for (var i = 0; i < windows.length; ++i) {
          var tabs = windows[i].tabs;
          for (var j = 0; j < tabs.length; ++j) {
            chrome.tabs.sendRequest(tabs[j].id, { "type": "disable" });
          }
        }
      });
  },

  inlineToggle: function (tab) {
    if (ppcMain.enabled) {
      ppcMain.inlineDisable(tab, 1);
    } else {
      ppcMain.inlineEnable(tab, 1);
    }
  },

  search: function (text) {
    //leaving this shit in here for the future if i wanna do a hanzi dict
    var showMode = 0;
    var m        = showMode;
    var e        = null;

    do {
      switch (showMode) {
        case 0:
          e = this.get('dictionary').wordSearch(text);
          break;
        //case this.hanziN:
        //e = this.dict.kanjiSearch(text.charAt(0));
//				break;
      }
      if (e) {
        break;
      }
      showMode = (showMode + 1) % this.dictCount;
    } while (showMode != m);

    return e;
  }
});
