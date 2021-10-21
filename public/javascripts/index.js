window.addEventListener("DOMContentLoaded", ()=>{
    // console.log("hello from javascript!")
    function myAlert(){
        alert("I am an alert box!")
    }

    let answers = document.querySelectorAll(".answerContainer")
    // console.log(answers)

    answers.forEach(answer =>{
        const upButton = answer.querySelector(".up")
        const voteCount = answer.querySelector(".count")
        const downButton = answer.querySelector(".down")
        console.log(answer)
        console.log(upButton)
        let count = voteCount.children[0]
        let upped = false
        let downed = false
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

            const response = await fetch(`/vote/${answerId}/up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const vote = await response.json()
            console.log(vote)
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


            try{const response = await fetch(`/vote/${answerId}/down`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })}catch(err){console.log(err)}
            // const vote = await response.json()
            // console.log(vote)
        })


    })
})
