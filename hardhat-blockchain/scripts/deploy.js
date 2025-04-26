async function main() {
    const CommitStorage = await ethers.getContractFactory("CommitStorage");
    const commitStorage = await CommitStorage.deploy();

    await commitStorage.waitForDeployment();  // ✅ correct way now
    const address = await commitStorage.getAddress();  // ✅ correct way to get address

    console.log("✅ CommitStorage deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
