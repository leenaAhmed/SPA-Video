import { renderSingleVidReq } from "./renderSingleVid.js";
import { changeUserLayout } from "./changeUserLayout.js";
import { applyVoteStyle } from "./applyVoteStyle.js"
import API from "./api.js"

export default {
  updateVideoStatus: (id, status, resVideo) => {
    API.videoReq.update(id, status, resVideo).then(() => window.location.reload());
  },
  loadAllVidReqs: (state) => {
    const videoListElm = document.getElementById("listOfRequests");

    API.videoReq.get(state.sortBy, state.searchTerm, state.filterBy)
      .then((videoReq) => {
        videoListElm.innerHTML = "";
        videoReq.forEach((videoItem) => {
          renderSingleVidReq(videoItem, state);
        });
      });
  },
  login: (formData, state) => {
    API.users.login(formData)
      .then((data) => {
        state.userId = data._id;
        localStorage.setItem("current-user", data._id);
        changeUserLayout(state);
      });
  },
  addNewVideo: (formData , state) => {
    API.videoReq.post(formData)
      .then((data) => {
        renderSingleVidReq(data, state, true);
      });
  },
  deleteVideoReq: (VidId) => {
     API.videoReq.delete(VidId).then(() => window.location.reload() );
  },
  updateVotes: (vote_type, id, status, state) => {
    const voteScoreElm = document.getElementById(`score-${id}`);
     API.votes.update(id, vote_type, state.userId)
       .then((res) => {
         voteScoreElm.innerText = res.ups.length - res.downs.length;
         applyVoteStyle(id, res, status == "done", state ,vote_type);
       }).catch((error) => {
         console.error("Error updating votes:", error);
       });
  }
};
