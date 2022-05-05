"use strict";
// ==UserScript==
// @name        네이버: 자동 다크 모드
// @description 브라우저의 다크 모드 설정에 따라서 자동으로 다크 모드로 전환합니다.
// @namespace   https://github.com/rudi2e
// @author      Rudi2e
// @version     0.1.0
// @license     MIT
// @homepage    https://github.com/rudi2e/webbrowser-scripts
// @icon        https://www.naver.com/favicon.ico
// @updateURL   https://github.com/rudi2e/webbrowser-scripts/raw/main/dist/Naver-Auto_Dark_Mode/Naver-Auto_Dark_Mode.user.js
// @downloadURL https://github.com/rudi2e/webbrowser-scripts/raw/main/dist/Naver-Auto_Dark_Mode/Naver-Auto_Dark_Mode.user.js
// @match       https://www.naver.com/*
// @noframes
// ==/UserScript==
void (function (W, D, L) {
    const darkMode = W.matchMedia('(prefers-color-scheme: dark)');
    if (L.host === 'www.naver.com') {
        const { dark } = D.documentElement.dataset;
        if (dark) {
            /**
             * 브라우저 다크 모드와 페이지의 다크 모드가 일치하는지 확인한다.
             *
             * @returns
             * - 일치하면 `true`
             * - 아니면 `false`
             */
            const matchMode = () => (darkMode.matches && dark === 'true') || (!darkMode.matches && dark === 'false');
            /**
             * 다크 모드 또는 일반 모드로 전환한다.
             *
             * @param mode 다크 모드 전환 값
             * - `undefined` 자동
             * - `true` 다크 모드
             * - `false` 일반 모드
             */
            const switchMode = (mode) => {
                const nDarkMode = mode === undefined ? (matchMode() ? null : darkMode.matches) : mode;
                if (typeof nDarkMode === 'boolean') {
                    D.cookie = `NDARK=${nDarkMode ? 'Y' : 'N'}; domain=naver.com; max-age=31536000`; // 1 Year
                    L.reload();
                }
            };
            darkMode.addEventListener('change', function () {
                switchMode();
            });
            switchMode();
        }
    }
})(window, document, location);
