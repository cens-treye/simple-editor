require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs" } });

require(["vs/editor/editor.main"], function () {
  const editor = monaco.editor.create(document.getElementById("editor"), {
    value: "",
    language: "cpp",
    theme: "vs-dark",
  });

  // ウィンドウのリサイズイベントに対してエディターのレイアウトを更新
  window.addEventListener("resize", () => {
    editor.layout();
  });

  // Monaco Editorでサポートされている言語一覧を取得して、セレクトボックスに追加
  const languageSelector = document.getElementById("language-selector");
  const languages = monaco.languages.getLanguages();

  languages.forEach((language) => {
    const option = document.createElement("option");
    option.value = language.id;
    option.textContent = language.aliases ? language.aliases[0] : language.id;
    languageSelector.appendChild(option);
  });

  // 言語セレクタの変更イベントに対応
  languageSelector.addEventListener("change", function () {
    const newLanguage = this.value;
    monaco.editor.setModelLanguage(editor.getModel(), newLanguage);
  });

  // カスタムテーマを読み込む関数
  const loadTheme = (themeName, themePath) => {
    fetch(themePath)
      .then((response) => response.json())
      .then((data) => {
        monaco.editor.defineTheme(themeName, data);
        if (!loadedThemes[themeName]) {
          loadedThemes[themeName] = true;
          monaco.editor.setTheme(themeName); // カスタムテーマを高速に変更すると、テーマが正しく適用されないことがある
        }
      });
  };

  // TODO: https://github.com/brijeshb42/monaco-themes/blob/master/scripts/download.jsを用いてテーマをダウンロードする
  const customThemes = {
    cobalt: "https://raw.githubusercontent.com/brijeshb42/monaco-themes/master/themes/Cobalt.json",
    monokai: "https://raw.githubusercontent.com/brijeshb42/monaco-themes/master/themes/Monokai.json",
    "night-owl": "https://raw.githubusercontent.com/brijeshb42/monaco-themes/master/themes/Night Owl.json",
    "solarized-dark": "https://raw.githubusercontent.com/brijeshb42/monaco-themes/master/themes/Solarized-dark.json",
    "solarized-light": "https://raw.githubusercontent.com/brijeshb42/monaco-themes/master/themes/Solarized-light.json",
  };

  // monacoの標準テーマをセレクトボックスに追加（vscodeの標準テーマはセレクタに表示し、選択されたときにテーマをロードする）
  const themeSelector = document.getElementById("theme-selector");
  const loadedThemes = {};
  const standardThemes = ["vs", "vs-dark", "hc-black", "hc-light"];
  standardThemes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    themeSelector.appendChild(option);
    loadedThemes[theme] = true;
  });
  Object.keys(customThemes).forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    themeSelector.appendChild(option);
    loadedThemes[theme] = false;
  });
  themeSelector.addEventListener("change", function () {
    const newTheme = this.value;
    if (!loadedThemes[newTheme]) {
      loadTheme(newTheme, customThemes[newTheme]);
    } else {
      monaco.editor.setTheme(newTheme);
    }
  });

  // デフォルト
  monaco.editor.setModelLanguage(editor.getModel(), "cpp");
  editor.setValue(`// cpp code here...`);
  languageSelector.value = "cpp";
});
