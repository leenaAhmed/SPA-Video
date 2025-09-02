import API from "./api.js"
export function changeUserLayout(state) {
  const supperUserId = "68b46395b7852d09e8b035a7";
  const videoRequestContentElm = document.querySelector(".app-content");
  const userFormLoginElm = document.querySelector(".form-login");
  const mainUserContentElm = document.querySelector(".normal-user-content");
  state.userId = localStorage.getItem("current-user");
    
  if (state.userId) {
    API.loadAllVidReqs(state);
    videoRequestContentElm.classList.remove("d-none");
    userFormLoginElm.classList.add("d-none");
    if (state.userId == supperUserId) {
      state.isSuperUser = true;
      mainUserContentElm.classList.add("d-none");
    }
  }
}