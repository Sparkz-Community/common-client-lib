import {colors} from 'quasar';

export default function useCssVars() {
  function $getAllCssVars(element = document.body) {
    if (!(element instanceof Element)) {
      throw new TypeError('Expected a DOM element');
    }
    let styles = element.style;
    let cssVars = [];
    for (let i = styles.length; i--;) {
      if (styles[i].startsWith('--')) {
        cssVars.push(styles[i]);
      }
    }
    return cssVars;
  }

  function $removeAllCssVars(element = document.body) {
    if (!(element instanceof Element)) {
      throw new TypeError('Expected a DOM element');
    }
    $getAllCssVars(element).forEach(k => {
      $removeCssVar(k, element);
    });
  }

  function $getCssVar(css_var, element = document.body) {
    if (typeof css_var !== 'string') {
      throw new TypeError('Expected a string as css_var');
    }
    if (!(element instanceof Element)) {
      throw new TypeError('Expected a DOM element');
    }
    let styles = getComputedStyle(element);
    let value = String(styles.getPropertyValue(css_var)).trim();
    if (!value) {
      styles = getComputedStyle(document.documentElement);
      value = String(styles.getPropertyValue(css_var)).trim();
    }
    return value || null;
  }

  function $setCssVar(css_var, value, element = document.body) {
    if (typeof css_var !== 'string') {
      throw new TypeError('Expected a string as css_var');
    }
    if (typeof value !== 'string') {
      throw new TypeError('Expected a string as value');
    }
    if (!(element instanceof Element)) {
      throw new TypeError('Expected a DOM element');
    }
    let styles = element.style;
    styles.setProperty(css_var, value);
  }

  function $removeCssVar(css_var, element = document.body) {
    if (typeof css_var !== 'string') {
      throw new TypeError('Expected a string as css_var');
    }
    if (!(element instanceof Element)) {
      throw new TypeError('Expected a DOM element');
    }
    let styles = element.style;
    styles.removeProperty(css_var);
  }

  function $getTextColor(css_var) {
    let rgba = colors.hexToRgb($getCssVar(css_var));

    if ((rgba['r'] * 0.299) + (rgba['g'] * 0.587) + (rgba['b'] * 0.114) > 186) {
      return 'black';
    } else {
      return 'white';
    }
  }

  function $isCssVarDark(css_var) {
    let rgba = colors.hexToRgb($getCssVar(css_var));

    return (rgba['r'] * 0.299) + (rgba['g'] * 0.587) + (rgba['b'] * 0.114) <= 186;
  }

  function $isHexDark(hex) {
    let rgba = colors.hexToRgb(hex);

    return (rgba['r'] * 0.299) + (rgba['g'] * 0.587) + (rgba['b'] * 0.114) <= 186;
  }
  return {
    $getAllCssVars,
    $removeAllCssVars,
    $getCssVar,
    $setCssVar,
    $removeCssVar,
    $getTextColor,
    $isCssVarDark,
    $isHexDark,
  };
}
