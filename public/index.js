var socket = io();

socket.on('connect', function(){
  console.log('connected to server');
});

socket.on('disconnect', function(){
  console.log('disconnected from server');
});

// dropdown value for topics
const myChosenTopic = document.querySelector('select[id="chosenTopic"]');
// console.log(myChosenTopic);

// when a value is chosen from this dropdown, tags will be given to the next dropdown to choose from
myChosenTopic.addEventListener('change',function(e){
  // console.log(e.target.value)

  const controlledTAG = document.querySelector('select[id="controlledTAG"]');
  controlledTAG.innerHTML = ""; // empty it first

  var tags = {
    "Hosts and Immune Responses": ["", "COVID-19","SARS-CoV-1", "SARS-CoV-2", "MERS-CoV"],
    "Vaccines":["", "COVID-19","SARS-CoV-1", "SARS-CoV-2", "MERS-CoV"],
    "Patient Safety": ["", "COVID-19","SARS-CoV-1", "SARS-CoV-2", "MERS-CoV"],
    "Viruses": ["", "COVID-19","SARS-CoV-1", "SARS-CoV-2", "MERS-CoV"],
    "Molecular Studies": ["", "COVID-19","SARS-CoV-1", "SARS-CoV-2", "MERS-CoV"],
    "Predictive Modelling": ["", "COVID-19","SARS-CoV-1", "SARS-CoV-2", "MERS-CoV"],
    "PCR in Virology": ["", "COVID-19","SARS-CoV-1", "SARS-CoV-2", "MERS-CoV"],
    "Public Health, Services, and Administration": ["", "COVID-19","SARS-CoV-1", "SARS-CoV-2", "MERS-CoV"],
    "Genome Studies": ["", "COVID-19","SARS-CoV-1", "SARS-CoV-2", "MERS-CoV"]
  };

  selectedClass=e.target.value;
  // console.log(tags[selectedClass],'tags[selectedClass]');

  tags[selectedClass].forEach(tag=>{  // go through the tags and push them to the dropdown
    // console.log(tag)
    const tagToAdd = document.createElement('option'); // push them as options inside the dropdown select
    tagToAdd.textContent = tag;
    controlledTAG.appendChild(tagToAdd)
  })
})

// the form that has the other filtering elements i.e. dropdown, main button, next/back button etc.
const addForm = document.forms['filter-form'];

// main button
const submitButton = document.querySelector('li[id="submitButtonClicked"]')

// if button clicked after submitting the filtering inputs
submitButton.addEventListener('click', function(e){
  onSubmitButton(e); // call this function with the button event as argument
});

// this function takes all filtering inputs and pushes them to the backend, when it receives back the response 
// it displays the data to the user, it also issues event listensers for further interactivities
var onSubmitButton = function(e){
  e.preventDefault();
  
  // grab the chosen topic and tag from the dropdowns
  var chosenTopic = addForm.querySelector('select[id="chosenTopic"]').value;
  var chasenTag = addForm.querySelector('select[id="controlledTAG"]').value;
  //  console.log(chasenTag,'chasenTag')

  // each time the submit button is clicked, we need to reset the number that shows which papers' stream we
  // are looking at. This is because when we filter again, we need to start looking at the recent papers first
  if(e.target.id == 'submitButtonClicked'){ 
    addForm.querySelector('output[id="stream"]').value = 1;
  }

  // grab the number indicating which paper steam we have now. i.e. 1 for 1-10, 2 for 10-20 etc.
  var streamLabel = addForm.querySelector('output[id="stream"]').value;

  // check if the 'next' button is clicked, then increment the papers' steam label 
  if(e.target.id == 'nextPage'){
    streamLabel = Number(streamLabel)+1;
    addForm.querySelector('output[id="stream"]').value = streamLabel;
  }

  // check if the 'back' button is clicked, then decrement the papers' steam label 
  if(e.target.id == 'previousPage' && streamLabel>1){
    streamLabel = Number(streamLabel)-1;
    addForm.querySelector('output[id="stream"]').value = streamLabel;
  }

  // grab the unordered list to store the retrieved papers, and empty it first
  const ul = document.querySelector('#paper_list');
   ul.innerHTML = "";

  // send request to backend asking for number of papers with these topic and tag
  socket.emit('numberOfPapersForTopic', {
      chosenTopic: chosenTopic,
      chasenTag: chasenTag
  }, function(numberOfPapers){   // the response is handled, and result is displayed in h3 tag
      const numberOfPapersFound = document.querySelector('#numberOfPapersFound');
      numberOfPapersFound.textContent = 'Number of Papers Found: '+numberOfPapers;
  })

  // send request to backend asking for papers matching the topic and tag, specifying the stream number which
  // is 1 for 1-10, 2 for 10-20 etc.
  socket.emit('searchTopic', {
   chosenTopic: chosenTopic,
   numberOfPapersStream: streamLabel,
   chasenTag: chasenTag
   }, function(retrievePapers){  // response is handled, and returned papers are displayed in a list

   retrievePapers.forEach(function(aRetrievedPaper){  // go through it, and append each paper to the list, and create click listener for it

         var p = document.createElement('p')  // create a p tag for each paper
         p.addEventListener('click', (e) => {  // add listener for each paper to trigger when it is clicked on

          const pnls = document.querySelectorAll('.panel');  // grab all the panels (Home, Search and clickedPaper)
          const pnl = document.querySelector('#clickedPaper') // grab the clickedPaper panel to display it and hide others 

           Array.from(pnls).forEach((panel) => { // loop through all panels after converting the html object to array
            
            if(panel == pnl){ // display the clickedPaper panel and hide others
               panel.classList.add('active');
             }else{
               panel.classList.remove('active');
             }
           });

           // grab the list for the paper details where we add title, authors. abstract etc.
           const clickedPaperDetails = document.querySelector('#clickedPaperDetails');
           clickedPaperDetails.innerHTML = "";

           // each aRetrievedPaper object is set to be the 'data' attribue value of every p created in the papers' list
           // this 'data' attribue is used here when the paper is clicked on from the list, and used in the paper's details panel
           // the data is a json string that needs parsing
           var title = document.createElement('p')
           title.classList.add('truncate-overflow')  // styling
           title.textContent = 'Title: ' + JSON.parse(e.target.getAttribute("data")).title; // grab title from the data atribute and get the title property

           var pubDate = document.createElement('p')
           pubDate.classList.add('truncate-overflow') // styling

           var dateToPrint = JSON.parse(e.target.getAttribute("data")).publish_time.split("T")[0]; // grab date from the data atribute and get the publish_time property
           // we use split at 'T' since the date is in MongoDB date object and we want only the format before the litter 'T' (XXXX-XX-XX)
           pubDate.textContent = 'Puclished Date: ' + dateToPrint;
           if(dateToPrint=="1111-11-11"){  // some with no dates were set to 1111-11-11
            pubDate.textContent = 'Puclished Date: No publish date found' 
           }

           var abstract = document.createElement('p')
           abstract.classList.add('truncate-overflow')
           abstract.textContent = 'Abstract: ' + JSON.parse(e.target.getAttribute("data")).abstract; // grab abstract from the data atribute and get the abstract property
           if(JSON.parse(e.target.getAttribute("data")).abstract==""){ // some don't have abstracts
            abstract.textContent = 'Abstract: No abstract found'
          }

          var author = document.createElement('p')
           author.classList.add('truncate-overflow')
           author.textContent = 'Authors: ' + JSON.parse(e.target.getAttribute("data")).authors; // grab authors from the data atribute and get the authors property
           if(JSON.parse(e.target.getAttribute("data")).authors==""){ // some don't have authors
            author.textContent = 'Authors: No authors found'
          }
           
          // append them to the list
           clickedPaperDetails.appendChild(title);
           clickedPaperDetails.appendChild(author);
           clickedPaperDetails.appendChild(pubDate);
           clickedPaperDetails.appendChild(abstract);
           

           // write heading for the related paper and append it to the paper's details list
           var relatedPapersHeading = document.createElement('h3')
           relatedPapersHeading.textContent = "Related Papers:"

           var related_papers_list = document.createElement('ol') // ordered list of five related papers' titles+autohrs

           // grab related_papers from the data atribute and get the related_papers property, go through everyone of the five
           JSON.parse(e.target.getAttribute("data")).related_papers.forEach(relatedPaper =>{

              var related_paper_N = document.createElement('li'); // create an li tag for each related paper
              // notice that this is relatedPaper title not the id, but it is called if in the related_papers property in the dataset
              related_paper_N.textContent = "Title: " + relatedPaper.id; 
              
              // create a p tag (inside li tag) for each related paper to display the author of that related paper
              var related_paper_N_author = document.createElement('p');
              related_paper_N_author.textContent = "Authors: " + relatedPaper.auth;
              related_paper_N_author.setAttribute("title",relatedPaper.id)  // set the title to its attribute it is used for next query if clicked on
              related_paper_N.appendChild(related_paper_N_author);  // push author p tag to related paper li tag
              related_paper_N.setAttribute("title",relatedPaper.id) // set title to li attribute so it is used for next query if clicked on

              if(relatedPaper.auth == ""){  // handle no authors problem
                related_paper_N_author.textContent = "Authors: Not Found"
              }

              related_paper_N.addEventListener('click', (e) => { // add a listener to each related paper for click event
                clickedRelatedPaper(e,relatedPaper)
              });
              related_papers_list.appendChild(related_paper_N);  // push the related paper to the related papers ol list
            })

            relatedPapersHeading.classList.add('truncate-overflow') // styling
            related_papers_list.classList.add('truncate-overflow') // styling 
            clickedPaperDetails.appendChild(relatedPapersHeading);  // push the related papers' heading to the paper's details ul list
            clickedPaperDetails.appendChild(related_papers_list);   // push the related papers' list to the paper's details ul list

         });
         p.classList.add('single_paper') // styling
         p.setAttribute("data",JSON.stringify(aRetrievedPaper)); // set the current paper object to the data attribute of the tag so it is used on click event
         
         p.textContent = aRetrievedPaper.title;  // display the title of the paper
         ul.appendChild(p);  // push a paper to the papers' list

     });
 });
}

var nextStream = document.querySelector('#nextPage'); // grab the 'next' button
nextStream.addEventListener('click',(e)=>{
  onSubmitButton(e);  // if clicked on, call run the same queries but consider this specific event e
});

var previousStream = document.querySelector('#previousPage'); // grab the 'back' button
previousStream.addEventListener('click',(e)=>{
  onSubmitButton(e);  // if clicked on, call run the same queries but consider this specific event e
});

// this function takes the related paper that was clicked on and re-laods the paper's detail list
var clickedRelatedPaper = function(e,relatedPaper){

  // it runs query to get the related paper from the database
  socket.emit('findPaperByTitle', {
    title: e.target.title,
  }, function(retrievePaper){
    const clickedPaperDetails = document.querySelector('#clickedPaperDetails'); // grab the paper details list again
    clickedPaperDetails.innerHTML = "";


    var title = document.createElement('p')
    title.classList.add('truncate-overflow') // styling
    title.textContent = 'Title: ' + retrievePaper[0].title;

    var pubDate = document.createElement('p')
    pubDate.classList.add('truncate-overflow') // styling

    var dateToPrint = retrievePaper[0].publish_time.split("T")[0];
    // we use split at 'T' since the date is in MongoDB date object and we want only the format before the litter 'T' (XXXX-XX-XX)
    pubDate.textContent = 'Puclished Date: ' + dateToPrint;

    if(dateToPrint=="1111-11-11"){ // some with no dates were set to 1111-11-11
      pubDate.textContent = 'Puclished Date: No publish date found' 
     }
    
    var abstract = document.createElement('p')
    abstract.classList.add('truncate-overflow') // styling
    abstract.textContent = 'Abstract: ' + retrievePaper[0].abstract;

  if(retrievePaper[0].abstract==""){ // some with no abstract
    abstract.textContent = 'Abstract: No abstract found'
  }

  var author = document.createElement('p')
  author.classList.add('truncate-overflow') // styling
  author.textContent = 'Authors: ' + retrievePaper[0].authors;

  if(retrievePaper[0].authors==""){  // some with no authors
    author.textContent = 'Authors: No authors found'
  }

    // append them to the list
    clickedPaperDetails.appendChild(title);
    clickedPaperDetails.appendChild(author);
    clickedPaperDetails.appendChild(pubDate);
    clickedPaperDetails.appendChild(abstract);
    
    // write heading for the related paper and append it to the paper's details list
    var relatedPapersHeading = document.createElement('h3')
    relatedPapersHeading.textContent = "Related Papers:"

    var related_papers_list = document.createElement('ol') // ordered list of five related papers' titles+autohrs

    // grab related_papers, and go through everyone of the five
    retrievePaper[0].related_papers.forEach(relatedPaper =>{

       var related_paper_N = document.createElement('li');  // create an li tag for each related paper
       // notice that this is relatedPaper title not the id, but it is called if in the related_papers property in the dataset
       related_paper_N.textContent = "Title: " + relatedPaper.id;
       
       // create a p tag (inside li tag) for each related paper to display the author of that related paper
       var related_paper_N_author = document.createElement('p');
       related_paper_N_author.textContent = "Authors: " + relatedPaper.auth;
       related_paper_N_author.setAttribute("title",relatedPaper.id) // set the title to its attribute it is used for next query if clicked on
       related_paper_N.appendChild(related_paper_N_author); // push author p tag to related paper li tag
       related_paper_N.setAttribute("title",relatedPaper.id) // set title to li attribute so it is used for next query if clicked on

       if(relatedPaper.auth == ""){ // handle no author problem
        related_paper_N_author.textContent = "Authors: Not Found"
      }

       related_paper_N.addEventListener('click', (e) => { // add a listener to each related paper for click event
         clickedRelatedPaper(e,relatedPaper)
       });
       related_papers_list.appendChild(related_paper_N); // push the related paper to the related papers ol list
     })
     
     relatedPapersHeading.classList.add('truncate-overflow') // styling
     related_papers_list.classList.add('truncate-overflow') // styling 
     clickedPaperDetails.appendChild(relatedPapersHeading); // push the related papers' heading to the paper's details ul list
     clickedPaperDetails.appendChild(related_papers_list); // push the related papers' list to the paper's details ul list

  });
}


// tabbed content
const tabs = document.querySelector('.tabs');  // grab the elements that have with class 'tabs'
// this is the main_button that is a ul tag containing li two tags with data-target (search and Home)
const panels = document.querySelectorAll('.panel'); //grab all the panels (Home, Search and clickedPaper)

tabs.addEventListener('click', (e) => { // if the ul is clicked on

  if(e.target.tagName == 'LI'){  // make sure the event is coming from one of the two li tags (search or Home)
    const targetPanel = document.querySelector(e.target.dataset.target); // grab the panel that has the same name is the clicked li tag
    
    Array.from(panels).forEach((panel) => { // loop through all the panels
      if(panel == targetPanel){  
        panel.classList.add('active'); // display the chosen one, the one that has the same name as the clicked li tag
      }else{
        panel.classList.remove('active'); // hide the rest
      }
    });
  }
});