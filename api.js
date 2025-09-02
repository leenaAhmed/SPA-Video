const baseURL = "http://localhost:7777/video-request";
import { renderSingleVidReq } from "./renderSingleVid.js";
import { changeUserLayout } from "./changeUserLayout.js";
import { applyVoteStyle } from "./applyVoteStyle.js"


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
  },
  login: (formData , state) => {
      fetch("http://localhost:7777/users/login", {
      method: "POST",
      body: formData
    })
      .then((blob) => blob.json())
      .then((data) => {
        state.userId = data._id;
        localStorage.setItem("current-user", data._id);
        changeUserLayout(state);
    });
  },
  addNewVideo: (formData) => {
     fetch(baseURL, {
      method: "POST",
      body: formData
    })
      .then((blob) => blob.json())
      .then((data) => {
        renderSingleVidReq(data, state,true);
      });
  },
  deleteVideoReq: (VidId) => {
     fetch(baseURL, {
      method: "DELETE",
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({ id: VidId }),
    }).then(()=> window.location.reload())
  },
  updateVideoVotes: (vote_type, id, status, state) => {
    const voteScoreElm = document.getElementById(`score-${id}`);
     fetch(`${baseURL}/vote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          vote_type: vote_type,
          user_id: state.userId
        })
      })
        .then((blob) => blob.json())
        .then((res) => {
            voteScoreElm.innerText = res.ups.length - res.downs.length;
            applyVoteStyle(id, res, status == "done", state ,vote_type);
      });
  }
};
