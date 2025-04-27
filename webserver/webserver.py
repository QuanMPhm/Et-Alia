import os
import subprocess
import time
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from web3 import Web3

# --- Flask setup ---
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- Database setup ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- Paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'frontendkelvin'))
REPO_DIR = os.path.join(BASE_DIR, "repos")
REPO_NAME = "markdown_repo"
FULL_REPO_PATH = os.path.join(REPO_DIR, REPO_NAME)
MARKDOWN_FILENAME = "file.md"

# --- Globals ---
CONTRACT_ADDRESS = "0x031a0698CCcB123504d0320b5edC01128529901A"
NODE_URL = 'https://westend-asset-hub-eth-rpc.polkadot.io'
SERVER_PK = os.environ["SERVER_PK"]
hh_node = None
w3 = None
commit_storage = None
pending_commits = []

# --- User Model ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

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
    time.sleep(5)

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
    for line in output.splitlines():
        if "CommitStorage deployed to:" in line:
            return line.split(":")[1].strip()

    raise Exception("Contract address not found.")

def connect_web3(contract_address):
    global w3, commit_storage
    w3 = Web3(Web3.HTTPProvider(NODE_URL))
    assert w3.is_connected(), "Web3 not connected!"

    abi_path = os.path.join(BASE_DIR, "blockchain", "contract_abi.json")
    with open(abi_path) as f:
        abi = json.load(f)

    commit_storage = w3.eth.contract(address=contract_address, abi=abi)

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

# --- Git functions ---
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

# --- Flask Routes ---

@app.route('/')
def root():
    return send_from_directory(FRONTEND_DIR, 'login.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(FRONTEND_DIR, path)

@app.route('/upload', methods=['POST'])
def upload_markdown():
    print("🚀 Upload called.")
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    content = file.read().decode('utf-8')
    commit_message = request.form.get('message', f"Commit at {time.time()}")

    pending_commits.append({
        "filename": MARKDOWN_FILENAME,
        "content": content,
        "message": commit_message
    })

    return jsonify({"message": "Submitted for approval."}), 200

@app.route('/pending_commits', methods=['GET'])
def get_pending_commits():
    result = []

    for commit in pending_commits:
        filepath = os.path.join(FULL_REPO_PATH, commit["filename"])
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                current_content = f.read()
        else:
            current_content = ""

        diff_summary = compute_diff(current_content, commit["content"])

        result.append({
            "filename": commit["filename"],
            "message": commit["message"],
            "content": commit["content"],
            "diff_summary": diff_summary,
        })

    return jsonify(result)


@app.route('/approve_commit', methods=['POST'])
def approve_commit():
    data = request.json
    index = data.get('index')

    if index is None or index >= len(pending_commits):
        return jsonify({"error": "Invalid commit index"}), 400

    commit = pending_commits.pop(index)
    initialize_repo()

    filepath = os.path.join(FULL_REPO_PATH, commit["filename"])
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(commit["content"])


    # Commit changes to local git repo
    run_git_command(["add", commit["filename"]])
    run_git_command(["commit", "-m", commit["message"]])

    log_output = run_git_command(["log", "--pretty=format:%H%n%an%n%ad%n%s", "-n", "1"])
    commit_hash, author_name, date_readable, commit_message_saved = log_output.split("\n", 3)

    # Save commit to blockchain
    # First obtain user's private key for signing, for now we're just using a test key
    account = w3.eth.account.from_key(SERVER_PK) # Change this to the actual private key
    nonce = w3.eth.get_transaction_count(account.address)

    commit = [
        commit["filename"], 
        Web3.to_bytes(hexstr="0x" + commit_hash), 
        Web3.to_bytes(hexstr="0x" + commit_hash), 
        author_name, 
        date_readable
    ]
    transaction = commit_storage.functions.alertNewCommit(*commit).build_transaction({
        'from': account.address,
        'nonce': nonce,
        'gas': 2000000,
        'gasPrice': Web3.to_wei('20', 'gwei')
    })

    signed_txn = w3.eth.account.sign_transaction(transaction, private_key=SERVER_PK)

    # Send transaction
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    print(f"Transaction hash: {tx_hash.hex()}")

    w3.eth.wait_for_transaction_receipt(tx_hash)
    return jsonify({"message": "Commit approved and metadata saved to blockchain!"}), 200


@app.route('/reject_commit', methods=['POST'])
def reject_commit():
    data = request.json 
    index = data.get('index')
    reason = data.get('reason')

    if index is None or index >= len(pending_commits):
        return jsonify({"error": "Invalid commit index"}), 400

    pending_commits.pop(index)
    return jsonify({"message": f"Commit rejected: {reason}"}), 200

@app.route('/current_markdown', methods=['GET'])
def get_current_markdown():
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

@app.route('/summary/<commit_hash>', methods=['GET'])
def get_commit_summary(commit_hash):
    try:
        diff_output = run_git_command(["show", "--no-color", "--no-prefix", commit_hash])

        added_lines = []
        removed_lines = []
        old_line_num = None
        new_line_num = None

        lines = diff_output.splitlines()

        for line in lines:
            if line.startswith('@@'):
                parts = line.split(' ')
                old_line_info = parts[1]
                new_line_info = parts[2]
                old_line_num = int(old_line_info.split(',')[0][1:])
                new_line_num = int(new_line_info.split(',')[0][1:])
            elif line.startswith('-') and not line.startswith('---'):
                removed_lines.append((old_line_num, line[1:].strip()))
                old_line_num += 1
            elif line.startswith('+') and not line.startswith('+++'):
                added_lines.append((new_line_num, line[1:].strip()))
                new_line_num += 1
            elif not line.startswith('diff') and not line.startswith('index'):
                if old_line_num is not None:
                    old_line_num += 1
                if new_line_num is not None:
                    new_line_num += 1

        final_added = []
        final_removed = []
        removed_copy = removed_lines.copy()

        for add_ln, add_text in added_lines:
            matched = False
            for idx, (rem_ln, rem_text) in enumerate(removed_copy):
                if add_text == rem_text:
                    removed_copy.pop(idx)
                    matched = True
                    break
            if not matched:
                final_added.append((add_ln, add_text))

        for rem_ln, rem_text in removed_copy:
            final_removed.append((rem_ln, rem_text))

        summary_parts = []
        for line_num, r in final_removed:
            summary_parts.append(f"Removed at line {line_num}: {r}")
        for line_num, a in final_added:
            summary_parts.append(f"Added at line {line_num}: {a}")

        if not summary_parts:
            summary = "No meaningful content changes detected."
        else:
            summary = "\n".join(summary_parts)

        return jsonify({"summary": summary})

    except Exception as e:
        print(f"Error generating summary: {e}")
        return jsonify({"summary": "Error generating summary."}), 500

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data['email']
    password = data['password']
    role = data['role']

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User(email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Signup successful!"}), 201

import difflib

def compute_diff(old_content, new_content):
    old_lines = old_content.splitlines()
    new_lines = new_content.splitlines()

    diff = difflib.unified_diff(old_lines, new_lines, lineterm='')
    meaningful_changes = []

    for line in diff:
        if line.startswith('---') or line.startswith('+++') or line.startswith('@@'):
            continue  # Ignore diff metadata
        if line.startswith('+'):
            if line[1:].strip() == "":  # Ignore pure blank line additions
                continue
            meaningful_changes.append(f"🟢 {line[1:].strip()}")
        elif line.startswith('-'):
            if line[1:].strip() == "":  # Ignore pure blank line deletions
                continue
            meaningful_changes.append(f"🔴 {line[1:].strip()}")

    return "\n".join(meaningful_changes) if meaningful_changes else "No meaningful changes."


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        redirect_url = 'editor.html' if user.role.lower() == 'author' else 'approval.html'
        return jsonify({"message": "Login successful!", "role": user.role, "redirect_url": redirect_url}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{"email": user.email, "role": user.role} for user in users])

# --- Start Everything ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    try:
        start_hardhat_node()
        connect_web3(CONTRACT_ADDRESS)
        print("🚀 Flask server ready at http://localhost:5000")
        app.run(debug=True)
    finally:
        kill_node()
