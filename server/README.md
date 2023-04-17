# CDT-GDB-Adapter in a container

An example of running a remote CDT-GDB-Adapter and exposing a raw socket and WebSocket with the Debug Adapter Protocol.

## Setup

### Server

- Build the hello.c to obtain a binary to debug by running `build.sh` on linux. Possible by starting the service and running `/bin/bash`:

```bash
$ docker-compose up &
$ docker-compose run cdt /bin/bash
$ cd /home && ./build.sh
```

- Run the service if it's not already running:

```bash
$ docker-compose up
```

CDT-GDB-Adapter should be debugging `hello` and listening to a raw socket connection on `localhost:50000`

A WebSocket proxy (using `websockify`) should be listening on `localhost:50001`

### Client

Open this project in VS Code and set some breakpoints in `hello.c`.

Running one of the debug launch configurations should attach to the remote debuggger.
