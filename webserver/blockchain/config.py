from web3 import Web3
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Connect to local Hardhat node
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
assert w3.is_connected(), "Web3 is not connected!"

# Load contract ABI
with open(os.path.join(BASE_DIR, "contract_abi.json")) as f:
    abi = json.load(f)

# Set your deployed contract address here
CONTRACT_ADDRESS = "0xYourContractAddressHere"

commit_storage = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

# Set default account (first account from Hardhat)
w3.eth.default_account = w3.eth.accounts[0]
