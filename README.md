# Snack Overflow #

Snack Overflow, a Stack Overflow clone, is an application that allows users to publicly ask questions and answers that can be viewed and liked by other users.

<h4> Link to Live Application: <a href="https://snack-over-flow.herokuapp.com/">Snack Overflow</a></h4>
<h4> Documentation: <a href="https://github.com/Rayn89/snack-overflow/wiki">Snack Overflow Wiki</a></h4>

Splash Page (while not signed in)
![image_2021-10-23_104417](https://cdn.discordapp.com/attachments/898413474080772116/901888096868634664/unknown.png)

Splash Page (while not signed in)
![image_2021-10-23_104417](https://cdn.discordapp.com/attachments/898413474080772116/901888185850806282/unknown.png)
### Features ###

* Sign-up and login with credentials
* Custom image on splash page
* Custom error handler images (401/404 erroes)
* Dynamic voting on answers on any given questions page
* Easy to use interface
* Logged in user can ask questions
* Logged in user can answer questions
* Logged in user can edit/delete their own questions
* Logged in user can edit/delete their own answers



### Technical Details ###
* One challenge we faced was handling how the logic for the "vote" feature works. The vote had to have the ability to be displayed dynamcially, meaning that casting a vote on an answer should not cause the page to reload. Not only did the vote count have to change, the color of one or both arrows had to change depending on the the previous vote state. The trickiest part has handling the logic of not being able to vote twice. We came up with 8 different scenarios (9, counting the load scenario where we just get the information without manipulating the data so we can show the users previous vote state) and made an "if/else tree" that handled all of them and gave the proper response to our fetch call on the front end.

```
router.post(
  "/vote/:answerId/:type",
  asyncHandler(async (req, res) => {
    const type = req.params.type;
    const answerId = req.params.answerId;
    let answer = await db.Answer.findByPk(answerId);
    let vote = await db.Vote.findOne({
      where: {
        answerId,
        userId: req.session.auth.userId,
      },
    });

    if (type === "up") {
      if (!vote) {
        vote = await db.Vote.create({
          userId: req.session.auth.userId,
          answerId,
          up: true,
          down: false,
        });
        await answer.update({
          answerScore: answer.answerScore + 1,
        });
      } else if (vote.down === true) {
        await answer.update({
          answerScore: answer.answerScore + 2,
        });
        await vote.update({
          up: true,
          down: false,
        });
      } else if (vote.up === true) {
        await answer.update({
          answerScore: answer.answerScore - 1,
        });
        await vote.update({
          up: false,
          down: false,
        });
      } else if (vote.up === false) {
        await answer.update({
          answerScore: answer.answerScore + 1,
        });
        await vote.update({
          up: true,
          down: false,
        });
      }

      return res.json({
        answerScore: answer.answerScore,
        down: vote.down,
        up: vote.up,
        ...vote.dataValues,
      });
    } else if (type === "down") {
      if (!vote) {
        vote = await db.Vote.create({
          userId: req.session.auth.userId,
          answerId,
          up: false,
          down: true,
        });
        await answer.update({
          answerScore: answer.answerScore - 1,
        });
      } else if (vote.up === true) {
        await answer.update({
          answerScore: answer.answerScore - 2,
        });
        await vote.update({
          up: false,
          down: true,
        });
      } else if (vote.down === true) {
        await answer.update({
          answerScore: answer.answerScore + 1,
        });
        await vote.update({
          down: false,
          up: false,
        });
      } else if (vote.down === false) {
        await answer.update({
          answerScore: answer.answerScore - 1,
        });
        await vote.update({
          down: true,
          up: false,
        });
      }
      return res.json({ answerScore: answer.answerScore, ...vote.dataValues });
    } else {
      return res.json({
        answerScore: answer.answerScore,
        down: vote.down,
        up: vote.up,
        ...vote.dataValues,
      });
    }
  })
);
```

<h3>Contributors</h3>
<ul>
  <li>
    <a href=https://github.com/a-sugawara>Alfredo Sugawara</a></li>
  <li>
    <a href=https://github.com/Rayn89>Ray Nehring</a></li>
  <li>
    <a href=https://github.com/greg-nice>Greg Gomes</a></li>
  <li>
    <a href=https://github.com/cloudiosx>John Kim</a></li>
</ul>

## Project-related Files ##

* Project flowchart (Draw.io)

```
https://drive.google.com/file/d/1U5m4CTeV3asIi3y7YaD-92OkJexfRoED/view?usp=sharing
```

* Role distribution (Excel Spreadsheet)

```
https://docs.google.com/spreadsheets/d/16HnED6Xv7UGZWam32bMn7SqEXFdmZD4lMn_ATgJTEuw/edit?usp=sharing
```

* Scorecard (Google Doc)

```
https://docs.google.com/spreadsheets/d/1vlDtzevdWGxY0yHjNtjp4eVsfbjljaRrmzVOAlCCBQM/edit#gid=1030287311
```

* Group project (Google Doc)

```
https://docs.google.com/document/d/1AU9rRCXMc0JjKG-qsBRiNcCIxzDXB_tcwyejTXlcPcU/edit?usp=sharing
```

* Route outline (Google Doc)

```
https://docs.google.com/document/d/1U7db1QrnCgsjv7PHnljCp4jkl2VHlaVaOiQd5BProhU/edit
```

* Tables Image (Google Doc)

```
https://drive.google.com/file/d/17bL1mM-1c2hvPHIGcicjBUzzMaEAHSz0/view?usp=sharing
```

## GitHub Files ##

* Wiki

```
https://github.com/Rayn89/snack-overflow/wiki
```

* Kanban board

```
https://github.com/Rayn89/snack-overflow/projects/1
```

* Source code

```
https://github.com/Rayn89/snack-overflow
```
