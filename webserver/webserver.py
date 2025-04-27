import os
import subprocess
import time
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from web3 import Web3
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# --- Flask and CORS setup ---
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
hh_node = None
w3 = None
commit_storage = None

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
    time.sleep(5)  # Allow Hardhat node time to start

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

# --- Flask Endpoints ---

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

            log_output = run_git_command(["log", "--pretty=format:%H%n%an%n%ad%n%s", "-n", "1"])
            commit_hash, author_name, date_readable, commit_message_saved = log_output.split("\n", 3)

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

# --- User Authentication Endpoints ---

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

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return jsonify({"message": "Login successful!", "role": user.role}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# --- Start Everything ---

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_data = [
        {"email": user.email, "role": user.role}
        for user in users
    ]
    return jsonify(users_data)

def get_diff_summary():
    try:
        diff_output = run_git_command(["diff", "HEAD~1", "HEAD"])
        summary_lines = []
        for line in diff_output.splitlines():
            if line.startswith('+') and not line.startswith('+++'):
                summary_lines.append(f"🟢 {line[1:].strip()}")
            elif line.startswith('-') and not line.startswith('---'):
                summary_lines.append(f"🔴 {line[1:].strip()}")
        return summary_lines
    except Exception as e:
        print(f"Error getting diff: {e}")
        return ["No diff available."]

@app.route('/summary/<commit_hash>', methods=['GET'])
def get_commit_summary(commit_hash):
    try:
        # Get the diff with no color, no prefix (clean output)
        diff_output = run_git_command(["show", "--no-color", "--no-prefix", commit_hash])

        added_lines = []
        removed_lines = []
        old_line_num = None
        new_line_num = None

        lines = diff_output.splitlines()

        for line in lines:
            if line.startswith('@@'):
                # Diff hunk header, update line numbers
                parts = line.split(' ')
                old_line_info = parts[1]  # like "-5,7"
                new_line_info = parts[2]  # like "+5,8"
                old_line_num = int(old_line_info.split(',')[0][1:])
                new_line_num = int(new_line_info.split(',')[0][1:])
            elif line.startswith('-') and not line.startswith('---'):
                removed_lines.append((old_line_num, line[1:].strip()))
                old_line_num += 1
            elif line.startswith('+') and not line.startswith('+++'):
                added_lines.append((new_line_num, line[1:].strip()))
                new_line_num += 1
            elif not line.startswith('diff') and not line.startswith('index'):
                # Normal unchanged line
                if old_line_num is not None:
                    old_line_num += 1
                if new_line_num is not None:
                    new_line_num += 1

        # Clean up: Remove identical lines (same text, not based on line numbers)
        final_added = []
        final_removed = []

        removed_copy = removed_lines.copy()

        for add_ln, add_text in added_lines:
            matched = False
            for idx, (rem_ln, rem_text) in enumerate(removed_copy):
                if add_text == rem_text:
                    removed_copy.pop(idx)  # cancel out identical
                    matched = True
                    break
            if not matched:
                final_added.append((add_ln, add_text))

        for rem_ln, rem_text in removed_copy:
            final_removed.append((rem_ln, rem_text))

        # Prepare summary text
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

@app.route('/diff_summary', methods=['GET'])
def diff_summary():
    summary = get_diff_summary()
    return jsonify(summary)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Make sure DB and tables are created

    try:
        start_hardhat_node()
        contract_address = deploy_contract()
        connect_web3(contract_address)
        print("🚀 Flask server ready at http://localhost:5000")
        app.run(debug=True)
    finally:
        kill_node()
