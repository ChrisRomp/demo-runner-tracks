# Found means fixed - GitHub Copilot Autofix

## Scenario

Knowing there's a vulnerability is only a step in the process to improving your security posture. Developers need the ability to quickly (and confidently) resolve any issues raised. GitHub Copilot Autofix meets developers right where they are, and provides custom AI generated solutions.

## Existing infrastructure

- An vulnerability exists in [app.py](../python/app.py) setting `debug` to `True`
- A new vulnerability exists in a pull request for a JavaScript file.

## Narrative

Shift left is a challenge because it requires developers to be security experts. Developers are developers, not security experts. With the help of GitHub Copilot Autofix, Copilot can provide the fixes right where the developer is already working!

| Step                                                                                                            | Talk track                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Navigate to the **Pull Request** tab. Open the first pull request. Note the vulnerability and the existing fix. | The top vulnerabilities really haven't changed over the years. It's SQL injection, cross-site scripting (XSS), exposing stack traces... And here we have a perfect example of this, a newly introduced XSS vulnerability. In the past we'd see a generic message explaining the issue. With the help of GitHub Copilot Autofix, we see a fix has already been generated! |
| Commit the suggested fix. The security scan will re-run.                                                        | Let's commit the code right here. By doing so, the security scan will run again, so we can ensure the update does in fact resolve the issue.                                                                                                                                                                                                                             |
| Navigate to the **Security** tab, to **Code Scanning**, and open the vulnerability.                             | Catching new vulnerabilities introduced into our codebase is wonderful, but what about existing ones? Or what happens when a previously unknown vulnerability is discovered? Fortunately Copilot Autofix can support us there as well. We can see there's an issue with our app where someone left `debug` enabled. We can fix this right inline.                        |
| Select the **Generate Fix** button. Create a new pull request once the code is generated.                       | Just as before, we can generate a fix, and once that's done we can create a pull request. The code scan runs, so we know the code is secure!                                                                                                                                                                                                                             |

## Next steps

This demo is pretty atomic. You can sort of decide where you want to go next from here.
