function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
export function validateForm(formData) {
  const topicTitle = formData.get("topic_title").trim();
  const topicDetails = formData.get("topic_details").trim();

  if (!topicTitle || topicTitle.length > 20) {
    document.querySelector("[name=topic_title]").classList.add("is-invalid");
  }
  if (!topicDetails) {
    document.querySelector("[name=topic_details]").classList.add("is-invalid");
  }

  const formValidity = document
    .getElementById("sendVideoRequested")
    .querySelectorAll(".is-invalid");
  if (formValidity.length) {
    formValidity.forEach((elm) => {
      elm.addEventListener("input", function () {
        this.classList.remove("is-invalid");
      });
    });
    return false;
  }
  return true;
}

export function loginFormVaildation(formData) {
  const authorName = formData.get("author_name").trim();
  const authorEmail = formData.get("author_email").trim();

  if (!authorName) {
    document.querySelector("[name=author_name]").classList.add("is-invalid");
  }
  if (!authorEmail || !validateEmail(authorEmail)) {
    document.querySelector("[name=author_email]").classList.add("is-invalid");
  }

  const loginFormValidity = document
    .getElementById("loginUser")
    .querySelectorAll(".is-invalid");
  if (loginFormValidity.length) {
    loginFormValidity.forEach((elm) => {
      elm.addEventListener("input", function () {
        this.classList.remove("is-invalid");
      });
    });
    return false;
  }
  return true;
}