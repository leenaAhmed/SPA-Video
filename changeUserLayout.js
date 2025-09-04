import dataService from "./dataService.js"
export function changeUserLayout(state) {
  const supperUserId = "68b73ca6a556fe24a4a1dfa3"; // admin
  
  const videoRequestContentElm = document.querySelector(".app-content");
  const userFormLoginElm = document.querySelector(".form-login");
  const mainUserContentElm = document.querySelector(".normal-user-content");
  state.userId = localStorage.getItem("current-user");
    
  if (state.userId) {
    dataService.loadAllVidReqs(state);
    videoRequestContentElm.classList.remove("d-none");
    userFormLoginElm.classList.add("d-none");
    if (state.userId == supperUserId) {
      state.isSuperUser = true;
      mainUserContentElm.classList.add("d-none");
    }
  }
}