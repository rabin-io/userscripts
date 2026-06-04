// ==UserScript==
// @name         Jenkins Rebuild → ParamBuild Link
// @namespace    https://rabin.io/
// @version      2.0
// @description  Adds a ParamBuild link button on Jenkins rebuild pages (only non-default params)
// @match        https://jenkins-*/job/*/rebuild/parameterized
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function getJobApiUrl() {
    const path = window.location.pathname;
    const jobPath = path.replace(/\/\d+\/rebuild\/parameterized$/, '');
    return `${window.location.origin}${jobPath}/api/json?tree=property[parameterDefinitions[name,defaultParameterValue[value]]]`;
  }

  function getJobPath() {
    return window.location.pathname.replace(/\/\d+\/rebuild\/parameterized$/, '');
  }

  async function fetchDefaults() {
    const resp = await fetch(getJobApiUrl(), { credentials: 'include' });
    const data = await resp.json();
    const defaults = {};
    for (const prop of data.property || []) {
      for (const def of prop.parameterDefinitions || []) {
        const val = def.defaultParameterValue?.value;
        defaults[def.name] = val == null ? '' : String(val);
      }
    }
    return defaults;
  }

  function extractParameters() {
    const params = {};
    document.querySelectorAll('[name="parameter"]').forEach(block => {
      const nameEl = block.querySelector('input[name="name"]');
      if (!nameEl) return;
      const name = nameEl.value;

      const valueInput = block.querySelector('input[name="value"]');
      if (valueInput) {
        if (valueInput.type === 'checkbox') {
          params[name] = valueInput.checked ? 'true' : 'false';
        } else {
          params[name] = valueInput.value;
        }
        return;
      }

      const select = block.querySelector('select[name="value"]');
      if (select) {
        params[name] = select.value;
        return;
      }

      const textarea = block.querySelector('textarea[name="value"]');
      if (textarea) {
        params[name] = textarea.value;
        return;
      }
    });
    return params;
  }

  function buildParamBuildUrl(params) {
    const query = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    return `${window.location.origin}${getJobPath()}/parambuild?${query}`;
  }

  function setButtonState(link, copyBtn, url, changedCount, totalCount) {
    link.href = url;
    link.textContent = `Open ParamBuild (${changedCount}/${totalCount} params)`;
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(url);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy URL'; }, 1500);
    };
  }

  async function addButton() {
    const allParams = extractParameters();
    const totalCount = Object.keys(allParams).length;
    if (totalCount === 0) return;

    const container = document.createElement('div');
    container.style.cssText = 'margin:10px 0;display:flex;gap:8px;align-items:center;flex-wrap:wrap;';

    const link = document.createElement('a');
    link.target = '_blank';
    link.textContent = 'Loading defaults...';
    link.style.cssText = 'padding:6px 14px;background:#4b758b;color:#fff;border-radius:4px;text-decoration:none;font-weight:bold;';

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy URL';
    copyBtn.style.cssText = 'padding:6px 14px;background:#555;color:#fff;border:none;border-radius:4px;cursor:pointer;';

    const info = document.createElement('span');
    info.style.cssText = 'color:#888;font-size:12px;';

    container.appendChild(link);
    container.appendChild(copyBtn);
    container.appendChild(info);

    const form = document.querySelector('form[name="config"]') || document.querySelector('form');
    if (form) {
      form.parentNode.insertBefore(container, form);
    } else {
      document.querySelector('#main-panel')?.prepend(container);
    }

    let defaults;
    try {
      defaults = await fetchDefaults();
    } catch {
      defaults = null;
    }

    if (!defaults) {
      const url = buildParamBuildUrl(allParams);
      setButtonState(link, copyBtn, url, totalCount, totalCount);
      info.textContent = '(could not fetch defaults — all params included)';
      return;
    }

    const changed = {};
    for (const [k, v] of Object.entries(allParams)) {
      const def = defaults[k];
      if (def === undefined || v !== def) {
        changed[k] = v;
      }
    }

    if (Object.keys(changed).length === 0) {
      const url = buildParamBuildUrl({});
      link.href = `${window.location.origin}${getJobPath()}/build`;
      link.textContent = 'Build with defaults';
      info.textContent = '(all params match defaults)';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(link.href);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy URL'; }, 1500);
      };
      return;
    }

    const url = buildParamBuildUrl(changed);
    setButtonState(link, copyBtn, url, Object.keys(changed).length, totalCount);
    info.textContent = `URL length: ${url.length} chars`;
    if (url.length > 6000) {
      info.style.color = '#c00';
      info.textContent += ' (may be too long!)';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButton);
  } else {
    addButton();
  }
})();
