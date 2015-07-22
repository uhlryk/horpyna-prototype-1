run:
	@DEBUG=server node js/index.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --check-leaks --timeout 3000 test \

#wywołuje pojedyńczy test
#make testone file=<nazwapliku bez .js>
testone:
	@DEBUG=server NODE_ENV=test ./node_modules/.bin/mocha --check-leaks --timeout 17000 test/$(file) \

.PHONY: test
