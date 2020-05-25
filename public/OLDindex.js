var fetchedPapers;

fetch('./papers.json').then(result => result.json()).then((papers)=>{
    console.log(papers)
    fetchedPapers = papers;
})

var socket = io();


socket.on('connect', function(){
  console.log('connected to server');
});

socket.on('disconnect', function(){
  console.log('disconnected from server');
});

// add books
const addForm = document.forms['serial-Number'];
addForm.addEventListener('submit', function(e){
  e.preventDefault();
  
  const chosenTopic = addForm.querySelector('input[id="chosenTopic"]').value;
  var numberOfPapersStream = addForm.querySelector('input[id="numberOfPapersStream"]').value;
  console.log(numberOfPapersStream);

     const ol = document.createElement('ol');
     ol.setAttribute("start",(numberOfPapersStream*10)-9);
     const listDiv = document.querySelector('#list-div');
     listDiv.innerHTML = "";

     socket.emit('searchTopic', {
      chosenTopic: chosenTopic,
      numberOfPapersStream: numberOfPapersStream
    }, function(retrievePapers){

      console.log(retrievePapers);
      retrievePapers.forEach(function(element){
            // console.log("yes")
            var li = document.createElement('li')
            li.addEventListener('click', (e) => {
              // console.log(e.target)
              const pnls = document.querySelectorAll('.panel');
              const pnl = document.querySelector('#clickedPaper')

              Array.from(pnls).forEach((panel) => {
                // console.log(pnl)
                if(panel == pnl){
                  panel.classList.add('active');
                }else{
                  panel.classList.remove('active');
                }
              });

              const clickedPaperDetails = document.querySelector('#clickedPaperDetails');
              clickedPaperDetails.innerHTML = "";

              var title = document.createElement('li')
              title.textContent = e.target.textContent;
              clickedPaperDetails.appendChild(title);
              
            });
            li.textContent = element.title+element.publish_time;

            ol.appendChild(li);
            // console.log(ul)
        
        listDiv.appendChild(ol);
      });
    });
});

// tabbed content
const tabs = document.querySelector('.tabs');
const panels = document.querySelectorAll('.panel');
tabs.addEventListener('click', (e) => {
  if(e.target.tagName == 'LI'){
    const targetPanel = document.querySelector(e.target.dataset.target);
    Array.from(panels).forEach((panel) => {
      if(panel == targetPanel){
        panel.classList.add('active');
      }else{
        panel.classList.remove('active');
      }
    });
  }
});