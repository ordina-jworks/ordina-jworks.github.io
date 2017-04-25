---
layout: post
authors: [ken_coenen, jeroen_de_prest, kevin_leyssens]
title: 'Blockchain introduction'
image: /img/blockchain/blockchainHeaderImagePNG.png
tags: [Blockchain, Smart contracts]
category: Blockchain
comments: true
---


> A lot of people are talking about blockchain these days.
They're talking about blockchain as the next big thing after mainframes, computers, the internet and social networking.
This introduction is the first part in a series of blockchain posts.

### Blockchain and it's relation to Bitcoin

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

In January 2009, the bitcoin network came into existence.
Bitcoin isn't the first attempt to digital currency, but it's the first that uses a __peer-to-peer network__ to create a platform for executing transactions __without depending on central authorities__ who validate them.

You should see Bitcoin as the first platform that implemented blockchain technology.

### Blockchain

So forget about Bitcoin now.
That's not what this post is about.
People say blockchain is as important as the introduction of the internet. 
The internet is a world wide network to share information with one and another. 
It is less suitable for value transfers. 
If you send someone a file, it is always a copy of your file. 
Which means you and the receiver are both in possession of the file which is ideal for information but not applicable for money, certificate of ownership etc… 
This is exactly what is possible with Blockchain. 
To digitalise and transfer such values.  
Let's take a look at the underlying decentralized ledger technology, the blockchain.
I think blockchain's definition is a good starting point...

> "Blockchain is a type of __distributed database__ that stores a __permanent__ and __tamper-proof__ ledger of __transaction data__."

In other words blockchain is a __decentralized immutable data structure__.
In short the blockchain is a network of computers, called nodes. 
Every node has the same copy of the database which they manage together. 
A transaction is encrypted and signed on a mathematical way. 
When a transaction is saved in the blockchain, it is duplicated across all nodes in the network.
That's why we talk of blockchain as __distributed ledger technology__.
It's a ledger of transactions, distributed across a computer network.
Transactions are bundled in one __block__ before they are validated by other nodes.
Once the network reached consensus about the validity of these transactions, the block is appended to the existing __chain__ of blocks.
The block stores the validated transactions together with a hash and a reference to the previous block.
Stored transactions cannot be undone.

Now a little more in detail:
Transactions are broadcasted to the network for miners to __mine__. 
They assess the non-validated transactions on the memory pool by solving a mathematical puzzle. 
A miner builds a block containing all transactions, a proof of work that the puzzle was solved (__block root hash__ which is also the ID of the block) and a hash to the previous block. 
A block also contains following items: A timestamp, a nonce and a __merkle root hash__ .
A merkle root does not verify transactions, but verifies a set of transactions. 
Transaction ID's are hashes of the transaction, and the Merkle tree is constructed from these hashes. 
It means that if a single detail in any of the transactions changes, so does the merkle root. 
It also means that if the exact same transactions are listed in a different order, the merkle root will also change.
So the merkle root is cryptographic proof of which transactions are in the block, and which order they are in.
The nonce number specifies that the block root hash must start with a specified number, like 4 leading zero’s. 
This way blockchain is very secure. 
Sha-256 is used to hash.


The miner appends the block to the blockchain. 
And the majority of the other nodes, 50% + 1, double-check by verifying the proof of work in the block. 
It sometimes occurs that miners will validate 2 blocks at the same time and they will be appended to the chain. 
When this occurs, which doesn't happen often, the principle of “Longest Chain Wins” will be implemented. 
So the chain, who is the longest will stay and the other chain will be discarded. 
The transactions of the discarded chains will be put back in the memory pool to be mined another time.



You now have a basic understanding of why we call it __the blockchain__.
<div class="row" style="margin: 2.5rem 0;">
  <div class="col-md-offset-3 col-md-6">
	{% include image.html img="/img/blockchain/blockchain.png" alt="short explanation" title="Short explenation" caption="Figure 1: Blockchain short non-technical explanation" %}
</div>
</div>


### PROOF OF WORK vs PROOF OF STAKE 
As we mentioned before, the network must reach a __consensus__ of 50%+1. 
There are a few ways a blockchain will do this. 
We will be discussing the two most used. 
See more at [Consensus mechanisms used blockchain ronald chan](https://www.linkedin.com/pulse/consensus-mechanisms-used-blockchain-ronald-chan) 

#### Proof-of-Work: 
This is used to deter people from tampering with the blocks and launching (d)dos attacks. 
We let them do a feasible but not insignificant amount of work to get a consensus. 
For example in the blockchain they need to find the correct nonce number that is part of the block to create a hash that fits the predetermined rules. 
A rule can be that the hash must start with six zeros.

#### Proof-of-Stake: 
In this case you don’t need to find a nonce number but you just need to proof that you have a certain stake in the network. 
The bigger your stake, the more you can mine from the network.


### Smart Contracts
The term “smart contract” has no clear and settled definition. 
So what is it?  
Smart contracts are traditional contracts, but written in code. 
As such, the contract is understandable for everyone across the globe, irrespective of the jurisdiction it is related to. 
Smart contracts are like If This Then That statements, only they tend to be a lot more complex. 

The different definitions usually fall into one of two categories. 
Sometimes the term is used to identify a specific technology – code that is stored, verified and executed on a blockchain. For example a hello world program.

Other times, the term is used to refer to a specific application of that technology: as a complement, or substitute, for legal contracts.


### Types of Blockchain
#### Public blockchains (permissionless)
This is a blockchain that everyone in the world can view, write transactions to, expect that these transactions will be validated and added to the blockchain. 
In this blockchain everybody can help with the consensus process. 
This process is used to determine if a block is valid or not. 
As consensus processes we can use proof-of-work or proof-of-stake but there are also other options. (See above at [Proof-of-work vs proof-of-stake](#proof-of-work-vs-proof-of-stake))
The public blockchain is generally a complete peer-to-peer network.

#### Consortium blockchains
In this type of blockchain the consensus process happens by a predetermined group of nodes in the network. 
For example a consortium of 15 financial institutions, each with a node. 
From this group of 15 there are 10 nodes that need to sign each block before it is valid. 
In this blockchain the read rights can be public or restricted to the members of the network. 
We can also limit public view to a set number of times for example. 
These types of chains are decentralized ( not completely peer-to-peer because not everyone is equal).

#### Private Blockchains (permissioned)
There is only a small difference between consortium and private. 
This is that all the write rights are with one organization instead of multiple. 
The read rights are the same as with a consortium chain.
### Private vs Public
#### Private
* The company that controls the private chain can alter the rules of the chain. In some cases this can be necessary.
* The nodes that confirm a block are known so there can’t be a majority by a mining farm with a 51% attack.
* Transactions are cheaper than with public chains. This is because they need to be verified by less nodes.
* Nodes are well connected and errors can be fixed quickly with manual interaction. 
This means that these networks give a faster confirmation and they will always be faster than public networks. 
* Private blockchains are just better at privacy because the access to the blockchain can be limited.

#### Public
* The users from the chain get protected from the developers because there is stuff that they can’t even do to the network. 
The developers / creators are not the owners of the network and don't have more or less privileges than normal users.
* These chains are a lot more transparent because everyone can always see what is happening inside the chain. 
<blockquote class="clear"><p>
“In some cases, public is clearly better; in others, some degree of private control is simply necessary.
 As is often the case in the real world, it depends.” 
 - Vitalik Buterin of Ethereum
</p></blockquote>



### Valid blockchain use cases
It's important to understand that blockchain isn't a solution to all of your problems.
Like in any other project, you shouldn't make critical technology decisions on hyped buzzwords.
Instead you should focus on the business value it delivers.
When we translate the blockchain characteristics to business values, it can potentially solve business problems in the following five key elements:

1. [Transparency](#transparency)
2. [Operation harmonization](#operation-harmonization)
3. [Business continuity](#business-continuity)
4. [Permanence](#permanence)
5. [Security](#security)

We'll discuss each element in more detail and explain why blockchain technology can be an answer to that business problem.


#### Transparency
All members of the ecosystem can access the information. 
An example of improved transparency is in the supply chain. 
Documenting a product’s journey across the supply chain reveals its true origin and touchpoints, which increases trust and helps eliminate the bias found in today’s opaque supply chains. 
Manufacturers can also reduce recalls by sharing logs with OEMs and regulators.

Another potential use involves the recording of patents and intellectual property. 
Due to the blockchain’s 100% transparency and its unforgeable nature, the information cannot be altered. It is also easily trackable, thus being the perfect solution for recording ownership of patents and properties.
Please note that this doesn't mean you cannot define access rules to say which members can query certain information.

#### Operation harmonization
Smart contracts as business logic, executed by all nodes.

#### Business continuity
By using blockchain technology, you have less dependency on a central infrastructure.
That is because all nodes can execute transactions.
When one node goes down, other nodes take over the processing.
You can say that by using blockchain, you have __automatic failover__.

#### Permanence
We already talked about the fact that activities in a blockchain cannot be undone.
They are __immutable__.
Because of this characteristic have an __audit trail__ of what happened in the system.
You could say that this audit trail has a lot of similarities with the architectural pattern __Event Sourcing__.
With Event Sourcing, all changes to application state are stored as a sequence of events.
It could be interesting to combine blockchain technology with this architectural principle.

You can read more about Event Sourcing on [Martin Fowler's blog](http://martinfowler.com/eaaDev/EventSourcing.html).

Our colleague Yannick De Turck also has a chapter on Event Sourcing in his [blogpost about Lagom](/microservices/2016/04/22/Lagom-First-Impressions-and-Initial-Comparison-to-Spring-Cloud.html#cqrs-and-event-sourcing).

Ken Coenen has written about [CQRS and Event Sourcing](/domain-driven%20design/2016/02/02/A-Decade-Of-DDD-CQRS-And-Event-Sourcing.html) too when we visited DDD Europe last year.


#### Security
Blocks are time-stamped and protected with __cryptographic technology__ that is considered unbreakable. 
If a block is added it can’t be removed or altered. 
If you change a single bit of a transaction, the hash of this transaction will be completely different. 
So the __merkle root__ hash (Merkle trees are explained in the section [blockchain](#blockchain)) won’t be the same, the __nonce__ number will then be wrong and the block will be considered invalid. 
In this way transactions are secure once chained to the blockchain. 

The cryptographic technology works with the principal of __public and private keys__ but hashing is also a part of this technology. 
The private key is linked to the public key, but you can not find out the private key if you have the public key. 
The private key allows you to verify that you are the owner of the public key. 
To make transactions, you’ll need a unique key (private key) to make a digital signature to prove you are the owner. 
The private key is stored in your __wallet__. Your wallet can just be your identity , without any money, ethereum etc...  in it.

The network is also protected from (d)dos attacks because of the distributed nature of blockchain. 
If a hacker wants to take down the blockchain they would need to take down every node in the network. 
The proof-of-work can also help deter these attacks and spam because of the high costs of mining. 
Even if a hacker is able to penetrate one network and attempts to steal funds, there are multiple redundant copies of the same ledger stored around the world. 
If one is tampered with, the others could be used as a backup to prove what funds actually belong in each account. 


### Thinking decentralized: *"Collaborative Economy 2.0"*
Last year, Ken Coenen gave a presentation about the popularity of APIs, and how companies team up to create innovative solutions.
Data is freed from their silo's and made available through APIs.
It's consumable for other departments and even other companies.
However, when you think of it, all of this data is centralized and we need extra effort to expose it to other parties.

When working with blockchain technology, your data is __decentralized by nature__.
It's funny when you think of it...
Why do we want to store the data somewhere centralized in a silo and then make an extra effort to expose it?
Isn't is easier to start decentralized from the beginning and give access to the people who need it?
What have we been doing all these years?

I'll give an example.
All applications implement their own user profile functionality.
All of this user data - __your profile information__ - is duplicated across many companies.
It's already a big improvement that applications allow you to use another platform's credentials.
Logging in with your Facebook or Google account is becoming a habit.
This way, as an end-user, you can minimize your digital footprint.
Don Tapscott explains this really well in this summer's TED Talk [How the blockchain is changing money and business](https://youtu.be/og7PCYlDYsU?t=849).
Of course, blockchain technology is still in its early stages.
It's not even sure whether the technology will last.
Although these statements are purely hypothetical, I find much food for thought in them.

###  Some platforms
We will now discuss a few technologies that can be used to set up a blockchain and also compare Bluemix and Azure. 

The first one is [__Ethereum__](https://www.ethereum.org/), a public blockchain. Ethereum looks like the Bitcoin blockchain, but it uses Ether as the currency.
It is faster than Bitcoin with a transaction taking 7 seconds instead of 10 minutes. 
We can also put smart contracts on the chain, with bitcoin you can only put transactions on there.

Another big one we have is [__Hyperledger__](https://www.hyperledger.org/). 
This is a open source collaborative effort created by The Linux Foundation. 
Another big partner in Hyperledger is IBM because they helped them with development and donated some patents. 
Hyperledger is also more focused on private networks. 

The next one is [__Multichain__](http://www.multichain.com/). 
Multichain is a open source private blockchain, which is Bitcoin compatible. 

Next up is [__Openchain__](https://www.openchain.org/). 
Openchain is a little bit special because it doesn’t use the concept of blocks but the transactions are directly chained with one another, this makes it a lot faster. 
Openchain is an open source private blockchain. 
It also doesn’t use proof-of-work but proof-of-authority. 

The last one we will discuss is [__BigChainDB__](https://www.bigchaindb.com/). 
BigChainDB is not really a complete blockchain but it is more a database with blockchain features like: decentralization, immutable, public/private and consensus. 
BigChainDB is also open source.

Now on to __IBM Bluemix__.
Bluemix uses the Blockchain as a Service(BaaS) in a more private manner. 
They focus on private blockchains but to do this they found that the privacy with the current technologies wasn't cutting it so they added to the Hyperledger project.

Now we only have __Microsoft Azure__ left to discuss. 
As you may be able to guess Azure is the complete opposite of Bluemix. 
Azure focuses on being public, although this does not mean they don't believe in the private model.
Microsoft has said that private networks will still be important for the commercial adaptation of the blockchain technology.
Microsoft also don't dedicate their platform to one type of technology like Hyperledger for Bluemix but they support many different technologies like Ethereum, Hyperledger and more. 
They do have a preference though for Ethereum because they joined the Enterprise Ethereum Alliance.

<div class="row" style="margin: 0 auto 2.5rem auto; width: 66%;">
  <div class="col-md-offset-3 col-md-6">
	{% include image.html img="/img/blockchain/partners.png" alt="short explanation" title="Companies and consortiums" caption="Figure 2: IBM is part of Hyperledger and Microsoft is part of Enterprise Ethereum Alliance" %}
</div>
</div>


### Conclusion
When talking with people about the possibilities of blockchain, it quickly becomes clear that we still have a long way to go.
People aren't waiting for yet another technological revolution.
Instead, we need to start small.
Blockchain and distributed ledger technology in general will have to evolve naturally.

The way we see it, private blockchain solutions like [IBM Blockchain](http://www.ibm.com/blockchain/)
IBM Blockchain - United States
ibm.com
IBM Blockchain empowers businesses to digitize your transaction workflow through a highly secured, shared and replicated ledger.


or Windows' [Blockchain-as-a-Service](https://azure.microsoft.com/en-us/solutions/blockchain/) are more accessible to companies in this early stage. 
Azure uses the Ethereum technology.

or one of the many independent open source platforms, which can be used in combination with BlueMix or Azure.

Companies are starting to develop applications on their Bluemix- or Azure platform, without exposing everything to the outside world.
Get inspired by visiting [State of the DApps](http://dapps.ethercasts.com/)


### Some thoughts
Blockchain is per definition immutable. 
But if there is one thing we learn in school it is that in the IT nothing stays the same for a long time. 
So we need to adapt our system. 
Use normalized systems. 
What to do with upgrades and changes in code / smart contracts ?

### Recommended reading
You can read the following books if you like to get a grasp on possible use cases which can be implemented using blockchain technology.
Please note that neither of these books will deep dive into the technical aspects.

<script src="http://www.goodreads.com/book/avg_rating_widget/24714901" type="text/javascript"></script><div style="clear: both;"></div>
<script src="http://www.goodreads.com/book/avg_rating_widget/25894041" type="text/javascript"></script><div style="clear: both;"></div>







