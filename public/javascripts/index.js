window.addEventListener("DOMContentLoaded", ()=>{

    let answers = document.querySelectorAll(".answerContainer")


    answers.forEach(answer =>{
        const upButton = answer.querySelector(".up")
        const voteCount = answer.querySelector(".count")
        const downButton = answer.querySelector(".down")
        window.addEventListener("load", async e =>{
            try{

                const response = await fetch(

                    `/vote/${answer.firstChild.firstChild.firstChild.id.split("-")[1]}/info`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                )
                const vote = await response.json()
                console.log(vote)

                voteCount.children[0].text = vote.answerScore

                if(vote.up === true){
                    upButton.classList.add("uptrue")
                    downButton.classList.remove("downtrue")
                } else if (vote.up === false){
                    // console.log('upvote')
                    upButton.classList.remove("uptrue")
                }

                if(vote.down === true){
                    downButton.classList.add("downtrue")
                    upButton.classList.remove("uptrue")
                } else if(vote.down === false){
                    downButton.classList.remove("downtrue")
                }
            } catch(err){
                // console.log(err)
            }
        })

        upButton.addEventListener("click", async e =>{
            const answerId = ( e.target.id ).split("-")[1]

            // if(!upped){
            //     upped = true
            //     let currCount = Number(count.innerHTML)
            //     currCount++
            //     voteCount.children[0].innerHTML = currCount
            // }else{
            //     upped = false
            //     let currCount = Number(count.innerHTML)
            //     currCount--
            //     voteCount.children[0].innerHTML = currCount
            // }

            try{
                const response = await fetch(
                    `/vote/${answerId}/up`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                )
                const vote = await response.json()

                voteCount.children[0].text = vote.answerScore

                if(vote.up === true){
                    console.log('upvote')
                    upButton.classList.add("uptrue")
                    downButton.classList.remove("downtrue")
                } else if (vote.up === false){
                    console.log('upvote')
                    upButton.classList.remove("uptrue")
                }
            } catch(err){
                console.log(err)
            }
        })
        downButton.addEventListener("click",async e=>{

            // if(!downed){
            //     downed = true
            //     let currCount = Number(count.innerHTML)
            //     currCount--
            //     voteCount.children[0].innerHTML = currCount
            // }else{
            //     downed = false
            //     let currCount = Number(count.innerHTML)
            //     currCount++
            //     voteCount.children[0].innerHTML = currCount
            // }

            const answerId = ( e.target.id ).split("-")[1]

            try{
                const response = await fetch(
                    `/vote/${answerId}/down`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }

                );

                const vote = await response.json();

                voteCount.children[0].text = vote.answerScore;

                if(vote.down === true){
                    downButton.classList.add("downtrue")
                    upButton.classList.remove("uptrue")
                } else if(vote.down === false){
                    downButton.classList.remove("downtrue")
                }

                console.log(vote)
            }catch(err){
                console.log(err);
            }
        });
    });
});
