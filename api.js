const baseURL = "http://localhost:7777/video-request";
import { renderSingleVidReq } from "./renderSingleVid.js";

export default {
  updateVideoStatus: (id, status, resVideo) => {
    fetch(baseURL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, resVideo })
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.reload();
      });
  },
  loadAllVidReqs: (state) => {
    const videoListElm = document.getElementById("listOfRequests");
    fetch(
      `${baseURL}?sortBy=${state.sortBy}&searchTerm=${state.searchTerm}&filterBy=${state.filterBy}`
    )
      .then((res) => res.json())
      .then((videoReq) => {
        videoListElm.innerHTML = "";
        videoReq.forEach((videoItem) => {
          renderSingleVidReq(videoItem, state);
        });
      });
  }
};
