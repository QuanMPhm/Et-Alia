import os
import subprocess
import time
import signal
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from web3 import Web3

# Flask setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'frontendkelvin'))
REPO_DIR = os.path.join(BASE_DIR, "repos")
REPO_NAME = "markdown_repo"
FULL_REPO_PATH = os.path.join(REPO_DIR, REPO_NAME)
MARKDOWN_FILENAME = "file.md"

# Globals
hh_node = None
w3 = None
commit_storage = None

# --- Hardhat functions ---

def start_hardhat_node():
    print("🚀 Starting Hardhat node...")
    global hh_node
    hh_node = subprocess.Popen(
    ["npx", "hardhat", "node"],
    cwd="../hardhat-blockchain",
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)

    time.sleep(5)  # Give Hardhat time to fully start

def deploy_contract():
    print("🚀 Deploying smart contract...")
    result = subprocess.run(
        ["npx", "hardhat", "run", "scripts/deploy.js", "--network", "localhost"],
        cwd="../hardhat-blockchain",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    if result.returncode != 0:
        print("❌ Deployment error:\n", result.stderr)
        raise Exception("Contract deployment failed.")

    output = result.stdout
    print(output)

    for line in output.splitlines():
        if "CommitStorage deployed to:" in line:
            return line.split(":")[1].strip()

    raise Exception("Contract address not found.")

def connect_web3(contract_address):
    global w3, commit_storage
    w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
    assert w3.is_connected(), "Web3 not connected!"

    abi_path = os.path.join(BASE_DIR, "blockchain", "contract_abi.json")
    with open(abi_path) as f:
        abi = json.load(f)

    commit_storage = w3.eth.contract(address=contract_address, abi=abi)
    w3.eth.default_account = w3.eth.accounts[0]

def kill_node():
    if hh_node:
        print("🛑 Stopping Hardhat node...")
        hh_node.terminate()
        try:
            hh_node.wait(timeout=5)
            print("✅ Hardhat node stopped.")
        except subprocess.TimeoutExpired:
            hh_node.kill()
            print("⚠️ Hardhat node force killed.")

# --- Git and Blockchain functions ---

def run_git_command(args, cwd=FULL_REPO_PATH):
    print(f"⚡ Running git command: git {' '.join(args)}")
    result = subprocess.run(
        ["git"] + args,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode != 0:
        print(f"❌ Git error:\n{result.stderr}")
        raise Exception(f"Git failed: {result.stderr}")
    return result.stdout.strip()

def initialize_repo():
    if not os.path.exists(FULL_REPO_PATH):
        print(f"📂 Creating repository at {FULL_REPO_PATH}")
        os.makedirs(FULL_REPO_PATH)
    if not os.path.exists(os.path.join(FULL_REPO_PATH, ".git")):
        print(f"🛠️ Initializing Git repo...")
        run_git_command(["init"])
        run_git_command(["config", "user.email", "server@example.com"])
        run_git_command(["config", "user.name", "Server Bot"])

# --- Flask Endpoints ---

@app.route('/')
def root():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(FRONTEND_DIR, path)

@app.route('/upload', methods=['POST'])
def upload_markdown():
    print("🚀 Upload called.")

    file = request.files.get('file')
    if file is None:
        return jsonify({"error": "No file uploaded"}), 400

    initialize_repo()

    filepath = os.path.join(FULL_REPO_PATH, MARKDOWN_FILENAME)
    temp_path = os.path.join(FULL_REPO_PATH, "temp_upload.md")
    file.save(temp_path)

    is_different = True
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f1, open(temp_path, 'r', encoding='utf-8') as f2:
            if f1.read() == f2.read():
                is_different = False

    if is_different:
        os.replace(temp_path, filepath)

        try:
            run_git_command(["add", MARKDOWN_FILENAME])
            commit_message = request.form.get('message', f"Commit at {time.time()}")
            run_git_command(["commit", "-m", commit_message])

            # Fetch latest commit
            log_output = run_git_command(["log", "--pretty=format:%H%n%an%n%ad%n%s", "-n", "1"])
            commit_hash, author_name, date_readable, commit_message_saved = log_output.split("\n", 3)

            # Save commit to blockchain
            tx_hash = commit_storage.functions.saveCommit(
                commit_hash,
                author_name,
                commit_message_saved,
                date_readable
            ).transact()

            w3.eth.wait_for_transaction_receipt(tx_hash)
            print("✅ Commit saved to blockchain.")

        except Exception as e:
            return jsonify({"error": str(e)}), 500

        return jsonify({"message": "File committed and saved to blockchain."}), 200

    else:
        os.remove(temp_path)
        return jsonify({"message": "No changes detected. No commit made."}), 200

@app.route('/current_markdown', methods=['GET'])
def get_current_markdown():
    """Returns the current markdown contents to display on frontend"""
    filepath = os.path.join(FULL_REPO_PATH, MARKDOWN_FILENAME)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        return jsonify({"content": content})
    else:
        return jsonify({"content": "No file uploaded yet."})

@app.route('/commits', methods=['GET'])
def get_commits():
    try:
        total = commit_storage.functions.getCommitsCount().call()
        commits = []
        for i in range(total):
            commit = commit_storage.functions.getCommit(i).call()
            commits.append({
                "commit_hash": commit[0],
                "author_name": commit[1],
                "commit_message": commit[2],
                "date_iso": commit[3],
            })
        return jsonify(commits), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Start Everything ---

if __name__ == '__main__':
    try:
        start_hardhat_node()
        contract_address = deploy_contract()
        connect_web3(contract_address)
        print("🚀 Flask server ready at http://localhost:5000")
        app.run(debug=True)
    finally:
        kill_node()
