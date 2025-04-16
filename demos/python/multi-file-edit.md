# Use Copilot Chat to apply best practices across multiple files

## Scenario

You've been tasked with creating a new page to the race organizer website to allow for searching for when a runner crossed checkpoints. Performing this task requires using an external API, for which you have a markdown file containing the URL and an example of the JSON to be returned.

> [!NOTE]
> Because of the number of files generated status as a beta product, this demo doesn't include examples of what Copilot may generate. It's highly recommended that you walk through this demo to ensure you understand the current status of the product.

## Existing infrastructure

This demo is focused on the [race organizer](../../python/) site. The files you'll start with are:

- [app.py](../../python/app.py), which is the core of the Flask app
- [site.css](../../python/static/site.css), which is the main CSS file
- [endpoint-info.md](../../python/endpoint-info.md), which contains the information about the endpoint, including the URL to be called and an example of the JSON.

## Narrative

Adding features typically involves updating (or creating) multiple files and accessing external resources. As a developer, I'm inherently limited to updating one file at a time (or maybe a little on this one, a little on this one...). With Copilot Edit, you can provide the necessary context to Copilot - the background of what you need to accomplish and the files which need to be updated - and allow Copilot Edit to perform the operation.

In our case, we want to create a new page which will allow us to see all checkpoint events for a particular runner. There's an endpoint where we can send the race ID and the bib number; we just need to create the code to make it work!

## Demo steps

| Step                                                                                                                                                                                                                                  | Talk Track                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Open a terminal window in VS Code or your codespace. Start the servers by running `./scripts/start-server.sh`. Open the website listed as `Race organizer (Python)` by using <kbd>Cmd</kbd>-**Click**.                                       | Let's start the servers and open the website.                                                                                                                                                                                                                          |
| Open [endpoint-info.md](../../python/endpoint-info.md) in Visual Studio Code or your codespace. Highlight the URL and the JSON data.                                                                                                  | We've got a documentation file with the information about the endpoint. We're off to a good start.                                                                                                                                                                     |
| Open [app.py](../../python/app.py) and show the existing routes                                                                                                                                                                       | We've got a site already created. We need a new route and template for the page. Let's get Copilot to help us out.                                                                                                                                                     |
| Open Copilot Edit. Add `app.py`, `site.css`, and `endpoint-info.md` to the Working Set. Prompt Copilot with "Create a new page to allow someone to enter a bib number and see the checkpoint events"                                  | We add in the files we want Copilot to focus on, then give it the instructions.                                                                                                                                                                                        |
| Review all of the files. You can do this by clicking on them individually or using the diffs display.                                                                                                                                 | We never want to trust code generated by AI without first reviewing it. Let's see what Copilot created! Notice how it's using the diff view to show us the changes, so we can quickly accept or reject the changes as needed.                                          |
| Accept the changes and open the website (assuming the code looks good, which it should), then refresh the page. There should be a link to the new page. Click on it, and search for bib **101**, which should return a set of events. | It looks good, so let's accept and view the updated page. We can see we've got the new link, and if we follow that the new page.                                                                                                                                       |
| Ask for style changes to the page - maybe to the CSS or to the formatting of the timestamps. Highlight how you can use the back and forward buttons on the top to work interactively.                                                 | Copilot is built to be your AI pair programmer. Just like a human pair programmer, you'll typically need to provide additional context to ensure you're getting the results you need. Let's give Copilot a bit more direction on exactly how we want our page created. |
| Once you're satisfied with the changes, press **Done** in Copilot Edit.                                                                                                                                                               | Everything looks good! Let's close it off by pressing done. Now we can check in all of our code and create the PR! |

## Next steps

From here, you can go a lot of directions. You could ask Copilot Edit to create unit tests for the new route. You could create the PR and kickoff the review process. Or, you can close the demo here as it is a complete walkthrough of Copilot edit.
