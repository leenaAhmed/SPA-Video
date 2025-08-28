const baseURL = "http://localhost:7777/video-request";
const videListElm = document.getElementById("listOfRequests");

function renderSingleVidReq(videInfo, isPrepend = false) {
  const videoReqContainer = document.createElement("div");
  const { _id, votes } = videInfo;
  videoReqContainer.innerHTML = `
        <div class="card mb-3">
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3>${videInfo.topic_title}</h3>
              <p class="text-muted mb-2">${videInfo.topic_details}</p>
             
              ${
                videInfo.expected_result &&
                `<p class="mb-0 text-muted">
                <strong>Expected results:</strong> ${videInfo.expected_result}
                </p>`
              }
            
            </div>
            <div class="d-flex flex-column text-center">
              <a class="btn btn-link" id="vote-ups-${_id}">🔺</a>
              <h3  id="score-${_id}">${votes?.ups - votes?.downs}</h3>
              <a class="btn btn-link"  id="vote-downs-${_id}">🔻</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">${videInfo.status?.toUpperCase()}</span>
              &bullet; added by <strong>${videInfo.author_name}</strong> on
              <strong>${new Date(
                videInfo.submit_date
              ).toLocaleDateString()}</strong>
            </div>
            <div
              class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
              <div class="badge badge-success">
                ${videInfo.target_level}
              </div>
            </div>
          </div>
        </div>`;

  if (isPrepend) {
    videListElm.prepend(videoReqContainer);
  } else {
    videListElm.append(videoReqContainer);
  }

  const voteUpsElm = document.getElementById(`vote-ups-${videInfo._id}`);
  const voteScoreElm = document.getElementById(`score-${videInfo._id}`);
  const voteDownElm = document.getElementById(`vote-downs-${videInfo._id}`);

  voteUpsElm.addEventListener("click", (e) => {
    fetch(`${baseURL}/vote`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: videInfo._id,
        vote_type: "ups"
      })
    })
      .then((blob) => blob.json())
      .then((res) => {
        voteScoreElm.innerText = res.ups - res.downs;
      });
  });

  voteDownElm.addEventListener("click", (e) => {
    fetch(`${baseURL}/vote`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: videInfo._id,
        vote_type: "downs"
      })
    })
      .then((blob) => blob.json())
      .then((res) => {
        voteScoreElm.innerText = res.ups - res.downs;
      });
  });

  return videListElm;
}


function loadAllVidReqs(sortBy ="newFirst") {
     fetch(`${baseURL}?sortBy=${sortBy}`)
    .then((res) => res.json())
    .then((videoReq) => {
      videoReq.forEach((videoItem) => {
        renderSingleVidReq(videoItem);
      });
    });
}
// once dcumented loaded and before styleing load
document.addEventListener("DOMContentLoaded", () => {
  const videoRequestElm = document.getElementById("sendVideoRequested");
  const sortElms = document.querySelectorAll('[id*=sort_by_]')
  loadAllVidReqs()

  sortElms.forEach(items => {
    items.addEventListener('click', e => {
        loadAllVidReqs('topVotedFirst')
    })
  })
  videoRequestElm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(videoRequestElm);
    fetch(baseURL, {
      method: "POST",
      body: formData
    })
      .then((blob) => blob.json())
      .then((data) => {
        renderSingleVidReq(data , true);
      });
  });
});
