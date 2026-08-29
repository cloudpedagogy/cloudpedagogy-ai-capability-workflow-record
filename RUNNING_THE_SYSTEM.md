# Running CloudPedagogy AI Capability Workflow Record Locally

## View Locally
To view CloudPedagogy AI Capability Workflow Record locally, run a static file server from the project root.

### Python 3
```bash
python3 -m http.server 8000
```
Then open: [http://localhost:8000](http://localhost:8000)

### Note on bundled exercises
If you open `index.html` directly via `file://`, bundled exercises may not load due to browser security restrictions. Using a local server is recommended. If you must use `file://`, use the **Import Exercise JSON** button to load exercise files manually.
