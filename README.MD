# Cryptocurrency Creation Project on SOL DevNet using Ubuntu VM, Host machine and Raspberry PI

### Description



### Developer notes 

#### 26.8.2025 
Using 30-90 minutes to this on this tuesday evening. I would like to get the metadata generation for my token working on Solana Devnet. On previous days I used Metaboss but couldn't get it working. The command I used was:  
> metaboss create metadata --mint <MINT ADDRESS REDACTED> --metadata ./metadata.json --keypair ~/.config/solana/id.json  

Error I encountered was:  
> Error: Error processing Instruction 0: custom program error: 0xa  

Really tried to get around this error. The 0xa error translates to *DataTooLarge* which would indicate that the metadata.json file or a column there is too large. I thought that since the command structure itself is correct, the error must be caused by something inside the metadata.json file. It's likely a hidden character, a formatting issue, or a file encoding problem (like a BOM - Byte Order Mark) that is causing metaboss to create a data payload that is too large for the Solana program.  

Created a new metadata file that shouldn't have BOM formating but to no avail. I then decided to go forward with Official Metaplex Umi Library. Let's hope this works..  

In my Development setup I've made a mistake: I am using Windows host machine for coding and Ubuntu VM to execute all the minting operations.

#### 30.-31.8.2025  
One thing I don't like is namely simple tasks taking lot of time. I had a lot of problems with executing the metadata script. When googling and asking consultation from Google Gemini 2.5 Pro, I started receiving some working answers when first being led astray with Perplexity's GPT-5 model.  

The Content Identifier (CID) for the token.json file (the metadata file hosted on IPFS service) was of older CIDv0 format and not compatible with essentially caused the previous DataTooLarge error. 

Uploaded logo.png and metadata file to Pinata again via Web UI and now it was selected by default to be CIDv1. As I previously used CLI commands from Ubuntu terminal, it probably, due to older versioning or so, used CIDv0 by default? I indeed had some problems with older versions so that could very well make sense.
