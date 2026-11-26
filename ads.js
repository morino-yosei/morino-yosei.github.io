// ブラウザ版の広告（Google の H5 Games Ads ＝ AdSense for games のリワード広告）。
// ゲーム（scripts/online/ads.gd）は window.morinoAds の state を見て進める:
//   off: 使えない / idle: 待機 / preparing: 用意中 / ready: 見せられる / showing: 見せている / done: 終わった（result に結果）
// 人間がすること: AdSense と「H5 ゲーム広告」の審査に通ったら、CLIENT に ca-pub- の番号を入れ、TEST を false にする。
(function () {
  var CLIENT = "ca-pub-XXXXXXXXXXXXXXXX";
  var TEST = true; // true のあいだは Google のテスト広告だけが出る（お金は動かない）

  var st = { state: "off", result: "" };
  window.morinoAds = st;
  if (CLIENT.indexOf("XXXX") >= 0) return;

  var s = document.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + CLIENT;
  s.setAttribute("data-ad-client", CLIENT);
  s.setAttribute("data-ad-frequency-hint", "30s");
  if (TEST) s.setAttribute("data-adbreak-test", "on");
  document.head.appendChild(s);

  window.adsbygoogle = window.adsbygoogle || [];
  window.adBreak = window.adConfig = function (o) { window.adsbygoogle.push(o); };
  window.adConfig({ preloadAdBreaks: "on", sound: "on" });

  var showFn = null;
  st.state = "idle";
  st.prepare = function (name) {
    if (st.state === "preparing" || st.state === "showing") return;
    st.state = "preparing";
    st.result = "";
    showFn = null;
    window.adBreak({
      type: "reward",
      name: name,
      beforeAd: function () { st.state = "showing"; },
      beforeReward: function (fn) { showFn = fn; st.state = "ready"; },
      adDismissed: function () { st.result = "dismissed"; },
      adViewed: function () { st.result = "viewed"; },
      adBreakDone: function (info) {
        if (!st.result) st.result = (info && info.breakStatus) || "done";
        st.state = "done";
      },
    });
  };
  st.show = function () {
    if (!showFn) return;
    var f = showFn;
    showFn = null;
    st.state = "showing";
    f();
  };
})();
