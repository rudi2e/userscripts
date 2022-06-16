// ==UserScript==
// @name        퀘이사존: 불필요한 알림 숨김
// @description 추천글 알림 등의 불필요한 알림을 숨깁니다.
// @namespace   https://github.com/rudi2e
// @author      Rudi2e
// @version     0.1.0
// @license     MIT
// @homepage    https://github.com/rudi2e/userscripts
// @icon        https://img2.quasarzone.com/homepage/real/themes/quasarzone/favicon/favicon.ico
// @updateURL   https://github.com/rudi2e/userscripts/raw/main/dist/Quasarzone-Hide_Unwanted_Alert/Quasarzone-Hide_Unwanted_Alert.user.js
// @downloadURL https://github.com/rudi2e/userscripts/raw/main/dist/Quasarzone-Hide_Unwanted_Alert/Quasarzone-Hide_Unwanted_Alert.user.js
// @match       https://quasarzone.com/*
// @noframes
// ==/UserScript==

void (function (W: Window, D: Document): void {
  const alertBox = D.querySelector<HTMLDivElement>('div.alert_box_wrap, div.mb_alert_box_wrap')
  if (!alertBox) return

  const observer = new MutationObserver((muts) => {
    for (const mut of muts) {
      for (const node of mut.addedNodes) {
        if (node instanceof HTMLDivElement && /(?:mb_)?alert_box/.test(node.className)) {
          // PC: div.alert_box, 모바일: div.mb_alert_box
          const alertTitle = node.querySelector<HTMLParagraphElement>(
            '.alert_title_box > p, .mb_alert_content > p'
          )

          if (
            alertTitle &&
            (alertTitle.innerText === '지금 뜨는 이야기' ||
              alertTitle.innerText.startsWith('[푸시]'))
          ) {
            node.style.display = 'none'
          }
        }
      }
    }
  })

  observer.observe(alertBox, { childList: true })
})(window, document)
