---
layout: post
authors: [martin_kwee]
title: 'A web of trusted commits'
image: /img/digitally-signing-your-json-documents.png
tags: [Security, Git, Encryption, Digital Signature, Cryptography]
category: Security
comments: true
---
## Who Do You Trust?
When you’re building software with people from around the world, it’s important to validate that commits and tags are coming from an identified source. By using a distributed revision control system like Git, anyone can have an offline copy of your project's code repository. In theory having a central repository is not necessary, but it can be used to provide an "official" source from which other developers can clone from and work on. These other floating repositories may contain malicious code because, unfortunately, it is remarkably easy to fake your identity when committing code using Git.

The following command allows any individual with bad intentions to commit (malicious) code under your name, meaning that you will get the blame for the backdoor or exploit "you" committed:

  {% highlight bash %}
  # Individual commit.
  $ git commit -a -m "a message" --author "Sherlock H. <sherlock.h@bakerstreet.org>"

  # Global settings.
  $ git config --global user.name 'Sherlock H.'
  $ git config --global user.email sherlock.h@bakerstreet.org
  {% endhighlight %}

## Ensuring Trust

This blog post tells the story of Sherlock H. Sherlock is a witty developer who holds any security-related topic very close to his heart. After a fair amount of pondering about how he could solve the problem of black-hearted developers impersonating his personality, he decided to add **a Digital Signature** to his commits. By adding a signature Sherlock can finally sleep soundly at night because the signature indicates that he really issued the commit and that it has not been tampered with since he sent it. Moreover it can be used to trace the origin of malicious code that has made its way into a repository. The signature also assures non-repudiation, meaning that it becomes difficult for the signer to deny having signed something because the Digital Signature is unique to both the commit and the signer, and binds them together. Sherlock can now wholeheartedly vouch for the commit.

Consider the following scenario:

> Sherlock wants to send an urgent message to his fellow developer John W. telling that their application has been compromised by Jim M, a criminal mastermind who only has unkind intentions. John wants the guarantee that the message he received is sent by Sherlock and has not been tampered with by Jim.

In order to securely exchange messages, both Sherlock and John will make use of their **Key Pairs**. A Key Pair consists of a **Public and Private Key** which are two unique mathematically related cryptographic keys. As its name suggests, the Public Key is made available to everyone by handing out copies or sharing them through a publicly accessible repository. The Private Key however must be kept confidential to its respective owner.

Sherlock and John can do the following with the use of their Key Pair:

+ **Signing**
  - The message is still readable to everyone.
  - Guarantee of the sender's identity (aka Sherlock).
  - Guarantee that the message has not been tampered with since it has been signed by the sender (aka Sherlock).

+ **Encryption**
  - The message is only readable by the designated recipient (aka John).
  - No guarantee of the sender's identity (aka Sherlock).
  - Encryption can be done **symmetrically** by using a Shared Secret Key, a single key is then used for both encryption and decryption. **Asymmetrical** encryption (aka Public Key encryption) with a Public/Private Keypair uses one key for encryption and another for decryption. Note that the advantages and challenges of using either encryption type is beyond the scope of this blog post.

## Enforcing Trust

Sherlock will combine a digital signature with encryption to convince John that his message is trustworthy.

1. Sherlock wants to send the following message to John: `Data! Data! Data! I can’t make bricks without clay.`. He calculates the **Hash** of this message by applying a publicly known hashing algorithm to the message. The calculated hash by using the SHA-256 hashing algorithm is `d6ba26816599a75310c4c263126d4b44979c7026f90e1db8e9b317d6658f3811`. The hash value is unique to the hashed data.

2. Sherlock encrypts the Hash with his Private Key. This encrypted Hash together with a certificate containing additional information about the sender forms the Digital Signature. The reason why the Hash is encrypted and not the entire message, is that a hash function can convert an arbitrary input into a fixed length value which is usually much shorter than the original message. This saves time since hashing is much faster than signing.

4. Sherlock sends the original message and its Digital Signature to John.

5. John receives the message and Digital Signature.

6. Whatever is encrypted with a Public Key can only be decrypted by using its corresponding Private Key and vice versa. Therefore John uses Sherlock's Public Key to decrypt the Signature.

7. John also re-calculates the Hash of the original message by applying the same hashing algorithm as Sherlock.

8. John compares the Hash he calculated himself and the decrypted Hash received with Sherlock's message.
If they're identical he knows the message has not been tampered with during transit.
Should the message been compromised by Jim, then John would have calculated a different Hash than the encrypted Hash that Sherlock has sent along with his message.

<img class="image fit" alt="Digital Signature" src="/img/web-of-trusted-commits/digital_signature.png">

## Creating An Identity

In order to sign his commits, Sherlock decided to use **Gnu Privacy Guard (GPG)** as his weapon of choice. GPG is a complete and free implementation of the OpenPGP standard. It allows to encrypt and sign data and communication, features a versatile key management system as well as access modules for all kinds of public key directories.

+ Download and install GPG from the [official website](https://www.gnupg.org/download/)

+ Open a command prompt

      {% highlight bash %}
      # Generate a new Key Pair.
      $ gpg --gen-key
      {% endhighlight %}

+ Sherlock accepted the default `RSA and RSA` key. RSA is a widely-used asymmetric encryption algorithm and is named after Ron Rivest, Adi Shamir and Len Adleman who invented it in 1977. Should you be interested in more mathematical details how this algorithm works, I can highly recommend watching ["Public Key Cryptography: RSA Encryption Algorithm"](https://www.youtube.com/watch?v=wXB-V_Keiu8) on YouTube.

+ Enter the desired key size. I recommend the `maximum key size of 4096 bits` because they provide far better long-term security. While the default of 2048 bits is secure now, it won't be in the future. 1024 bit keys are already considered within the range of being breakable and while technology advances 2048 bit keys will also become breakable. Eventually 4096 bit keys will be broken too, but that will be so far in the future that better encryption algorithms will also likely have been developed by then.

+ Sherlock accepted the `default expiration` for his key.

+ He entered his `real name and email address`. Sherlock provided the verified email address for his GitHub account. This will make it very easy to link his account with his Public Key.

+ Provide a `secure passphrase`. Choose wisely and be sure to remember it because else the key cannot be used and any data encrypted using that key will be lost.

+ Congratulations, a newly fresh Key Pair should be generated now.
      {% highlight bash %}
      # List all keys.
      $ gpg --list-keys
        pub   4096R/90C3C3DE 2016-07-24
        uid     Sherlock H <sherlock.h@bakerstreet.org>
        sub   4096R/586B3A7B 2016-07-24
      {% endhighlight %}

+ Like many other developers, Sherlock is very active on GitHub and would like to link his Public Key with his account. He therefore will need to create a textual version of his Public Key. After having executed the command below, the content of the generated 'pubkey.txt' needs to be added to his account as described in the [GitHub Help pages](https://help.github.com/articles/adding-a-new-gpg-key-to-your-github-account/). More details about distributing and registering your Public Key to a key server can be found in the chapter '[Distributing keys](https://www.gnupg.org/gph/en/manual.html#AEN464)' of the GPG Users Guide. For other usages like encryption and decryption, please refer to [GPG's Mini HowTo](http://www.dewinter.com/gnupg_howto/english/GPGMiniHowto.html).

    {% highlight bash %}
    # Export the Public Key to a text file.
    $ gpg --armor --output pubkey.txt --export 'Sherlock H'
    {% endhighlight %}

## Signing Your Work
Once Sherlock generated his Key Pair, he can configure Git to use it for signing commits and tags. Following tools can be used to store a GPG key passphrase in a keychain so he doesn't have to provide it every time he signs a commit: [GPG Suite](https://gpgtools.org/) (Mac) or [Gpg4win](https://www.gpg4win.org/) (Windows).

  {% highlight bash %}
  # Set the signing key by taking your Public Key id as parameter.
  $ git config --global user.signingkey 90C3C3DE

  # Automatically signs every commit.
  $ git config --global commit.gpgsign true

  # Manually sign a commit.
  $ git commit -S -m "some commit message"

  # Verify whether your commit has been signed.
  $ git log --show-signature

    commit 81314da640320c65896a4348842d303a754f37d2
    gpg: Signature made Sun Jul 24 15:02:25 2016 CEST using RSA key ID 90C3C3DE
    gpg: Good signature from "Sherlock H <sherlock.h@bakerstreet.org>"
    Author: Sherlock H <sherlock.h@bakerstreet.org>
    Date:   Sun Jul 24 15:01:52 2016 +0200

  # Verify all signatures during merge. If the signatures can not be verified then merge will be aborted.
  $ git merge --verify-signatures other_branch
  {% endhighlight %}

Earlier this year GitHub [announced](https://github.com/blog/2144-gpg-signature-verification) that they now will show when commits and tags are signed and verified using any of the contributor's GPG keys upload to GitHub. Keep your eyes open for commits and tags labeled with those green `verified` badges.

## Secure-By-Design
Ordina's [Secure-By-Design programme](https://www.ordina.be/themes/security-and-privacy/) encourages to consider and take account of possible security risks as early as possible in a business process.
So follow Sherlock's example by embedding and safeguarding security in your daily work as a developer and **Sign Your Work!**

## Resources
+ [GitHub's Help on GPG](https://help.github.com/categories/gpg/)
+ [The GNU Privacy Handbook](https://www.gnupg.org/gph/en/manual/book1.html)
+ [GPG's Mini HowTo](http://www.dewinter.com/gnupg_howto/english/GPGMiniHowto.html)
+ ["A Git Horror Story"](https://mikegerwitz.com/papers/git-horror-story) by Mike Gerwitz
+ ["Public Key Cryptography: RSA Encryption Algorithm"](https://www.youtube.com/watch?v=wXB-V_Keiu8)
