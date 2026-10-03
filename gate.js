/* 수강생 확인(2026-10-03) — 게시 주소 /leess/gate.js. 명단 자료는 /leess/roster.js(매일 sync_roster.py가 REGISTER 학생명단에서 만든다).
   내신관리 앱: roster.js의 naesin[앱]이 이름 드롭다운이 된다. 수업관리 앱: 명단을 보여 주지 않고, 직접 쓴 이름의 해시가 h에 있어야 시작된다.
   전주비전대 앱(R.vapps): 학원 명단 대신 대학 수강 명단 해시(R.v)로 확인. 이름 칸이 없는 워크북은 LEESS.wall()이 처음에 이름을 묻는다.
   roster.js·gate.js를 못 불러오면(인터넷 끊김 등) 확인 없이 시작을 허용한다. */
(function () {
  var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  function sha256(str) {
    var b = Array.from(new TextEncoder().encode(str)), l = b.length * 8;
    b.push(0x80); while (b.length % 64 !== 56) b.push(0);
    for (var i = 7; i >= 0; i--) b.push(i >= 4 ? 0 : (l >>> (i * 8)) & 255);
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19], W = new Array(64);
    var r = function (x, n) { return (x >>> n) | (x << (32 - n)); };
    for (var o = 0; o < b.length; o += 64) {
      for (var t = 0; t < 16; t++) W[t] = (b[o + 4 * t] << 24) | (b[o + 4 * t + 1] << 16) | (b[o + 4 * t + 2] << 8) | b[o + 4 * t + 3];
      for (t = 16; t < 64; t++) {
        var s0 = r(W[t - 15], 7) ^ r(W[t - 15], 18) ^ (W[t - 15] >>> 3), s1 = r(W[t - 2], 17) ^ r(W[t - 2], 19) ^ (W[t - 2] >>> 10);
        W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
      }
      var a = H[0], c = H[1], d = H[2], e = H[3], f = H[4], g = H[5], h = H[6], k = H[7];
      for (t = 0; t < 64; t++) {
        var T1 = (k + (r(f, 6) ^ r(f, 11) ^ r(f, 25)) + ((f & g) ^ (~f & h)) + K[t] + W[t]) | 0;
        var T2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & c) ^ (a & d) ^ (c & d))) | 0;
        k = h; h = g; g = f; f = (e + T1) | 0; e = d; d = c; c = a; a = (T1 + T2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + c) | 0; H[2] = (H[2] + d) | 0; H[3] = (H[3] + e) | 0;
      H[4] = (H[4] + f) | 0; H[5] = (H[5] + g) | 0; H[6] = (H[6] + h) | 0; H[7] = (H[7] + k) | 0;
    }
    return H.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }
  var norm = function (s) { return String(s || '').normalize('NFC').replace(/\s+/g, ''); };
  var app = (location.pathname.split('/')[1] || '').toLowerCase();
  var R = window.LEESS_ROSTER;
  var list = function () { return R && R.naesin && Array.isArray(R.naesin[app]) ? R.naesin[app] : null; };
  var hx = function (n) { return sha256(R.salt + n).slice(0, 16); };
  // 예외(모든 앱 허용, 명단에는 안 보임): 이 기기에서 한 번 확인되면 'leess-me'에 기억 → 이 기기 드롭다운에만 나타난다
  var isX = function (n) { return !!(R && n && (R.x || []).indexOf(hx(n)) >= 0); };
  var V = !!(R && (R.vapps || []).indexOf(app) >= 0);   // 전주비전대 앱
  var xApp = function () { return !(R && (R.exact || []).indexOf(app) >= 0); };
  var me = function () { try { return norm(localStorage.getItem('leess-me') || ''); } catch (e) { return ''; } };
  var remember = function (n) { try { if (isX(n)) localStorage.setItem('leess-me', n); } catch (e) {} };
  try { var q = new URLSearchParams(location.search).get('me'); if (q) remember(norm(q)); } catch (e) {}   // 주소 뒤 ?me=이름 으로도 기억
  window.LEESS = {
    app: app, sha256: sha256,
    apply: function (cfg) {   // 내신 = 학교·학년 명단 드롭다운, 수업 = 빈 명단(직접 입력)
      if (!R || !cfg) return;
      var L = list() ? list().slice() : [], m = me();
      if (list() && xApp() && isX(m) && L.indexOf(m) < 0) L.push(m);
      cfg.roster = L;
    },
    ok: function (name) {
      var n = norm(name); if (!n) return false; if (!R) return true;   // 명단을 못 불러오면 막지 않는다(사용자 지시 10-03)
      if (V) return (R.v || []).indexOf(hx(n)) >= 0 || isX(n);
      var L = list();
      if (L) return L.some(function (x) { return norm(x) === n; }) || (xApp() && isX(n));
      var ok = R.h.indexOf(hx(n)) >= 0; if (ok) remember(n); return ok;
    },
    msg: function () {
      if (V) return '수강 명단에 없는 이름입니다. 학교에 등록된 실명을 띄어쓰기 없이 정확히 입력하세요.';
      var L = list();
      if (L && !L.length) return '지금은 이 앱을 이용할 수 있는 등록 학생이 없습니다. 선생님께 문의하세요.';
      if (L) return '명단에서 본인 이름을 선택해야 시작할 수 있습니다.';
      return '등록된 수강생 이름이 아닙니다. 학원에 등록한 이름(실명)을 정확히 입력하세요.';
    },
    wall: function () {   // 이름 칸이 없는 페이지(비전대 워크북): 처음 한 번 이름을 묻고 이 기기에 기억한다
      if (!R || !V) return;
      var K = 'leess-vname', saved = ''; try { saved = localStorage.getItem(K) || ''; } catch (e) {}
      if (saved && this.ok(saved)) return;
      var self = this, d = document.createElement('div');
      d.setAttribute('style', 'position:fixed;inset:0;z-index:99999;background:rgba(20,20,24,.92);display:flex;align-items:center;justify-content:center;padding:16px');
      d.innerHTML = '<div style="background:#fff;color:#1c1d21;border-radius:14px;padding:22px;max-width:360px;width:100%;font:16px/1.6 -apple-system,sans-serif">'
        + '<b>수강생 확인</b><p style="margin:6px 0 12px;font-size:14px">전주비전대학교 수강생만 이용할 수 있습니다. 본인 이름(실명)을 입력하세요.</p>'
        + '<input id="leessWallName" autocomplete="off" placeholder="이름" style="width:100%;box-sizing:border-box;font:inherit;padding:10px;border:1px solid #bbb;border-radius:8px">'
        + '<p id="leessWallMsg" style="color:#c0392b;font-size:14px;min-height:1.4em;margin:8px 0"></p>'
        + '<button id="leessWallGo" style="width:100%;font:inherit;padding:10px;border:0;border-radius:8px;background:#2f5bd3;color:#fff">확인</button></div>';
      var go = function () {
        var n = norm(document.getElementById('leessWallName').value);
        if (self.ok(n)) { try { localStorage.setItem(K, n); } catch (e) {} d.remove(); }
        else document.getElementById('leessWallMsg').textContent = n ? self.msg() : '이름을 입력하세요.';
      };
      var put = function () {
        document.body.appendChild(d);
        document.getElementById('leessWallGo').onclick = go;
        document.getElementById('leessWallName').onkeydown = function (e) { if (e.key === 'Enter') go(); };
      };
      if (document.body) put(); else document.addEventListener('DOMContentLoaded', put);
    }
  };
})();
