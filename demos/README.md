# Demo info

This repository is created to serve as a base, to give you some quick "in your back pocket" demos you can quickly walk a customer through to help them understand the core concepts of GitHub Copilot. The demos provided assume you're familiar with GitHub Copilot and have some experience writing code. You should always consider using the demos as a launch part and conversation spark, to continue the narrative to other topics as they arise.

## App overview

The applications and scenario are based around tracking runners in races. When runners participate in a race there are checkpoints they cross which read RFID tags in the bibs they wear. This information is sent to a database and used during the event by friends track their progress, and after the event is often utilized by the runner to see how they did. Race organizers also have tools to help them interact with the data.

There are two applications, one primarily written in TypeScript and the other in Python, to both simulate the scenario but also to provide options to you as you perform the demos. You can choose the language you feel most confident with.

### Application structure

- [Runner Tracks website](../ts-web/)
  - Written using [SvelteKit](https://svelte.dev/docs/kit/introduction) and [Prisma](https://www.prisma.io/docs) in TypeScript, and [Tailwind CSS](https://tailwindcss.com/) for the UX.
  - Hosts a website for runners to find races, and APIs for managing checkpoint events.
- [Race organizer website](../python/)
  - Written using Python [Flask](https://flask.palletsprojects.com/en/stable/) and vanilla JavaScript and CSS.
  - Used by race organizers to manually send information about a runner or see the current status of a runner.
  - Calls APIs exposed by the runner tracks website.

## Setup the demo environment

> [!IMPORTANT]
> This is designed to be a template, so the first step to setup is to create a new repository from the template.

This template automates as much as possible, but there's a couple of steps which need to be completed manually.

1. [Create a new repository from the template](https://github.com/new?owner=octodemo&template_name=template-demo-runner-tracks&template_owner=octodemo). There is an action which will automatically run and create a new branch with a security flaw you can use for a demo.
2. Create a new codespace. This project is configured with a custom dev container which contains the extensions necessary to perform the demos. This will take a few minutes for it to launch and complete the installation process. Create the codespace a minute or so after step one.
3. Add the **demos** folder to the list of excluded files by navigating to **Settings** > **Copilot** in the repository, and adding `- demos/**` to the list of paths to exclude. (You can do this while the codespace is launching if you wish to multitask.)
4. Run the following command in the terminal window of your codespace to create the PR of the branch mentioned above:

  ```sh
  gh pr create \
    --title "Update bib number message display" \
    --body "Displays how bib number got populated" \
    --head update-bib-message \
    --base main
  ```

5. Start the server and install the libraries by running the following commands:

  ```sh
  # Set to executable
  chmod ./scripts/start-server.sh +x
  # Run the script to start the server
  ./scripts/start-server.sh
  ```

## Best practices when demoing AI tools

Running demos which rely on GitHub Copilot (and AI in general) requires flexibility as the responses can vary, even when asking the same question with the same code. As a result, it's highly recommended you practice the demos a couple of times to ensure you have a good sense for what Copilot may suggest. You'll also need to be flexible in your talk tracks. Practice will certainly help here, but again keep in mind that there's always a range of responses Copilot can provide. These demos have been built such that Copilot stays within an expected range of responses.

> [!IMPORTANT]
> The importance of practicing the demo at least twice before performing it in front of an audience cannot be overstated.

## Available demos

### Core Copilot Chat

Walk someone through the core GitHub Copilot Chat experience, including searching a repository, generating code and unit tests, and utilizing the various commands and chat participants.

- [TypeScript](./typescript/chat-core.md)

### Edit multiple files with Copilot Chat

Walkthrough of the multi-file edit capabilities of Copilot Chat in VS Code, including adding different files, using the various undo/redo buttons, and how the diff experience works.

- [Python](./python/multi-file-edit.md)

### Autofix

"Found means fixed!"

- [Found means fixed](./found-means-fixed.md)
