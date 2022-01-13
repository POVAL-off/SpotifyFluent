(function fluent() {

  function waitForElement(els, func, timeout = 10000) {
    const queries = els.map(el => document.querySelector(el));
    if (queries.every(a => a)) {
      func();
    } else if (timeout > 0) {
      setTimeout(waitForElement, 300, els, func, timeout--);
    }
  }

  waitForElement([
    ".main-rootlist-rootlistItemLink"
  ], function () {
    function replacePlaylistIcons() {
      const playListItems = document.getElementsByClassName("main-rootlist-rootlistItemLink");

      for (const item of playListItems) {
        const link = item.pathname;
        let uri;
        if (link.search("playlist") !== -1) {
          uri = Spicetify.URI.playlistV2URI(link.split("/").pop());
        } else if (link.search("folder") !== -1) {
          item.style.content = "url('./fluentui-system-icons/ic_fluent_folder_24_filled.svg')"
          continue;
        }

        Spicetify.CosmosAsync.get(
          `sp://core-playlist/v1/playlist/${uri.toString()}/metadata`, {
          policy: {
            picture: true
          }
        }
        ).then(res => {
          const meta = res.metadata;
          if (meta.picture === "") {
            item.style.content = "url('./fluentui-system-icons/ic_fluent_music_note_2_24_filled.svg')"
          } else {
            item.style.backgroundImage = "url(" + meta.picture + ")";
            item.style.content = "";
          }
        });
      };

    };

    replacePlaylistIcons();
    const observer = new MutationObserver(replacePlaylistIcons);
    waitForElement(["#spicetify-playlist-list"], () => {
      const rootList = document.querySelector("#spicetify-playlist-list");
      observer.observe(rootList, {
        childList: true,
        subtree: true
      });
    });
  });

  waitForElement([
    ".main-navBar-navBarLink",
    "[href='/collection'] > span"
  ], () => {
    const navBarItems = document.getElementsByClassName("main-navBar-navBarLink");
    for (const item of navBarItems) {
      let div = document.createElement("div");
      div.classList.add("navBar-navBarLink-accent");
      item.appendChild(div);
    }
    document.querySelector("[href='/collection'] > span").innerHTML = "Library";
  });


  waitForElement([".x-settings-container"], () => {
    const expandMoreSettingsButton = document.querySelector(`.x-settings-button > button.main-buttons-button.main-button-outlined`);
    expandMoreSettingsButton.click();

    const audioQualityP = document.querySelector(`.x-settings-container > span > p.main-type-mesto`);
    const audioQualitySpan = document.querySelector(`.x-settings-container > span > span.main-type-mesto`);

    audioQualitySpan.innerHTML = `${audioQualitySpan.innerHTML}<br />${audioQualityP.innerHTML}`;
    audioQualityP.remove();

    const changeLocationButton = document.getElementById('desktop.settings.offline-storage');
    const newChangeLocationButtonContainer = document.createElement('div')
    newChangeLocationButtonContainer.setAttribute('class', 'x-settings-secondColumn change-location-button-container')
    changeLocationButton.parentNode.insertBefore(newChangeLocationButtonContainer, changeLocationButton)
    changeLocationButton.remove()
    const changeLocationButtonContainer = document.querySelector('.change-location-button-container');
    changeLocationButtonContainer.appendChild(changeLocationButton);

    const disableCookies = document.querySelector('.main-type-mesto[for="desktop.settings.cookiesDisabled"]')
    const newDisableCookiesContainer = document.createElement('span');
    newDisableCookiesContainer.innerHTML = disableCookies.innerHTML;
    disableCookies.innerHTML = '';
    disableCookies.appendChild(newDisableCookiesContainer);

    const secondColumns = document.querySelectorAll('span.x-settings-secondColumn');

    function wrap(el, wrapper) {
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }

    secondColumns.forEach((secondColumn) => {
      secondColumn.removeAttribute('class')
      const newSecondColumWrapepr = document.createElement('div')
      newSecondColumWrapepr.setAttribute('class', 'x-settings-secondColumn')
      wrap(secondColumn, newSecondColumWrapepr)
    })
  });

  setInterval(() => {
    const songAuthors = document.querySelectorAll('.LBeI_sl8sCSYFu5fPTsO > span');
    songAuthors.forEach((songAuthor, index) => {
      if (songAuthor.innerHTML.includes(',')) {
        songAuthor.innerHTML = songAuthor.innerHTML.replace(',', '');


        const newD = document.createElement('span')
        newD.innerHTML = '|';
        newD.style = 'display: flex; align-items: center; padding: 0 5px'
        songAuthor.parentNode.insertBefore(newD, songAuthor);
        // s.innerHTML = `${s.innerHTML} | `
      }
    })
  }, 10)

  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--spice-text');
  if (textColor == " #000000") {
    document.documentElement.style.setProperty('--filter-brightness', 0);
  }
    
  var interval = setInterval(function() {
    if (typeof Spicetify.Platform == 'undefined' || (typeof Spicetify.Platform.Translations.play == 'undefined' && typeof Spicetify.Platform.Translations.pause == 'undefined')) return;
      clearInterval(interval);
      var playButtonStyle = document.createElement('style');
      playButtonStyle.type = 'text/css';
      playButtonStyle.innerHTML = `
      .main-playButton-button[aria-label="${Spicetify.Platform.Translations.play}"],
      .main-playButton-PlayButton[aria-label="${Spicetify.Platform.Translations.play}"],
      .main-playPauseButton-button[aria-label="${Spicetify.Platform.Translations.play}"],
      .main-trackList-rowPlayPauseButton[aria-label="${Spicetify.Platform.Translations.play}"] {
        background: transparent url('./fluentui-system-icons/ic_fluent_play_24_filled.svg') no-repeat center;
        transition: background ease-out 167ms;
      }
      .main-playButton-button[aria-label="${Spicetify.Platform.Translations.pause}"],
      .main-playButton-PlayButton[aria-label="${Spicetify.Platform.Translations.pause}"],
      .main-playPauseButton-button[aria-label="${Spicetify.Platform.Translations.pause}"],
      .main-trackList-rowPlayPauseButton[aria-label="${Spicetify.Platform.Translations.pause}"] {
        background: transparent url('./fluentui-system-icons/ic_fluent_pause_24_filled.svg') no-repeat center;
        transition: background ease-out 167ms;
      }
      `;
      document.getElementsByTagName('head')[0].appendChild(playButtonStyle);
  }, 10)

})();
