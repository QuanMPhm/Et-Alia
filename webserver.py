from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import subprocess
import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow ALL origins

# Configuration
REPO_DIR = "./repos"
REPO_NAME = "markdown_repo"
FULL_REPO_PATH = os.path.join(REPO_DIR, REPO_NAME)
MARKDOWN_FILENAME = "file.md"

# Make sure base repos folder exists
os.makedirs(REPO_DIR, exist_ok=True)

@app.before_request
def log_request_info():
    print(f"📥 Received {request.method} request for {request.path}")

def run_git_command(args, cwd=FULL_REPO_PATH):
    """Run a git command and print the command and output"""
    print(f"⚡ Running git command: git {' '.join(args)}")
    result = subprocess.run(
        ["git"] + args,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode != 0:
        print(f"❌ Git command failed with error:\n{result.stderr}")
        raise Exception(f"Git command failed: {result.stderr}")
    print(f"✅ Git command output:\n{result.stdout.strip()}")
    return result.stdout.strip()

def initialize_repo():
    """Initialize git repo if not already done"""
    if not os.path.exists(FULL_REPO_PATH):
        print(f"📂 Creating repository folder at {FULL_REPO_PATH}")
        os.makedirs(FULL_REPO_PATH)
    else:
        print(f"📂 Repository folder already exists at {FULL_REPO_PATH}")

    if not os.path.exists(os.path.join(FULL_REPO_PATH, ".git")):
        print(f"🛠️  Initializing new Git repository...")
        run_git_command(["init"])
        run_git_command(["config", "user.email", "server@example.com"])
        run_git_command(["config", "user.name", "Server Bot"])
    else:
        print(f"✅ Git repository already initialized.")

@app.route('/')
def root():
    print("🏠 Serving frontend index.html")
    return send_from_directory('frontendkelvin', 'index.html')

@app.route('/<path:path>')
def serve_frontend(path):
    print(f"📄 Serving frontend file: {path}")
    return send_from_directory('frontendkelvin', path)

@app.route('/upload', methods=['POST'])
def upload_markdown():
    print("🚀 Upload endpoint called.")

    file = request.files.get('file')
    if file is None:
        print("❌ No file uploaded!")
        return jsonify({"error": "No file uploaded"}), 400

    initialize_repo()

    filepath = os.path.join(FULL_REPO_PATH, MARKDOWN_FILENAME)
    temp_path = os.path.join(FULL_REPO_PATH, "temp_upload.md")

    print(f"💾 Saving uploaded file temporarily to {temp_path}")
    file.save(temp_path)

    # Compare old file with new file
    is_different = True
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f1, open(temp_path, 'r', encoding='utf-8') as f2:
            old_content = f1.read()
            new_content = f2.read()
            if old_content == new_content:
                is_different = False
                print("⚡ Uploaded file is identical to existing file. No commit needed.")

    if is_different:
        print("✅ Uploaded file is different. Updating and committing...")
        os.replace(temp_path, filepath)  # Move temp file to real location

        try:
            print(f"➕ Adding file to Git...")
            run_git_command(["add", MARKDOWN_FILENAME])

            commit_message = request.form.get('message', f"Commit at {datetime.datetime.now().isoformat()}")
            print(f"📝 Committing file with message: {commit_message}")
            run_git_command(["commit", "-m", commit_message])

        except Exception as e:
            print(f"❗ Error during Git operations: {str(e)}")
            return jsonify({"error": str(e)}), 500

        print("✅ File uploaded and committed successfully!")
        return jsonify({"message": "File uploaded and committed successfully."}), 200

    else:
        # No difference → delete temp file
        os.remove(temp_path)
        print("✅ Upload ignored: no file changes.")
        return jsonify({"message": "No changes detected. No commit made."}), 200

@app.route('/diff', methods=['GET'])
def get_diff():
    print("🔍 Diff endpoint called.")

    initialize_repo()

    try:
        log_output = run_git_command(["log", "--pretty=format:%H", "-n", "2"])
        commits = log_output.splitlines()

        if len(commits) < 2:
            print("⚠️ Not enough commits to generate diff.")
            return jsonify({"error": "Not enough commits to generate diff."}), 400

        new_commit = commits[0]
        old_commit = commits[1]

        diff_stat = run_git_command(["diff", "--shortstat", f"{old_commit}", f"{new_commit}", MARKDOWN_FILENAME])
        diff_patch = run_git_command(["diff", f"{old_commit}", f"{new_commit}", MARKDOWN_FILENAME])

        commit_info = run_git_command([
            "show", "--quiet",
            "--pretty=format:%H%n%P%n%an%n%ae%n%ad%n%ai%n%s",
            new_commit
        ])
        (
            commit_hash,
            parent_commit,
            author_name,
            author_email,
            date_readable,
            date_iso,
            message
        ) = commit_info.split("\n", 6)

        branch = run_git_command(["rev-parse", "--abbrev-ref", "HEAD"])

    except Exception as e:
        print(f"❗ Error during generating diff: {str(e)}")
        return jsonify({"error": str(e)}), 500

    print("✅ Diff and commit information generated successfully!")
    return jsonify({
        "branch": branch,
        "commit_hash": commit_hash,
        "parent_commit": parent_commit,
        "author_name": author_name,
        "author_email": author_email,
        "date_readable": date_readable,
        "date_iso": date_iso,
        "commit_message": message,
        "diff_summary": diff_stat,
        "diff_patch": diff_patch
    }), 200

@app.route('/repos/markdown_repo/<path:filename>')
def serve_markdown_file(filename):
    print(f"📄 Serving markdown file: {filename}")
    return send_from_directory(FULL_REPO_PATH, filename)

if __name__ == '__main__':
    print("🚀 Starting Flask server on http://localhost:5000")
    app.run(debug=True)
