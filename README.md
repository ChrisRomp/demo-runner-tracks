# Runner tracks

Runner Tracks is a web application for tracking participants in marathon races. It allows users to view race details, monitor runner progress, and track completion times across various marathon events.

- The [frontend for runners](./ts-web/) uses SvelteKit, Tailwind CSS for styling, and stores race data in a SQLite database managed through Prisma.
- There is a [backend tool for event admins](./python) written in Python to simulate sending data to an API.

> [!NOTE]
> The creation of the codespace will also setup Playwright and install dependencies for it; it will take a minute or so after the Codespace is responsive.

## Setting up the project

Perform the following steps to setup and run the project:

```bash
# Set the script to executable
chmod +x ./scripts/start-server.sh

# Run the project, installing all libraries
./scripts/start-server.sh
```

## Explore the demos

> [!IMPORTANT]
> [Demo notes](./demos/README.md)