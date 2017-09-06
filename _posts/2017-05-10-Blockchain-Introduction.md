---
layout: post
authors: [ken_coenen, jeroen_de_prest, kevin_leyssens]
title: 'Blockchain introduction'
image: /img/blockchain/blockchainHeaderImagePNG.png
tags: [Blockchain, Hyperledger, Ethereum, Smart contracts]
category: Blockchain
comments: true
---


> A lot of people are talking about blockchain these days.
They're talking about blockchain as the next big thing after mainframes, computers, the internet and social networking.
This introduction is the first part in a series of blockchain posts.

# Topics

In this first article about the innovative blockchain technology, we'll cover the following topics:

1. [Blockchain and its relation to Bitcoin](#blockchain-and-its-relation-to-bitcoin)
2. [What is blockchain](#what-is-blockchain)
3. [Types of blockchain networks](#types-of-blockchain-networks)
4. [The consensus process](#the-consensus-process)
5. [Smart contracts](#smart-contracts)
6. [Valid blockchain business cases](#valid-blockchain-business-cases)
7. [Existing platforms](#existing-platforms)
8. [Thinking decentralized](#thinking-decentralized)
9. [Conclusion](#conclusion)
10. [Recommended reading](#recommended-reading)


# Blockchain and its relation to Bitcoin

First of all, Bitcoin and blockchain are two different things.
People tend to use both words by each other in three different contexts:

<div class="row" style="margin: 2.5rem 0;">
  <div class="col-md-offset-3 col-md-2" style="width:32%">
{% include image.html img="/img/blockchain/bitcoin_currency.png" alt="Crypto-currency" title="Crypto-currency" caption="1. Digital cryptocurrency" style="max-width: 80px;" %}
  </div>
  <div class="col-md-2" style="width:32%">
{% include image.html img="/img/blockchain/bitcoin_protocol.png" alt="Protocol" title="Protocol" caption="2. Protocol and client for executing transactions" style="max-width: 80px;" %}
  </div>
  <div class="col-md-2" style="width:32%">
	{% include image.html img="/img/blockchain/bitcoin_blockchain.png" alt="Blockchain" title="Blockchain" caption="3. The blockchain which stores all Bitcoin transactions" style="max-width: 80px;" %}
</div>
</div>

So when talking about Bitcoin or blockchain with people, it's important to mind this terminology.
Here's a funny quote I read in the book [Blockchain: A Blueprint for a New Economy](http://www.goodreads.com/book/show/24714901-blockchain),
which describes this ambiguity very well:
<blockquote class="clear"><p>
It's as if PayPal called the internet PayPal on which the PayPal protocol was run to transfer PayPal currency.
</p></blockquote>

In January 2009, the Bitcoin network came into existence.
Bitcoin isn't the first attempt to digital currency, but it's the first one that uses a __peer-to-peer network__ to create a platform for executing transactions __without depending on central authorities__ who validates them.

You should see Bitcoin as the first platform that implemented blockchain technology.


# What is blockchain?

So forget about Bitcoin now.
That's not what this post is about.
People say blockchain is as important as the introduction of the internet. 
The internet is a worldwide network to __share information__ with one another, but it is far less suitable for transferring value.
If you send someone a file, it is always a copy of your file, which means you and the receiver are both in possession of the file.
As we already stated, that is ideal for sharing information, but not applicable for money, certificate of ownership, and so forth.
And the latter is exactly what blockchain enables: digitalizing and transferring such values.


Let's take a look at the underlying decentralized ledger technology.
We believe blockchain's definition is a good starting point:

> "Blockchain is a type of __distributed database__ that stores a __permanent__ and __tamper-proof__ ledger of __transaction data__."


### TL;DR version

Blockchain is a __decentralized immutable data structure__.
In short the blockchain is a network of computers, called nodes. 
Every node has the same copy of the database which they manage together. 
A transaction is encrypted and signed on a mathematical way. 
When a transaction is saved in the blockchain, it is duplicated across all nodes in the network.
That's why we talk of blockchain as __distributed ledger technology__, a ledger of transactions, distributed across a computer network.
Transactions are bundled in one __block__ before they are validated by other nodes.
Once the network reached consensus about the validity of these transactions, the block is appended to the existing __chain__ of blocks.
The block stores the validated transactions together with a hash and a reference to the previous block.
Stored transactions cannot be undone, as this would invalidate all hashes in the chain.


### Now a little more in detail...

Transactions are broadcasted to the network for miners to __mine__. 
They assess the non-validated transactions on the memory pool by solving a mathematical puzzle. 
A miner builds a block containing all transactions, a proof of work that the puzzle was solved (also known as the __block root hash__, which is also the ID of the block) and a hash to the previous block.

A block also contains the following items:

* A timestamp
* a nonce
* and a __merkle root hash__

A __merkle root__ does not verify transactions, but verifies a set of transactions.
Transaction IDs are hashes of the transaction, and the merkle tree is constructed from these hashes.
It means that if a single detail in any of the transactions changes, so does the merkle root. 
It also means that if the exact same transactions are listed in a different order, the merkle root will also change.
So the merkle root is cryptographic proof of the transactions in the block together with the order they are in.

The __nonce number__ is a field whose value is set so that the hash of the block will comply with the predefined network rules (eg: a run of leading zeros in Bitcoin).
 Miners increase the nonce until the hash is valid.
 Sha-256 is used to hash.

The miner appends the block to the blockchain. 
And the majority of the other nodes, 50% + 1, double-check by __verifying the proof of work__ in the block.
It sometimes occurs that miners will validate two blocks at the same time and they will be appended to the chain. 
When this occurs, which doesn't happen often, the principle of **Longest Chain Wins** will be implemented.
The longest chain remains and the conflicting chain will be discarded.
The transactions of the discarded chains will be put back in the memory pool to be mined another time.

You now have a basic understanding of why we call it __the blockchain__.

<div class="row" style="margin: 0 auto 2.5rem auto;">
  <div class="col-md-offset-3 col-md-6">
	{% include image.html img="/img/blockchain/how-blockchain-works.png" alt="short explanation" title="Short explanation"%}
</div>
</div>


# Types of blockchain networks


### Public blockchains (aka. permissionless)

This is a blockchain that everyone in the world can view, write transactions to, expect that these transactions will be validated and added to the blockchain.
In this type of blockchain network, any connected node can contribute the consensus process.
This process is used to determine if a block is valid or not.
You can read more about [the consensus process](#the-consensus-process) further in this blogpost.

The public blockchain is generally a complete peer-to-peer network. Its characteristics are:

* The users from the chain get protected from the creators of the chain, because there are actions to the network that even they cannot perform.
__Developers are not the owners__ of the network and don't have more or less privileges than normal users.
* These chains are __transparent__ because everyone can see what is happening inside the chain.

<blockquote class="clear"><p>
"In some cases, public is clearly better; in others, some degree of private control is simply necessary.
 As is often the case in the real world, it depends."
 - Vitalik Buterin of Ethereum
</p></blockquote>


### Consortium blockchains

In this type of blockchain network, the consensus process is executed by a __predetermined group of nodes__ in the network.
Let's take a consortium of fifteen financial institutions as an example, each with a node.
From this group of fifteen, there are ten nodes that need to sign each block before it is valid.
You could say that these ten take ownership of the data in the blockchain.
They decide which transactions are valid and which ones are not.
__Read rights__ can be __public or restricted__ to the members of the network, eg. we can limit public view to a set number of times.

Public and consortium blockchain networks are decentralized, with the difference that the consortium network is __not completely peer-to-peer__, because not everyone is equal.


### Private blockchains (aka. permissioned)

There is only a small difference between consortium and private blockchain networks: write rights are with __one organization__ instead of multiple.
The read rights can be the same as with a consortium blockchain.

The following characteristics apply for a private blockchain network:

* The company that controls the private chain can alter the rules of the chain. In some cases this can be necessary.
* The nodes that confirm a block are known, so there can't be a majority by a mining farm with a 51% attack.
* Transactions are cheaper than with public chains. This is because they need to be verified by less nodes.
* Nodes are well connected and errors can be fixed quickly with manual interaction.
This means that these networks give a faster confirmation and they will always be __faster__ than public networks.
* Private blockchains are just better at privacy because the __access to the blockchain can be limited__.
From a __legal point-of-view__, this characteristic can have significant impact on the type of blockchain network you'll pick.


# The consensus process

As we mentioned before, the network must reach a __consensus__ of 50%+1 for a transaction to be written to the blockchain.
There are a few ways a blockchain network will do this.
We will be discussing the two most used.
Ronald Chan wrote a nice article about consensus mechanisms in [Consensus Mechanisms used in blockchain](https://www.linkedin.com/pulse/consensus-mechanisms-used-blockchain-ronald-chan).


### Proof-of-Work

This is used to deter people from tampering with the blocks and launching (d)dos attacks. 
We let them do a feasible but not insignificant amount of work to get a consensus. 
For example in the blockchain they need to find the correct nonce number that is part of the block to create a hash that fits the predetermined rules. 
A rule can be that the hash must start with six zeros.


### Proof-of-Stake

In this case you don't need to find a nonce number but you just need to proof that you have a certain stake in the network.
The bigger your stake, the more you can mine from the network.


# Smart Contracts
The term **smart contract** has no clear and settled definition.
So what is it?  
Smart contracts are traditional contracts and official documents, but written in code.
As such, the contract is understandable for everyone across the globe, irrespective of the jurisdiction it is related to. 
Smart contracts are like **If This Then That** statements, only they tend to be a lot more complex.

The different definitions usually fall into one of the following two categories:

1. Sometimes the term is used to identify a specific technology.
__Pieces of code__ that are stored, verified and executed on a blockchain.
For example, a hello world program.
2. The term can also be used to refer to a specific application of that technology: as a complement, or substitute, for __legal contracts__.

<div class="row" style="margin: 0 auto 2.5rem auto; padding: 0;">
  <div class="col-md-offset-3 col-md-6" style="padding: 0;">
	{% include image.html img="/img/blockchain/smart-contract.png" alt="Smart contract explained" title="Smart contract explained" %}
</div>
</div>


# Valid blockchain business cases

It's important to understand that blockchain isn't a solution to all of your business problems.
Like in any other project, you shouldn't make critical technology decisions on hyped buzzwords.
Instead you should focus on the business value it delivers.
When we translate the blockchain characteristics to business values, it can potentially solve business problems in the following five key elements:

1. [Transparency](#transparency)
2. [Operation harmonization](#operation-harmonization)
3. [Business continuity](#business-continuity)
4. [Permanence](#permanence)
5. [Security](#security)
6. [Decentralized](#thinking-decentralized)

We'll discuss each element in detail and explain why blockchain technology can be an answer to that business problem.


### Transparency

In a public blockchain network, by default every member of the ecosystem can access all transactions stored in the chain.
They can even access smart contracts.

An example of improved transparency is in the supply chain. 
Documenting a product's journey across the supply chain reveals its true origin and touchpoints, which increases trust and helps eliminate the bias found in today's opaque supply chains.
Manufacturers can also reduce recalls by sharing logs with OEMs and regulators.

Another potential use involves the recording of patents and intellectual property. 
Due to blockchain's 100% transparency and its unforgeable nature, the information cannot be altered.
Because transactions are easily trackable, it's the perfect solution for recording ownership of patents and properties.

> You can only achieve __100% transparency__ if you setup a public, permissionless blockchain network.
In a consortium- or private blockchain network, you __can__ define access rules to say which members can query certain information, which reduces its transparent nature.


### Operation harmonization

Because business logic is implemented as __smart contracts__, and smart contracts are replicated over the different nodes that execute them, you have decentralized business logic.
This allows you to use the same open source technology in all departments of your business.
As a result, business processes are joint together, in contrast to Enterprise BPM, where business logic reuse is limited due to single enterprise data silos.


### Business continuity

By using blockchain technology, you have less dependency on a central infrastructure.
That is because all nodes can execute transactions.
When one node goes down, other nodes take over the processing.
You can say that in a blockchain network, you have __automatic failover__.


### Permanence

We already talked about the fact that activities in a blockchain cannot be undone.
They are __immutable__.
Because of this characteristic, there's an __audit trail__ of what happened in the system.

You could say that this audit trail has a lot of similarities with the architectural pattern __Event Sourcing__.
With Event Sourcing, all changes to application state are stored as a __sequence of events__.
This is comparable to how transactions are stored in the blockchain.
It could be interesting to combine both blockchain technology and Event Sourcing principles in a project.

If you want to learn more about Event Sourcing, make sure to visit the following pages:

* There's an excellent article on [Martin Fowler's blog](http://martinfowler.com/eaaDev/EventSourcing.html)
* Our colleague Yannick De Turck also has a chapter on Event Sourcing in his [blogpost about Lagom](/microservices/2016/04/22/Lagom-First-Impressions-and-Initial-Comparison-to-Spring-Cloud.html#cqrs-and-event-sourcing)
* Ken Coenen has written about [CQRS and Event Sourcing](/domain-driven%20design/2016/02/02/A-Decade-Of-DDD-CQRS-And-Event-Sourcing.html) too after Ordina JWorks was present at [DDD Europe](https://dddeurope.com) back in 2016

> Please note that you can only achieve __full immutability__ if you setup a public, permissionless blockchain network.
In a consortium or private blockchain network, transactions can be altered because you know the nodes that validate them.


### Security

Blocks are timestamped and protected with __cryptographic technology__ that is considered unbreakable.
If a block is added it can't be removed or altered.
If you change a single bit of a transaction, the hash of this transaction will be completely different. 
So the __merkle root__ hash (Merkle trees are explained in the section [What is blockchain](#what-is-blockchain)) won't be the same, the __nonce__ number will then be wrong and the block will be considered invalid.
In this way transactions are secure once chained to the blockchain. 

The cryptographic technology works with the principal of __public and private keys__, but hashing is also a part of this technology.
The private key is linked to the public key, but you cannot find out the private key if you have the public key. 
The private key allows you to verify that you are the owner of the public key. 
To make transactions, you'll need a unique key (private key) to make a digital signature to prove that you are the owner.
The private key is stored in your __wallet__.

> Your wallet doesn't always need to contain money, it can also hold your identity.

The network is also protected from (d)dos attacks because of the distributed nature of blockchain. 
If a hacker wants to take down the blockchain they would need to take down every node in the network. 
The proof-of-work can also help deter these attacks and spam because of the high costs of mining. 
Even if a hacker is able to penetrate one network and attempts to steal funds, there are multiple redundant copies of the same ledger stored around the world. 
If one is tampered with, the others could be used as a backup to prove what funds actually belong in each account. 

# Existing platforms

We will now discuss a few platforms that can be used to set up a blockchain and also compare Bluemix and Azure.

The first one is [__Ethereum__](https://www.ethereum.org/), a public blockchain. Ethereum looks like the Bitcoin blockchain, but it uses Ether as the currency.
It is faster than Bitcoin with a transaction taking seven seconds instead of ten minutes. 
We can also put smart contracts on the chain, with bitcoin you can only put transactions on there.

Another big one we have is [__Hyperledger__](https://www.hyperledger.org/). 
This is a open source collaborative effort created by The Linux Foundation. 
Another big partner in Hyperledger is IBM because they helped them with development and donated some patents.
Hyperledger is also more focused on private networks.
The fun part is that you can run Hyperledger locally on your computer and try out the technology.
That brings us to [__IBM Blockchain__](http://www.ibm.com/blockchain/).
IBM's Bluemix platform focusses on private blockchains.
It empowers businesses to digitize their transaction workflow through a highly secured, shared and replicated ledger.
The current technology possibilities weren't cutting it in terms of privacy so they added their code and patents to the Hyperledger project.

The next one is [__Multichain__](http://www.multichain.com/). 
Multichain is an open source private blockchain, which is Bitcoin compatible.

Next up is [__Openchain__](https://www.openchain.org/). 
Openchain is a little bit special because it doesn't use the concept of blocks but the transactions are directly chained with one another, which makes it a lot faster.
Openchain is an open source private blockchain. 
It also doesn't use proof-of-work but proof-of-authority.

[__BigChainDB__](https://www.bigchaindb.com/) is not really a complete blockchain but it is more a database with blockchain features like: decentralization, immutability, public/private and consensus.
BigChainDB is also open source.

Last but not least, we have [__Microsoft Azure blockchain__](https://azure.microsoft.com/en-us/solutions/blockchain/) left to discuss.
As you may have guessed, Azure is the complete opposite of IBM's Bluemix.
Azure focuses on being public, although this does not mean they don't believe in the private model.
Microsoft has said that private networks will still be important for the commercial adaptation of the blockchain technology.
Microsoft also don't dedicate their platform to one type of technology like Hyperledger for Bluemix but they support many different technologies like Ethereum, Hyperledger and more. 
They do have a preference though for Ethereum because they joined the Enterprise Ethereum Alliance.

<div class="row" style="margin: 0 auto 2.5rem auto; width: 66%;">
  <div class="col-md-offset-3 col-md-6" style="padding: 0;">
	{% include image.html img="/img/blockchain/partners.png" alt="Companies and consortiums" title="Companies and consortiums" caption="Table: IBM is part of Hyperledger and Microsoft is part of Enterprise Ethereum Alliance." %}
</div>
</div>


# Thinking decentralized

Last year, Ken Coenen gave a presentation about the popularity of APIs, and how companies team up to create innovative solutions.
Data is freed from their silos and made available through APIs.
It's consumable for other departments and even other companies.
However, when you think about it, all of this data is centralized and we need extra effort to expose it to other parties.

When working with blockchain technology, your data is __decentralized by nature__.
It's funny when you think about it...
Why do we want to store the data somewhere centralized in a silo and then make an extra effort to expose it?
Isn't is easier to start decentralized from the beginning and give access to the people who need it?
What have we been doing all these years?

We'll give an example.
All applications implement their own user profile functionality.
All of this user data - __your profile information__ - is duplicated across many companies.
It's already a big improvement that applications allow you to use another platform's credentials.
Logging in with your Facebook or Google account is becoming a habit.
This gives the end user a way to minimize his/her digital footprint.
Don Tapscott explains this really well in summer 2016's TED Talk [How the blockchain is changing money and business](https://youtu.be/og7PCYlDYsU?t=849).
Of course, blockchain technology is still in its early stages.
It's not even sure whether the technology will last.
Although these statements are purely hypothetical, we find much food for thought in them.

<div class="row" style="margin: 0 auto 2.5rem auto; width: 66%; padding: 0;">
  <div class="col-md-offset-3 col-md-6" style="padding: 0;">
	{% include image.html img="/img/blockchain/network-types.jpg" alt="Network types" title="Network types" %}
</div>
</div>


# Conclusion

When talking with people about the possibilities of blockchain, it quickly becomes clear that we still have a long way to go.
People aren't waiting for yet another technological revolution.
Instead, we need to start small.
Blockchain and distributed ledger technology in general will have to evolve naturally.

Blockchain solutions like IBM Blockchain or Microsoft Azure Blockchain-as-a-Service make the technology very accessible to companies in an early stage.
We believe that a __private blockchain network__ is the __best way to start__ for a company because of the following reasons:

* Throwing all your data at the world is still a very scary idea
* You have to take all __legal aspects__ into account (think of the EU's new [General Data Protection Regulation](http://ec.europa.eu/justice/data-protection/reform/files/regulation_oj_en.pdf))
* You can start small and expose some transactions by defining permissions

Companies are starting to develop applications on their proprietary Bluemix- or Azure platform, without exposing everything to the outside world.
Get inspired by visiting [State of the Dapps](http://dapps.ethercasts.com/).


# Recommended reading

You can read the following books if you like to get a grasp on possible use cases which can be implemented using blockchain technology.
Please note that neither of these books will deep dive into the technical aspects.

* [Blockchain: Blueprint for a New Economy by Melanie Swan](http://www.goodreads.com/book/show/24714901-blockchain)
* [Blockchain Revolution: How the Technology Behind Bitcoin Is Changing Money, Business, and the World by Don Tapscott, Alex Tapscott](http://www.goodreads.com/book/show/25894041-blockchain-revolution)