/* Jared White Consulting - site behavior. Plain JavaScript, no build step, no libraries.
   Edit the CONFIG block for links and backend addresses. */
var CONFIG = {
  BOOK_URL: "https://calendar.app.google/3gdVnfZjGvbq7phD7",
  // Google Apps Script web apps. They accept a JSON body sent as text/plain (no CORS preflight).
  QUIZ_URL: "https://script.google.com/macros/s/AKfycbxodVJniJyPA3FdbvwVbN_rg6ROFeX9YhcNDCxNRkwogw_J7_M9CK3VmIgfMjbseqM6/exec",
  PLAN_URL: "https://script.google.com/macros/s/AKfycbxNfdW7RQs2vMLk15JgjQvBICRjdt6DZB6HC8109dbT2JqrcdbOFCsuDmu68IiftiqQ/exec"
};

(function () {
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  function post(url, data) {
    return fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json(); });
  }
  function visitorId() {
    var k = "jwc_vid", v = "";
    try { v = localStorage.getItem(k) || ""; } catch (e) {}
    if (!v) {
      v = String(Date.now()) + "." + Math.floor(Math.random() * 1e9);
      try { localStorage.setItem(k, v); } catch (e) {}
    }
    return v;
  }
  function seg(n, total) { var s = ""; for (var k = 0; k < total; k++) s += "<i" + (k < n ? ' class="on"' : "") + "></i>"; return '<div class="seg">' + s + "</div>"; }

  /* ---------- nav ---------- */
  var burger = $("burger"), menu = $("menu");
  if (burger && menu) {
    burger.onclick = function () {
      var open = menu.className.indexOf("open") < 0;
      menu.className = open ? "menu open" : "menu";
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    };
  }

  /* ---------- flip cards ---------- */
  each(document.querySelectorAll(".flip"), function (b) {
    b.addEventListener("click", function () {
      var on = b.className.indexOf(" on") < 0;
      b.className = on ? b.className + " on" : b.className.replace(" on", "");
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });

  /* ---------- 60-second tech check ---------- */
  var tc = $("techcheck");
  if (tc) {
    var Q = [
      ["Do you know who owns and controls your domain name (the address your website and email use)?", "Domain control", "If you can’t log in to the domain account, you can lose your website and email overnight."],
      ["Do at least two trusted people have admin access to your email and website accounts?", "Single point of failure", "When one person holds every login, a departure or a lost password can stop the organization."],
      ["Is multi-factor authentication turned on for email and other key accounts?", "Weak sign-in protection", "Without it, a stolen password alone is enough to get into your accounts."],
      ["Are your important files backed up, and have you tested restoring them?", "Untested backups", "A backup you have never restored from is a hope, not a plan."],
      ["When someone leaves, is their access removed within a week?", "Lingering access", "Former staff and volunteers can keep access to your data long after they are gone."],
      ["Are computers and software updated on a schedule instead of whenever they nag you?", "Irregular updates", "Missed updates are one of the easiest ways for problems to get in."],
      ["Do you keep a current list of your computers, software subscriptions, and who uses them?", "No inventory", "Without a list, you pay for software nobody uses and miss equipment that needs replacing."],
      ["Do you have a technology budget or plan for the next 12 months?", "No technology plan", "Surprise replacements and renewals land on the budget at the worst moments."]
    ];
    var ORG = ["Nonprofit", "Small business", "Other"];
    var PLAT = ["Google Workspace", "Microsoft 365", "Not sure"];
    var SIZE = ["1 to 5", "6 to 20", "21 to 50", "51 or more"];
    var qi = 0, ans = [], pick = { org: "", platform: "", size: "" }, token = "", planData = null;

    var tcAsk = function () {
      tc.innerHTML = seg(qi, Q.length) + '<div class="qn">Question ' + (qi + 1) + " of " + Q.length + '</div><p class="qt">' + esc(Q[qi][0]) +
        '</p><div class="ans"><button type="button" data-v="1">Yes</button><button type="button" data-v="0">No or not sure</button></div>' +
        (qi > 0 ? '<button type="button" class="backlink" id="tcback">Back</button>' : "");
      each(tc.querySelectorAll(".ans button"), function (b) {
        b.onclick = function () { ans[qi] = b.getAttribute("data-v") === "1"; qi++; if (qi < Q.length) tcAsk(); else tcTaps(); };
      });
      var bk = $("tcback"); if (bk) bk.onclick = function () { qi--; tcAsk(); };
    };
    var group = function (label, list, key) {
      var h = '<div class="qgroup"><p>' + label + '</p><div class="mini">';
      for (var k = 0; k < list.length; k++) h += '<button type="button" class="opt" data-k="' + key + '" data-v="' + esc(list[k]) + '" aria-pressed="' + (pick[key] === list[k] ? "true" : "false") + '">' + esc(list[k]) + "</button>";
      return h + "</div></div>";
    };
    var tcTaps = function () {
      tc.innerHTML = seg(Q.length, Q.length) + '<div class="qn">Almost done</div><p class="qt" style="margin-bottom:14px">Three quick taps so your plan fits you.</p>' +
        group("What kind of organization?", ORG, "org") + group("Where do your email and files live?", PLAT, "platform") + group("How many people on your team?", SIZE, "size") +
        '<label for="tcnote">Biggest tech headache right now <small>(optional, no personal details)</small></label><textarea id="tcnote" maxlength="200"></textarea>' +
        '<div class="ans"><button type="button" id="tcgo" style="flex:0 0 auto">Build my 30-day plan</button></div><div class="err" id="tcerr" role="alert"></div>';
      each(tc.querySelectorAll(".opt"), function (b) {
        b.onclick = function () {
          pick[b.getAttribute("data-k")] = b.getAttribute("data-v");
          each(tc.querySelectorAll('.opt[data-k="' + b.getAttribute("data-k") + '"]'), function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        };
      });
      $("tcgo").onclick = tcBuild;
    };
    var tcMsg = function (code) {
      return { rate: "You have built the maximum number of plans for now. Please try again in a few hours, or book a call.",
        cap: "Today’s limit for free plans has been reached. Please come back tomorrow, or book a call.",
        busy: "The tool is busy. Please try again in a minute.",
        expired: "Your plan expired. Please retake the check." }[code] || "Something went wrong. Please try again.";
    };
    var tcBuild = function () {
      if (!pick.org || !pick.platform || !pick.size) { $("tcerr").textContent = "Please tap one answer in each group."; return; }
      var gaps = []; for (var k = 0; k < Q.length; k++) if (!ans[k]) gaps.push(k);
      var note = $("tcnote").value;
      tc.innerHTML = '<div style="margin:auto;text-align:center"><p class="qt" style="margin:0 0 8px">Building your plan…</p><p class="muted">This usually takes about 15 seconds. Please keep this page open.</p></div>';
      post(CONFIG.PLAN_URL, { action: "plan", hp: "", vid: visitorId(), org: pick.org, platform: pick.platform, size: pick.size, note: note, gaps: gaps })
        .then(function (r) {
          if (r && r.ok) { token = r.token; planData = r.plan; tcResult(gaps); }
          else { tcTaps(); $("tcerr").textContent = tcMsg(r && r.error); }
        }).catch(function () { tcTaps(); $("tcerr").textContent = tcMsg(); });
    };
    var tcResult = function (gaps) {
      var yes = Q.length - gaps.length, h = '<div class="res plan"><div class="sc">' + yes + " of " + Q.length + " basics in place</div><h3>Your 30-day plan</h3><p>" + esc(planData.summary) + "</p>";
      var lastWeek = 0;
      for (var k = 0; k < planData.fixes.length; k++) {
        var f = planData.fixes[k];
        if (f.week !== lastWeek) { h += '<div class="wk">Week ' + esc(f.week) + "</div>"; lastWeek = f.week; }
        h += '<div class="fix"><b>' + esc(f.title) + '</b><small>Time needed: ' + esc(f.effort) + "</small><p style=\"margin:8px 0 0\">" + esc(f.why) + "</p><p style=\"margin:8px 0 0\"><b style=\"display:inline\">Do it yourself:</b> " + esc(f.diy) + '</p><div class="mine"><b>Or hand it to me:</b> ' + esc(f.help) + "</div></div>";
      }
      h += '<div class="wk">Where AI could give you hours back</div>';
      for (var j = 0; j < planData.ideas.length; j++) { var x = planData.ideas[j]; h += '<div class="gap"><b>' + esc(x.title) + " <small class=\"muted\">(" + esc(x.effort) + ")</small></b><span>" + esc(x.how) + "</span></div>"; }
      h += '<div class="wk">Get this plan by email</div><div class="fields"><div><label for="tcname">Your name</label><input id="tcname" type="text" maxlength="80" autocomplete="name"></div>' +
        '<div><label for="tcemail">Email</label><input id="tcemail" type="email" maxlength="120" autocomplete="email"></div>' +
        '<div><label for="tcorg">Organization <small>(optional)</small></label><input id="tcorg" type="text" maxlength="100" autocomplete="organization"></div>' +
        '<div><label for="tcphone">Phone <small>(optional)</small></label><input id="tcphone" type="tel" maxlength="30" autocomplete="tel"></div></div>' +
        '<div class="hp" aria-hidden="true"><label>Leave empty<input id="tchp" type="text" tabindex="-1" autocomplete="off"></label></div>' +
        '<div class="btns" style="margin-top:16px"><button type="button" class="btn" id="tcsend">Email me this plan</button><a class="btn ghost" href="' + CONFIG.BOOK_URL + '">Book a free call</a></div>' +
        '<div class="err" id="tcerr" role="alert"></div><p class="fine">I will email you the plan and may follow up once. Reply “no thanks” and I will not.</p></div>';
      tc.innerHTML = h;
      $("tcsend").onclick = function () {
        var email = $("tcemail").value.replace(/^\s+|\s+$/g, "");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $("tcerr").textContent = "Please enter a valid email address."; return; }
        var b = $("tcsend"); b.disabled = true; b.textContent = "Sending…";
        post(CONFIG.PLAN_URL, { action: "email", hp: $("tchp").value, vid: visitorId(), token: token, email: email, name: $("tcname").value, orgName: $("tcorg").value, phone: $("tcphone").value })
          .then(function (r) {
            if (r && r.ok) {
              tc.innerHTML = '<div class="res" style="margin:auto;text-align:center"><h3>Sent. Check your inbox.</h3><p class="muted">If it is not there in a few minutes, look in spam. Want to talk it through?</p><div class="btns" style="justify-content:center"><a class="btn" href="' + CONFIG.BOOK_URL + '">Book a free 20-minute call</a></div></div>';
            } else { b.disabled = false; b.textContent = "Email me this plan"; $("tcerr").textContent = tcMsg(r && r.error); }
          }).catch(function () { b.disabled = false; b.textContent = "Email me this plan"; $("tcerr").textContent = tcMsg(); });
      };
    };
    tcAsk();
  }

  /* ---------- AI readiness quiz ---------- */
  var aq = $("aiquiz");
  if (aq) {
    var OT = [["nonprofit", "Nonprofit"], ["forprofit", "For-profit business"], ["school_childcare", "School or childcare"], ["healthcare", "Healthcare"], ["government", "Government"], ["other", "Other"]];
    var SB = ["1-9", "10-50", "51-150", "150+"];
    var DT = [["children", "Information about children, students, or program participants"], ["health", "Health information"], ["donor", "Donor or customer information"], ["employee", "Employee or job applicant records"], ["payment", "Payment or bank account details"], ["none", "None of these"], ["notsure", "Not sure"]];
    var FU = [["donations", "Private donations"], ["grants", "Grants"], ["taxpayer", "Taxpayer funds or government contracts"], ["revenue", "Customer or client revenue"], ["other", "Other"], ["notsure", "Not sure"]];
    var QS = {
      q1: "Do you know which AI tools your staff use for work, including AI built into software you already own?",
      q2: "Is there a written list of approved AI tools?",
      q3: "Do staff need approval before using a new AI tool?",
      q4: "Do staff know what information must never go into an AI tool?",
      q5: "Do staff use business accounts with data protections instead of free personal accounts?",
      q6: "Has anyone read the privacy and data terms of the AI tools you use?",
      q7: "Do you have a written AI use policy?",
      q8: "Have staff acknowledged it in writing?",
      q9: "Do you have a plan for when someone enters sensitive information into an AI tool by mistake?",
      q10: "Has staff received any AI training in the past 12 months?",
      q11: "Do new hires learn your AI rules?",
      q12: "Is one named person responsible for AI questions?"
    };
    var AV = [["yes", "Yes"], ["partly", "Partly"], ["no", "No"], ["notsure", "Not sure"]];
    var S = { orgName: "", contactName: "", email: "", orgType: "", staffCount: "", dataTypes: [], funding: [], tools: "", gate: "", answers: {}, consent: false };
    var step = 0, TOTAL = 8, qerr = "";

    var sel = function (id, list, val) {
      var h = '<select id="' + id + '"><option value="">Choose one</option>';
      for (var k = 0; k < list.length; k++) { var v = list[k] instanceof Array ? list[k][0] : list[k], l = list[k] instanceof Array ? list[k][1] : list[k]; h += '<option value="' + esc(v) + '"' + (v === val ? " selected" : "") + ">" + esc(l) + "</option>"; }
      return h + "</select>";
    };
    var checks = function (name, list, arr) {
      var h = '<div class="row3">';
      for (var k = 0; k < list.length; k++) h += '<label class="chk"><input type="checkbox" name="' + name + '" value="' + list[k][0] + '"' + (arr.indexOf(list[k][0]) >= 0 ? " checked" : "") + "> " + esc(list[k][1]) + "</label>";
      return h + "</div>";
    };
    var qGroup = function (id) {
      var h = '<div class="qgroup"><p>' + esc(QS[id]) + '</p><div class="mini">';
      for (var k = 0; k < AV.length; k++) h += '<button type="button" class="opt" data-q="' + id + '" data-v="' + AV[k][0] + '" aria-pressed="' + (S.answers[id] === AV[k][0] ? "true" : "false") + '">' + AV[k][1] + "</button>";
      return h + "</div></div>";
    };
    var bindQ = function () {
      each(aq.querySelectorAll(".opt[data-q]"), function (b) {
        b.onclick = function () {
          S.answers[b.getAttribute("data-q")] = b.getAttribute("data-v");
          each(aq.querySelectorAll('.opt[data-q="' + b.getAttribute("data-q") + '"]'), function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        };
      });
    };
    var shell = function (title, intro, body, last) {
      aq.innerHTML = seg(step + 1, TOTAL) + '<div class="qn">Step ' + (step + 1) + " of " + TOTAL + '</div><h3 style="font-size:26px;margin-bottom:6px">' + title + "</h3>" +
        (intro ? '<p class="muted">' + intro + "</p>" : "") + body + '<div class="err" id="aerr" role="alert">' + esc(qerr) + "</div>" +
        '<div class="btns" style="margin-top:18px">' + (step > 0 ? '<button type="button" class="btn ghost" id="aback">Back</button>' : "") +
        '<button type="button" class="btn" id="anext">' + (last ? "Build my report" : "Next") + "</button></div>";
      qerr = "";
      $("anext").onclick = function () { var m = collect(); if (m) { qerr = m; render(); } else if (last) { submit(); } else { step++; render(); } };
      var bk = $("aback"); if (bk) bk.onclick = function () { collect(true); step--; render(); };
      bindQ();
    };
    var need = function (ids) { for (var k = 0; k < ids.length; k++) if (!S.answers[ids[k]]) return "Please answer every question on this step."; return ""; };
    var qIds = function () {
      return [["q1", "q2", "q3"], ["q4"].concat(S.gate === "no" ? [] : ["q5", "q6"]), ["q7", "q8", "q9"], ["q10", "q11", "q12"]];
    };
    var collect = function (soft) {
      var v = function (id) { var e = $(id); return e ? e.value : ""; };
      var ticked = function (name) { var a = []; each(aq.querySelectorAll('input[name="' + name + '"]:checked'), function (c) { a.push(c.value); }); return a; };
      if (step === 0) {
        S.orgName = v("aorg"); S.contactName = v("aname"); S.email = v("aemail"); S.orgType = v("aot"); S.staffCount = v("asb");
        if (soft) return "";
        if (!S.orgName.replace(/\s/g, "")) return "Please enter your organization name.";
        if (!S.contactName.replace(/\s/g, "")) return "Please enter your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(S.email.replace(/^\s+|\s+$/g, ""))) return "Please enter a valid email address.";
        if (!S.orgType) return "Please choose your organization type.";
        if (!S.staffCount) return "Please choose your staff size.";
      } else if (step === 1) {
        S.dataTypes = ticked("dt"); S.funding = ticked("fu"); S.tools = v("atools");
      } else if (step === 2) {
        if (!soft && !S.gate) return "Please choose one answer.";
      } else if (step >= 3 && step <= 6) {
        if (!soft) return need(qIds()[step - 3]);
      } else if (step === 7) {
        var c = $("aconsent"); S.consent = !!(c && c.checked);
        if (!soft && !S.consent) return "Please check the box to receive your report.";
      }
      return "";
    };
    var render = function () {
      if (step === 0) {
        shell("About your organization", "We use this to tailor your report and send it to you.",
          '<div class="fields"><div><label for="aorg">Organization name</label><input id="aorg" type="text" maxlength="100" value="' + esc(S.orgName) + '" autocomplete="organization"></div>' +
          '<div><label for="aname">Your name</label><input id="aname" type="text" maxlength="80" value="' + esc(S.contactName) + '" autocomplete="name"></div>' +
          '<div class="full"><label for="aemail">Email <small>(your report is sent here)</small></label><input id="aemail" type="email" maxlength="254" value="' + esc(S.email) + '" autocomplete="email"></div>' +
          '<div><label for="aot">Organization type</label>' + sel("aot", OT, S.orgType) + '</div><div><label for="asb">Number of staff</label>' + sel("asb", SB, S.staffCount) + "</div></div>" +
          '<p class="fine">Please do not enter names or personal information about clients, participants, or staff. Describe types of information only.</p>');
      } else if (step === 1) {
        shell("What information does your organization handle?", "Choose all that apply. This helps rank your gaps for an organization like yours.",
          "<label>Types of information your staff handle</label>" + checks("dt", DT, S.dataTypes) + '<label style="margin-top:18px">Funding sources</label>' + checks("fu", FU, S.funding) +
          '<label for="atools" style="margin-top:18px">AI tools your staff use, if you know <small>(optional)</small></label><textarea id="atools" maxlength="300" placeholder="For example: ChatGPT, Canva">' + esc(S.tools) + "</textarea>");
      } else if (step === 2) {
        shell("Do your staff use AI tools for work?", "Include AI built into software you already own, like writing helpers in email or office tools.",
          '<div class="mini" id="agate">' + [["yes", "Yes"], ["no", "No"], ["notsure", "Not sure"]].map(function (g) { return '<button type="button" class="opt" data-g="' + g[0] + '" aria-pressed="' + (S.gate === g[0] ? "true" : "false") + '">' + g[1] + "</button>"; }).join("") + "</div>" +
          '<p class="fine">If you choose No, two questions about AI tool accounts and vendor terms are skipped. Your score is still out of 100.</p>');
        each(aq.querySelectorAll(".opt[data-g]"), function (b) { b.onclick = function () { S.gate = b.getAttribute("data-g"); each(aq.querySelectorAll(".opt[data-g]"), function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); }); }; });
      } else if (step >= 3 && step <= 6) {
        var titles = ["Tool visibility", "Data handling", "Written rules", "Training and ownership"], ids = qIds()[step - 3], body = "";
        for (var k = 0; k < ids.length; k++) body += qGroup(ids[k]);
        shell(titles[step - 3], step === 4 && S.gate === "no" ? "Because your staff do not use AI tools, we skip two questions here." : "", body);
      } else {
        shell("Ready to build your report", "Report for " + esc(S.orgName) + ". It will be sent to " + esc(S.email) + ".",
          '<label class="chk"><input type="checkbox" id="aconsent"' + (S.consent ? " checked" : "") + '> <span>I agree to receive my AI readiness report and a follow-up about the free 20-minute review. My answers and email are saved so I can send your report and follow up. I never sell or share them.</span></label>' +
          '<div class="hp" aria-hidden="true"><label>Leave empty<input id="ahp" type="text" tabindex="-1" autocomplete="off"></label></div><p class="fine">You will see your score on screen right away. The full PDF arrives by email.</p>', true);
      }
    };
    var submit = function () {
      var answers = {}, all = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12"];
      for (var k = 0; k < all.length; k++) if (!(S.gate === "no" && (all[k] === "q5" || all[k] === "q6"))) answers[all[k]] = S.answers[all[k]];
      var hp = $("ahp") ? $("ahp").value : "";
      aq.innerHTML = '<div style="margin:auto;text-align:center"><p class="qt" style="margin:0 0 8px">Building your report…</p><p class="muted">This usually takes under 30 seconds. Please keep this page open.</p></div>';
      post(CONFIG.QUIZ_URL, { website: hp, consent: true, orgName: S.orgName, contactName: S.contactName, email: S.email.replace(/^\s+|\s+$/g, ""), orgType: S.orgType, staffCount: S.staffCount, gate: S.gate, answers: answers, dataTypes: S.dataTypes, funding: S.funding, tools: S.tools })
        .then(function (r) {
          if (r && r.ok && r.preview) { done(r.preview); }
          else if (r && r.ok) { aq.innerHTML = '<div class="res" style="margin:auto;text-align:center"><h3>Thank you</h3><p class="muted">Your report is on its way.</p></div>'; }
          else { step = 7; qerr = (r && r.message) || "Something went wrong. Please try again."; render(); }
        }).catch(function () { step = 7; qerr = "Something went wrong. Please try again."; render(); });
    };
    var done = function (p) {
      var h = '<div class="res"><div class="sc">Your AI readiness level</div><h3>' + esc(p.label) + " · " + esc(p.score) + " / 100</h3><p class=\"muted\">Report for " + esc(p.orgName) + "</p>";
      for (var k = 0; k < p.categories.length; k++) { var c = p.categories[k]; h += '<div class="gap"><b>' + esc(c.name) + " · " + (c.score == null ? "n/a" : esc(c.score) + "%") + "</b></div>"; }
      h += "<p style=\"margin-top:14px\">" + esc(p.topGapSentence) + '</p><p class="muted">Your full report with ranked gaps and free fixes is on its way to ' + esc(S.email) + ". If it is not there in a few minutes, check spam.</p>" +
        '<div class="btns" style="margin-top:14px"><a class="btn" href="' + CONFIG.BOOK_URL + '">Book your free 20-minute review</a></div><p class="fine">A score is a starting point, not a pass mark.</p></div>';
      aq.innerHTML = h;
    };
    render();
  }
})();
