"use strict";
// ==UserScript==
// @name        쇼핑몰 바로 접속 링크 생성
// @description 쇼핑몰에 바로 접속할 수 있는 링크를 생성합니다.
// @namespace   https://github.com/rudi2e
// @author      Rudi2e
// @version     0.1.2
// @license     MIT
// @homepage    https://github.com/rudi2e/userscripts
// @updateURL   https://github.com/rudi2e/userscripts/raw/main/dist/Direct_Shop_Link/Direct_Shop_Link.user.js
// @downloadURL https://github.com/rudi2e/userscripts/raw/main/dist/Direct_Shop_Link/Direct_Shop_Link.user.js
// @match       https://www.ppomppu.co.kr/*
// @match       https://m.ppomppu.co.kr/*
// @match       https://quasarzone.com/*
// @grant       GM_addStyle
// @noframes
// ==/UserScript==
void (function (W, D, L) {
    const cLog = (...text) => console.log('Direct Shop Link:', ...text);
    if (!GM_addStyle)
        throw Error('스크립트 실행에 필요한 권한이 없습니다.');
    GM_addStyle(`.direct_shop_link {
  background-color: rgb(31, 31, 31) !important;
  color: rgb(237, 237, 237) !important;
  padding: 0.25rem 0.5rem !important;
  margin: 0.25rem !important;
  font-size: 1rem !important;
  font-family: system-ui, -apple-system, ui-sans-serif, sans-serif !important;
  display: inline-block !important;
  border: solid 1px rgb(255, 255, 255) !important;
}`);
    const makeLink = (link, ele) => {
        const a = D.createElement('a');
        a.className = 'direct_shop_link';
        a.href = link;
        a.target = '_blank';
        a.innerText = '바로 접속';
        ele.after(a);
        ele.dataset.directShopLink = 'true';
        return a;
    };
    if (L.host === 'www.ppomppu.co.kr' || L.host === 'm.ppomppu.co.kr') {
        const launch = (e = D) => {
            const links = e.querySelectorAll('a[href^="https://s.ppomppu.co.kr"]:not(.scrap_bx_href, [data-direct-shop-link="true"])');
            for (const i of links) {
                const fixedOrigUrl = i.href.replace(/%26%23160%3B$/, '');
                const searchParams = new URLSearchParams(fixedOrigUrl);
                const [encode, target] = ['encode', 'target'].map((v) => searchParams.get(v));
                if (encode === 'on' && target) {
                    const fixedEncodeUrl = L.host === 'm.ppomppu.co.kr' ? target.replace(/\\/g, '') : target;
                    try {
                        const url = W.atob(fixedEncodeUrl);
                        const urlo = new URL(url);
                        if (urlo.host !== 'www.ppomppu.co.kr' && urlo.host !== 'm.ppomppu.co.kr') {
                            makeLink(url, i);
                        }
                    }
                    catch (e) {
                        cLog('오류가 발생했습니다.', e);
                    }
                }
            }
        };
        const commentEle = D.querySelector('div#quote');
        const observer = new MutationObserver((muts) => {
            for (const mut of muts) {
                for (const i of mut.addedNodes) {
                    if (i instanceof HTMLElement && i.classList.contains('comment_wrapper')) {
                        launch(i);
                    }
                }
            }
        });
        commentEle && observer.observe(commentEle, { childList: true });
        launch(D);
    }
    else if (L.host === 'quasarzone.com') {
        W.addEventListener('load', () => {
            const links = D.querySelectorAll('a[href^="javascript:goToLink("]');
            for (const i of links) {
                const regexResult = /javascript:goToLink\(["'](.+)["']\)/.exec(i.href);
                if (regexResult && regexResult[1]) {
                    try {
                        const url = W.atob(regexResult[1]);
                        makeLink(url, i);
                    }
                    catch (e) {
                        cLog('오류가 발생했습니다.', e);
                    }
                }
            }
        });
    }
})(window, document, location);
//# sourceMappingURL=Direct_Shop_Link.user.js.map