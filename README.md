# MiniVesting

This project demonstrates a basic vesting smart contract, heavily inspired by Openzeppelin Vesting contract, but targetting another use case :

Is your protocol going to release a token ? Do you have indivuals with vested tokens ? This project implements a smart contract with the following properties :

- There is a single ERC20 token that needs to be vested
- Multiple investors will have vested tokens, with potentially different terms : cliff, duration and number of token can be confiugured for each investor.

It includes a basic UI to query data from the contract (cliff date, vesting period, number of unlocked tokens)

For demonstration purpose an airdrop smart contract has been added to receive some ERC20 tokens and deposit them into the vesting smart contract.

## start a local blockchain and deploy smart contract

```shell
hh node --network hardhat
```

## Mint USDC locally :

```shell
hh run ./scripts/mintUsdc.js --network localhost
```

## Tests :

```shell
hh test
```

## Gas report :

```shell
hh test
```

=> Results in gas-report.txt

## Deploy to testnet

```shell
hh deploy --network goerli
```
