"use strict";

const questions = [
  "您与孩子的关系为",
  "您的年龄为",
  "最近有什么烦恼吗",
  "您认为自己的孩子心理健康吗？",
  "您年轻的时候有什么遗憾吗？",
  "您满意自己的孩子吗，如果有，请写出不满意的方面",
  "您有几个孩子，如果有两个及以上，您自认为是否有偏心一方的想法",
  "您成为父亲/母亲以来，孩子做过的最令您温暖/骄傲的事情是什么？",
  "在过去为孩子规划的人生中，您是否有后悔的事情？",
  "您最希望孩子送您的礼物是什么？",
  "请分别写出您孩子的优点与缺点（每项至少两个）",
  "如果在孩子未来的人生道路中，有与您截然相反的想法，您会怎么做？",
  "您觉得生活中最幸福的事情是什么？",
  "在您心里，幸福的生活是什么样子的？",
  "你觉得你的孩子是一个什么样子的人？",
  "您希望孩子未来成为一个什么样子的人？",
  "您觉得人生的意义是什么？",
  "您近期的愿望是什么？",
  "您有什么心愿？",
  "有机会的话最想去哪里旅游？",
  "如果您手里有多余的200块钱，你会如何支配呢？",
  "如果不考虑任何因素，您现在最想拥有一个东西或者做一件事情是什么？",
  "您觉得自己是一位合格的父亲/母亲吗？如果觉得不是，请说出理由。",
  "你最想对自己说什么？",
  "您有什么想对孩子说的？"
];

const form = document.querySelector("#survey");
const container = document.querySelector("#questions");
const submitButton = document.querySelector("#submit-button");
const status = document.querySelector("#form-status");
const consent = document.querySelector("#consent");
let submitting = false;
let submitted = false;

questions.forEach((title, index) => {
  const number = index + 1;
  const group = document.createElement("fieldset");
  group.className = "question";
  const legend = document.createElement("legend");
  legend.textContent = `${number}. ${title}`;
  const star = document.createElement("span");
  star.className = "required";
  star.textContent = " *";
  star.setAttribute("aria-hidden", "true");
  legend.append(star);
  group.append(legend);
  const parts = number === 11 ? ["优点一", "优点二", "缺点一", "缺点二"] : [""];
  parts.forEach((part, partIndex) => {
    const id = `q${number}${part ? `-${partIndex + 1}` : ""}`;
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = part || `第 ${number} 题的回答`;
    if (!part) label.className = "sr-only";
    const field = document.createElement(number <= 2 || part ? "input" : "textarea");
    field.id = id;
    field.name = `${String(number).padStart(2, "0")}. ${title}${part ? ` / ${part}` : ""}`;
    field.required = true;
    field.maxLength = 2000;
    field.setAttribute("aria-describedby", `error-${number}`);
    if (number === 2) {
      field.type = "number";
      field.min = "1";
      field.max = "120";
      field.step = "1";
      field.inputMode = "numeric";
      field.placeholder = "请输入周岁年龄";
    } else {
      if (field.tagName === "INPUT") field.type = "text";
      else field.rows = 3;
      field.placeholder = part ? `请填写${part}` : "请填写您的回答";
    }
    group.append(label, field);
  });
  const error = document.createElement("p");
  error.id = `error-${number}`;
  error.className = "error";
  error.hidden = true;
  group.append(error);
  container.append(group);
});

const groups = Array.from(container.querySelectorAll("fieldset"));
const fields = Array.from(container.querySelectorAll("input, textarea"));
const endpoint = window.SURVEY_CONFIG?.formspreeEndpoint || "";
const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint);
if (configured) form.action = endpoint;
document.querySelector("#setup-notice").hidden = configured;
submitButton.disabled = !configured;
submitButton.textContent = configured ? "提交问卷" : "暂未开放提交";
form.hidden = false;

function valid(field) {
  return Boolean(field.value.trim()) && field.validity.valid;
}

function updateProgress() {
  const count = groups.filter(group => Array.from(group.querySelectorAll("input, textarea")).every(valid)).length;
  document.querySelector("#progress").value = count;
  document.querySelector("#progress-text").textContent = `已完成 ${count} / 25 题`;
}

function validateGroup(group) {
  const inputs = Array.from(group.querySelectorAll("input, textarea"));
  const invalid = inputs.filter(field => !valid(field));
  const error = group.querySelector(".error");
  error.hidden = !invalid.length;
  error.textContent = inputs[0].type === "number" ? "请填写 1 至 120 之间的整数年龄。" : inputs.length > 1 ? "请分别填写两个优点和两个缺点。" : "请填写此题；如不便回答，可填写“不愿回答”。";
  inputs.forEach(field => field.setAttribute("aria-invalid", String(invalid.includes(field))));
  return invalid[0];
}

form.addEventListener("input", event => {
  if (event.target.closest(".question")) {
    const group = event.target.closest(".question");
    if (!group.querySelector(".error").hidden) validateGroup(group);
    updateProgress();
  }
  if (event.target === consent) {
    document.querySelector("#consent-error").hidden = consent.checked;
    consent.setAttribute("aria-invalid", String(!consent.checked));
  }
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (submitting || submitted || !configured) return;
  status.hidden = true;
  const firstInvalid = groups.map(validateGroup).find(Boolean);
  document.querySelector("#consent-error").hidden = consent.checked;
  consent.setAttribute("aria-invalid", String(!consent.checked));
  if (firstInvalid || !consent.checked) {
    status.textContent = firstInvalid ? "还有题目未完成，请检查标红的位置。" : "请阅读并同意提交说明。";
    status.hidden = false;
    (firstInvalid || consent).focus();
    return;
  }
  submitting = true;
  submitButton.disabled = true;
  submitButton.textContent = "正在提交，请稍候…";
  form.setAttribute("aria-busy", "true");
  const payload = new FormData();
  fields.forEach(field => payload.append(field.name, field.value.trim()));
  payload.append("_subject", "大学毕业生家长调查问卷 · 新回答");
  payload.append("提交说明", "已阅读并同意提交");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  // shortcut: 接收地址由 Formspree 校验和限流；正式收集前需在后台开启反垃圾和来源限制。
  try {
    const response = await fetch(endpoint, {
      method: "POST", body: payload, headers: { Accept: "application/json" },
      credentials: "omit", redirect: "error", signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error("not-accepted");
    submitted = true;
    form.reset();
    form.hidden = true;
    document.querySelector(".intro").hidden = true;
    document.querySelector("#progress-header").hidden = true;
    const success = document.querySelector("#success");
    success.hidden = false;
    success.focus();
    window.scrollTo(0, 0);
  } catch {
    status.textContent = "暂时无法确认提交结果，您的填写内容仍保留在本页。请勿关闭或刷新；请检查网络后再试。若提交曾长时间等待，可先联系发布者确认是否已收到，以免重复提交。";
    status.hidden = false;
    status.scrollIntoView({ block: "center" });
  } finally {
    clearTimeout(timer);
    submitting = false;
    form.removeAttribute("aria-busy");
    submitButton.disabled = submitted;
    submitButton.textContent = submitted ? "已提交" : "提交问卷";
  }
});

window.addEventListener("beforeunload", event => {
  if (!submitted && fields.some(field => field.value.trim())) {
    event.preventDefault();
    event.returnValue = "";
  }
});
