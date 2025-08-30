const baseURL = "http://localhost:7777/video-request";
const videoListElm = document.getElementById("listOfRequests");
let sortBy = "newFirst";
let searchTerm = "";

function renderSingleVidReq(videoInfo, isPrepend = false) {
  const videoReqContainer = document.createElement("div");
  const { _id, votes } = videoInfo;
  videoReqContainer.innerHTML = `
        <div class="card mb-3">
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3>${videoInfo.topic_title}</h3>
              <p class="text-muted mb-2">${videoInfo.topic_details}</p>

              ${
                videoInfo.expected_result &&
                `<p class="mb-0 text-muted">
                <strong>Expected results:</strong> ${videoInfo.expected_result}
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
              <span class="text-info">${videoInfo.status?.toUpperCase()}</span>
              &bullet; added by <strong>${videoInfo.author_name}</strong> on
              <strong>${new Date(
                videoInfo.submit_date
              ).toLocaleDateString()}</strong>
            </div>
            <div
              class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
              <div class="badge badge-success">
                ${videoInfo.target_level}
              </div>
            </div>
          </div>
        </div>`;

  if (isPrepend) {
    videoListElm.prepend(videoReqContainer);
  } else {
    videoListElm.append(videoReqContainer);
  }

  const voteUpsElm = document.getElementById(`vote-ups-${videoInfo._id}`);
  const voteScoreElm = document.getElementById(`score-${videoInfo._id}`);
  const voteDownElm = document.getElementById(`vote-downs-${videoInfo._id}`);

  voteUpsElm.addEventListener("click", (e) => {
    fetch(`${baseURL}/vote`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: videoInfo._id,
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
        id: videoInfo._id,
        vote_type: "downs"
      })
    })
      .then((blob) => blob.json())
      .then((res) => {
        voteScoreElm.innerText = res.ups - res.downs;
      });
  });

  return videoListElm;
}


function loadAllVidReqs(sortBy ="newFirst" , searchTerm = "") {
  fetch(`${baseURL}?sortBy=${sortBy}&searchTerm=${searchTerm}`)
    .then((res) => res.json())
    .then((videoReq) => {
      videoListElm.innerHTML = "";
      videoReq.forEach((videoItem) => {
        renderSingleVidReq(videoItem);
      });
    });
}


function debounce(func , time){
  let timer;

  return function(...args){
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=> func.apply(this, args), time)
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateForm(formData){
   const authorName = formData.get("author_name").trim();
   const authorEmail = formData.get("author_email").trim();
   const topicTitle = formData.get("topic_title").trim();
   const topicDetails = formData.get("topic_details").trim();

   if (!authorName) {
     document.querySelector('[name=author_name]').classList.add('is-invalid')
   }
   if (!authorEmail || !validateEmail(authorEmail)) {
     document.querySelector('[name=author_email]').classList.add('is-invalid')
   }
   if (!topicTitle || topicTitle.length < 20) {
     document.querySelector('[name=topic_title]').classList.add('is-invalid')
   }
   if (!topicDetails) {
     document.querySelector('[name=topic_details]').classList.add('is-invalid')
   }

   const formValidity = document.getElementById("sendVideoRequested").querySelectorAll('.is-invalid')
   console.log(formValidity);
   if (formValidity.length) {
     formValidity.forEach(elm => {
      console.log(elm);
       elm.addEventListener('input', function() {
         this.classList.remove('is-invalid');
       });
     });
     return false;
   }
   return true;
}

// once document loaded and before styling load
document.addEventListener("DOMContentLoaded", () => {
  const videoRequestElm = document.getElementById("sendVideoRequested");
  const sortElms = document.querySelectorAll('[id*=sort_by_]')
  const searchBy = document.getElementById("video_search");
  loadAllVidReqs()

  sortElms.forEach(items => {
    items.addEventListener('click', function (e) {
      e.preventDefault();
        sortBy = this.querySelector('input').value
        loadAllVidReqs(sortBy, searchTerm)
        this.classList.add('active')
        if (sortBy == "topVotedFirst") {
          document.getElementById('sort_by_new').classList.remove('active')
        }else {
          document.getElementById('sort_by_top').classList.remove('active')
        }
    })
  })

 
  searchBy.addEventListener("input", debounce((e) =>{
    searchTerm = e.target.value;
    loadAllVidReqs(sortBy, searchTerm);
  }, 1500) );


  videoRequestElm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(videoRequestElm);


    // check validation
    const isValid = validateForm(formData);
    if (!isValid) return;

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
