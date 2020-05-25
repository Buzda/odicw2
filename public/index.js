var fetchedPapers;

fetch('./papers.json').then(result => result.json()).then((papers)=>{
    // console.log(papers)
    fetchedPapers = papers;
})

var socket = io();


socket.on('connect', function(){
  console.log('connected to server');
});

socket.on('disconnect', function(){
  console.log('disconnected from server');
});

const myChosenTopic = document.querySelector('select[id="chosenTopic"]');
// console.log(myChosenTopic);

myChosenTopic.addEventListener('change',function(e){
  // console.log(e.target.value)
  const controlledTAG = document.querySelector('select[id="controlledTAG"]');
  controlledTAG.innerHTML = "";
  var tags = {
    "Hosts and Immune Responses": ["virus","vaccine"],
    "Vaccines":["modelling"],
    "Patient Safety": ["prediction"],
    "Viruses": ["prediction"],
    "Molecular Studies": ["prediction"],
    "Predictive Modelling": ["prediction"],
    "PCR in Virology": ["prediction"],
    "Public Health, Services, and Administration": ["prediction"],
    "Genome Studies": ["prediction"]
  };
  selectedClass=e.target.value;
  // console.log(tags[selectedClass],'tags[selectedClass]');
  tags[selectedClass].forEach(tag=>{
    // console.log(tag)
    const tagToAdd = document.createElement('option');
    tagToAdd.textContent = tag;
    controlledTAG.appendChild(tagToAdd)
  })
})

// add books
const addForm = document.forms['serial-Number'];
const submitButton = document.querySelector('li[id="submitButtonClicked"]')
submitButton.addEventListener('click', function(e){
  onSubmitButton(e);
});

var onSubmitButton = function(e){
  e.preventDefault();
  // console.log('form clicked')
  
  var chosenTopic = addForm.querySelector('select[id="chosenTopic"]').value;
  var chasenTag = addForm.querySelector('select[id="controlledTAG"]').value;
  // console.log(chasenTag,'chasenTag')

  // console.log(e.target.id,'which event')
  if(e.target.id == 'submitButtonClicked'){
    // addForm.querySelector('input[id="numberOfPapersStream"]').value = 1;
    addForm.querySelector('output[id="stream"]').value = 1;
  }

  // var numberOfPapersStream = addForm.querySelector('input[id="numberOfPapersStream"]').value;
  var streamLabel = addForm.querySelector('output[id="stream"]').value;

  if(e.target.id == 'nextPage'){
    console.log(streamLabel,'streamLabel')
    streamLabel = Number(streamLabel)+1;
    addForm.querySelector('output[id="stream"]').value = streamLabel;
    console.log(streamLabel,'streaLabel')
  }

  if(e.target.id == 'previousPage' && streamLabel>1){
    console.log(streamLabel,'streamLabel')
    streamLabel = Number(streamLabel)-1;
    addForm.querySelector('output[id="stream"]').value = streamLabel;
    console.log(streamLabel,'streaLabel')
  }
 

  // if(chosenTopic=='topic 1'){
  //   chosenTopic=1;
  // }
  // if(chosenTopic=='topic 2'){
  //   chosenTopic=2;
  // }
  // if(chosenTopic=='topic 3'){
  //   chosenTopic=3;
  // }
  // console.log('chosenTopic',chosenTopic);
  // console.log('numberOfPapersStream',numberOfPapersStream);


  const ul = document.querySelector('#paper_list');
  ul.setAttribute("start",(streamLabel*10)-9);
   ul.innerHTML = "";

   
        //  numberOfPapersFound.classList.add('single_paper')

         socket.emit('numberOfPapersForTopic', {
          chosenTopic: chosenTopic,
        }, function(numberOfPapers){
          const numberOfPapersFound = document.querySelector('#numberOfPapersFound');
          // var numberOfPapersFound = document.createElement('p')
          numberOfPapersFound.textContent = 'Number of Papers Found: '+numberOfPapers;
          // console.log(numberOfPapersFound)
          // div.appendChild(numberOfPapersFound);
        })

  socket.emit('searchTopic', {
   chosenTopic: chosenTopic,
   numberOfPapersStream: streamLabel
 }, function(retrievePapers){

  //  console.log(retrievePapers);
   retrievePapers.forEach(function(element){
         // console.log("yes")

         var p = document.createElement('p')
         p.addEventListener('click', (e) => {
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

           
           var title = document.createElement('p')
           title.classList.add('truncate-overflow')
           title.textContent = 'Title: ' + JSON.parse(e.target.getAttribute("data")).title;
          //  console.log(title.textContent)

           var pubDate = document.createElement('p')
           pubDate.classList.add('truncate-overflow')
           var dateToPrint = JSON.parse(e.target.getAttribute("data")).publish_time.split("T")[0];
           pubDate.textContent = 'Puclished Date: ' + JSON.parse(e.target.getAttribute("data")).publish_time.split("T")[0];
           if(dateToPrint=="1111-11-11"){
            pubDate.textContent = 'Puclished Date: No publish date found' 
           }

           var abstract = document.createElement('p')
           abstract.classList.add('truncate-overflow')
           abstract.textContent = 'Abstract: ' + JSON.parse(e.target.getAttribute("data")).abstract;
           if(JSON.parse(e.target.getAttribute("data")).abstract==""){
            abstract.textContent = 'Abstract: No abstract found'
          }

          var author = document.createElement('p')
           author.classList.add('truncate-overflow')
           author.textContent = 'Authors: ' + JSON.parse(e.target.getAttribute("data")).authors;
           if(JSON.parse(e.target.getAttribute("data")).authors==""){
            author.textContent = 'Authors: No authors found'
          }

           clickedPaperDetails.appendChild(title);
           clickedPaperDetails.appendChild(author);
           clickedPaperDetails.appendChild(pubDate);
           clickedPaperDetails.appendChild(abstract);
           

          //  console.log(JSON.parse(e.target.getAttribute("data")).related_papers)
           var relatedPapersHeading = document.createElement('h3')
           relatedPapersHeading.textContent = "Related Papers:"
           var relatedPapers;
           var related_papers_list = document.createElement('ol')
            JSON.parse(e.target.getAttribute("data")).related_papers.forEach(relatedPaper =>{
              console.log(e.target.getAttribute("data"))
              // console.log(relatedPaper)
              var related_paper_N = document.createElement('li');
              related_paper_N.textContent = relatedPaper.id;
              console.log(relatedPaper)

              related_paper_N.addEventListener('click', (e) => {

                clickedRelatedPaper(e,relatedPaper)
              });
              related_papers_list.appendChild(related_paper_N);
            })

            relatedPapersHeading.classList.add('truncate-overflow')
            related_papers_list.classList.add('truncate-overflow')
            clickedPaperDetails.appendChild(relatedPapersHeading);
            clickedPaperDetails.appendChild(related_papers_list);

         });
         p.classList.add('single_paper')
         p.setAttribute("data",JSON.stringify(element));
         
        //  p.textContent = JSON.stringify(element);
         p.textContent = element.title;
         ul.appendChild(p);

         // console.log(ul)
     });
 });
}

// var paperStream = document.querySelector('#numberOfPapersStream');
// paperStream.addEventListener('change',(e)=>{
//   console.log(e.target,'print the change')
//   onSubmitButton(e);
// });

var nextStream = document.querySelector('#nextPage');
nextStream.addEventListener('click',(e)=>{
  console.log(e.target,'print the change')
  onSubmitButton(e);
});

var previousStream = document.querySelector('#previousPage');
previousStream.addEventListener('click',(e)=>{
  console.log(e.target,'print the change')
  onSubmitButton(e);
});

var clickedRelatedPaper = function(e,relatedPaper){
  // console.log(e.target.textContent)
  socket.emit('findPaperById', {
    title: e.target.textContent,
  }, function(retrievePaper){
    // console.log(retrievePaper[0]);
    const clickedPaperDetails = document.querySelector('#clickedPaperDetails');
    clickedPaperDetails.innerHTML = "";


    var title = document.createElement('p')
    title.classList.add('truncate-overflow')
    title.textContent = 'Title: ' + retrievePaper[0].title;

    var pubDate = document.createElement('p')
    pubDate.classList.add('truncate-overflow')
    var dateToPrint = retrievePaper[0].publish_time.split("T")[0];
    pubDate.textContent = 'Puclished Date: ' + retrievePaper[0].publish_time.split("T")[0];
    if(dateToPrint=="1111-11-11"){
      pubDate.textContent = 'Puclished Date: No publish date found' 
     }
    

    var abstract = document.createElement('p')
    abstract.classList.add('truncate-overflow')
    abstract.textContent = 'Abstract: ' + retrievePaper[0].abstract;
  if(retrievePaper[0].abstract==""){
    abstract.textContent = 'Abstract: No abstract found'
  }

  var author = document.createElement('p')
  author.classList.add('truncate-overflow')
  author.textContent = 'Authors: ' + retrievePaper[0].authors;
  if(retrievePaper[0].authors==""){
    author.textContent = 'Authors: No authors found'
  }

    clickedPaperDetails.appendChild(title);
    clickedPaperDetails.appendChild(author);
    clickedPaperDetails.appendChild(pubDate);
    clickedPaperDetails.appendChild(abstract);
    
    var relatedPapersHeading = document.createElement('h3')
    relatedPapersHeading.textContent = "Related Papers:"
    var relatedPapers;
    var related_papers_list = document.createElement('ol')
    retrievePaper[0].related_papers.forEach(relatedPaper =>{
      //  console.log(relatedPaper)
       var related_paper_N = document.createElement('li');
       related_paper_N.textContent = relatedPaper.id;

      //  var related_paper_N_author = document.createElement('span');
      //  related_paper_N_author.textContent = relatedPaper.auth;
      //  related_paper_N.appendChild(related_paper_N_author);

       related_paper_N.addEventListener('click', (e) => {

         clickedRelatedPaper(e,relatedPaper)
       });
       related_papers_list.appendChild(related_paper_N);
     })
     
     relatedPapersHeading.classList.add('truncate-overflow')
     related_papers_list.classList.add('truncate-overflow')
     clickedPaperDetails.appendChild(relatedPapersHeading);
     clickedPaperDetails.appendChild(related_papers_list);

  });


}


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