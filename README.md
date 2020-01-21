# Vandelay Exercise

This was an interesting challenge, especially in a short amount of time. I'm somewhat of a perfectionist when it comes to design, so I have a hard time letting things be imperfect sometimes. For this exercise I used NodeJS with Svelte for the front end. For the CSV parsing itself I didn't rely on any external libraries.

## To Build

If you have docker and docker compose installed all you need to do is run `docker-compose up -d` to launch this. It will run on port 5000 by default.

If you don't have docker installed, you will need node. Run `npm install` inside of the project directory to install the dependencies. Then run `npm run build` and `npm start` to build the Svelte app and start the server.

## Challenges

Taking poorly structured CSV files and turning them into something usable is always a challenge, but the biggest challenge here was merging duplicate records. I had a few bugs early on that forced me to refactor a little bit and ended up making my code better overall.

## Questions/Assumptions

I can't really say I have/had any. This was a fairly straightforward exercise. If I were to do it over again I'd probably use Vue over Svelte, since I basically had to roll my own Dropzone implementation for Svelte.

## Next Steps

If I were to keep going I'd first write tests. I hate not having them, but I was trying to move quickly. After that I'd probably work on improving the UI a little bit, maybe include a list of items that were merged and a history of CSV files that have been processed.

## Feedback

It was an interesting challenge. I like that it had somewhat real world applications, even if some things were probably dumbed down a little bit so they could fit into a short-ish challenge. I wasn't sure starting out if I could/should use any language, or if it would be best to keep it to more well known languages. Hence the reason I chose Node.
